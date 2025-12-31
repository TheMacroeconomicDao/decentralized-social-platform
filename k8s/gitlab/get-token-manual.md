# 🔑 Получение GitLab токена вручную

## Быстрый способ

1. **Откройте GitLab**: https://gitlab.gyber.org

2. **Войдите**:
   - Логин: `root`
   - Пароль: получите командой:
   ```bash
   kubectl exec -n gitlab $(kubectl get pods -n gitlab -l app=gitlab -o jsonpath='{.items[0].metadata.name}') -- sh -c 'grep "Password:" /etc/gitlab/initial_root_password | awk "{print \$2}"'
   ```

3. **Создайте токен**:
   - Нажмите на аватар (правый верхний угол) → **Settings**
   - В левом меню выберите **Access Tokens**
   - Или перейдите напрямую: https://gitlab.gyber.org/-/user_settings/personal_access_tokens

4. **Настройте токен**:
   - **Token name**: `system-full-access`
   - **Expiration date**: через 1 год (или без срока)
   - **Select scopes**: выберите все:
     - ✅ `api`
     - ✅ `read_user`
     - ✅ `read_repository`
     - ✅ `write_repository`
     - ✅ `read_registry`
     - ✅ `write_registry`
     - ✅ `sudo`
     - ✅ `admin_mode`

5. **Создайте токен**: нажмите **Create personal access token**

6. **СОХРАНИТЕ ТОКЕН!** Он показывается только один раз.

7. **Сохраните в файл**:
   ```bash
   echo "ваш-токен-здесь" > k8s/gitlab/.gitlab-token
   chmod 600 k8s/gitlab/.gitlab-token
   ```

8. **Добавьте в переменные окружения**:
   ```bash
   ./k8s/gitlab/add-to-env.sh
   ```

## Альтернативный способ через API (если GitLab доступен)

```bash
# Получить root пароль
ROOT_PASS=$(kubectl exec -n gitlab $(kubectl get pods -n gitlab -l app=gitlab -o jsonpath='{.items[0].metadata.name}') -- sh -c 'grep "Password:" /etc/gitlab/initial_root_password | awk "{print \$2}"')

# Создать токен через API
TOKEN_RESPONSE=$(curl -k -s -X POST \
  -u "root:${ROOT_PASS}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "system-token-'$(date +%s)'",
    "scopes": ["api", "read_user", "read_repository", "write_repository", "read_registry", "write_registry", "sudo", "admin_mode"],
    "expires_at": "'$(date -u -v+1y +%Y-%m-%d 2>/dev/null || date -u -d '+1 year' +%Y-%m-%d)'"
  }' \
  "https://gitlab.gyber.org/api/v4/user/personal_access_tokens")

# Извлечь токен
TOKEN=$(echo "$TOKEN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Сохранить
echo "$TOKEN" > k8s/gitlab/.gitlab-token
chmod 600 k8s/gitlab/.gitlab-token

# Добавить в переменные окружения
./k8s/gitlab/add-to-env.sh
```


