# 🧹 Очистка истории Git от секретов

## ⚠️ КРИТИЧЕСКИ ВАЖНО

Перед выполнением очистки истории:
1. **Отзовите все токены и пароли**, которые были в репозитории
2. **Создайте резервную копию** репозитория
3. **Уведомите всех разработчиков** о необходимости переклонировать репозиторий

## 📋 Найденные секреты в истории

- **GitLab Root Password**: `73/sV+RgIpHNd9Go7w0SJoTGJoLvl71P3NwUDh2nUUk=`
- **GitLab Personal Access Token**: `glpat-JSzSIDGQnBl0ZKFy4Myt6286MQp1OjEH.01.0w1hvf5ve`
- **Коммит с токеном**: `6720ec9b` (файл `k8s/gitlab/TOKEN_SAVED.md`)

## 🔧 Метод 1: git-filter-repo (рекомендуется)

### Установка

```bash
# macOS
brew install git-filter-repo

# или через pip
pip install git-filter-repo
```

### Очистка

```bash
cd /Users/Gyber/GYBERNATY-ECOSYSTEM/DSP

# 1. Создать файл с заменой секретов
cat > /tmp/replace-secrets.txt <<EOF
73/sV+RgIpHNd9Go7w0SJoTGJoLvl71P3NwUDh2nUUk==>YOUR_GITLAB_ROOT_PASSWORD
glpat-JSzSIDGQnBl0ZKFy4Myt6286MQp1OjEH.01.0w1hvf5ve==>YOUR_GITLAB_TOKEN
https://gyber.org/lab==>https://gitlab.gyber.org
EOF

# 2. Заменить секреты в истории
git filter-repo --replace-text /tmp/replace-secrets.txt

# 3. Удалить файл с токеном из истории (если нужно)
git filter-repo --path k8s/gitlab/gitlab-token.env --invert-paths

# 4. Force push (ОСТОРОЖНО!)
git push origin --force --all
git push origin --force --tags
```

## 🔧 Метод 2: BFG Repo-Cleaner

### Установка

```bash
brew install bfg
```

### Очистка

```bash
cd /tmp

# 1. Клонировать как bare репозиторий
git clone --mirror https://github.com/TheMacroeconomicDao/decentralized-social-platform.git

# 2. Создать файл с заменой
cat > /tmp/replace-secrets.txt <<EOF
73/sV+RgIpHNd9Go7w0SJoTGJoLvl71P3NwUDh2nUUk==>YOUR_GITLAB_ROOT_PASSWORD
glpat-JSzSIDGQnBl0ZKFy4Myt6286MQp1OjEH.01.0w1hvf5ve==>YOUR_GITLAB_TOKEN
EOF

# 3. Заменить секреты
cd decentralized-social-platform.git
bfg --replace-text /tmp/replace-secrets.txt

# 4. Очистить
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 5. Force push
git push --force
```

## 🔧 Метод 3: git filter-branch (старый метод, не рекомендуется)

```bash
# Удалить файл из истории
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch k8s/gitlab/gitlab-token.env" \
  --prune-empty --tag-name-filter cat -- --all

# Очистить
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push origin --force --all
git push origin --force --tags
```

## ✅ После очистки

### 1. Проверка

```bash
# Проверить что секретов нет
git log --all -S "73/sV+RgIpHNd9Go7w0SJoTGJoLvl71P3NwUDh2nUUk="
git log --all -S "glpat-JSzSIDGQnBl0ZKFy4Myt6286MQp1OjEH"
git log --all --full-history -- "*gitlab-token*"
```

### 2. Настройка секретов правильно

#### GitHub Secrets
- Settings → Secrets and variables → Actions
- Добавить: `GHCR_TOKEN`, `KUBE_CONFIG`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`

#### GitLab CI/CD Variables
- Settings → CI/CD → Variables
- Добавить: `GHCR_TOKEN`, `KUBE_CONFIG`, `KUBE_CONTEXT`, `OPENAI_API_KEY`

#### Kubernetes Secrets
```bash
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=TheMacroeconomicDao \
  --docker-password=<YOUR_GHCR_TOKEN> \
  --namespace=default

kubectl create secret generic openai-secret \
  --from-literal=api-key=<YOUR_OPENAI_API_KEY> \
  --namespace=default
```

### 3. Уведомление разработчиков

Все должны:
```bash
# Удалить старый клон
rm -rf /path/to/repo

# Переклонировать
git clone https://github.com/TheMacroeconomicDao/decentralized-social-platform.git
```

## 🚨 Если секреты уже утекли

1. **Немедленно отозвать**:
   - GitLab: пересоздать root пароль и все токены
   - GitHub: отозвать PAT токены
   - OpenAI: пересоздать API ключи

2. **Очистить историю** (см. выше)

3. **Проверить доступы**: кто имел доступ к репозиторию

4. **Мониторинг**: следить за подозрительной активностью

## 📝 Текущий статус

- ✅ Секреты удалены из всех файлов
- ✅ `.gitignore` обновлен
- ✅ Файлы используют переменные окружения
- ⚠️ История Git требует очистки (коммит `6720ec9b` содержит токен)

