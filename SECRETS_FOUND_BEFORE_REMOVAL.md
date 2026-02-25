# 🔐 Секреты найденные в репозитории перед удалением

**Дата**: $(date)
**ВНИМАНИЕ**: Этот файл содержит реальные секреты! НЕ коммитить в репозиторий!

---

## 1. GitLab Root Password

**Значение**: `73/sV+RgIpHNd9Go7w0SJoTGJoLvl71P3NwUDh2nUUk=`

**Найден в файлах**:
- `k8s/gitlab/create-token-playwright.js` (строка 11)
- `k8s/gitlab/add-to-hosts.sh` (строка 41)
- `k8s/gitlab/PROMPT_FOR_FIX.md` (строка 38)
- `k8s/gitlab/QUICK_FIX.md` (строка 63)
- `k8s/gitlab/DNS_SETUP.md` (строка 112)
- `k8s/gitlab/CURRENT_STATUS.md` (строка 31)
- `k8s/gitlab/custom/APPEARANCE_LINK.md` (строка 10)
- `k8s/gitlab/TOKEN_INFO.md` (строка 9)
- `k8s/gitlab/CURRENT_ERRORS_EXPLAINED.md` (строка 8)
- `k8s/gitlab/QUICK_ENV_SETUP.md` (строка 42)
- `k8s/gitlab/fix-dns-and-ssl.sh` (строка 183)
- `k8s/gitlab/custom/complete-branding.sh` (строка 51)
- `k8s/gitlab/custom/apply-gybernaty-branding.sh` (строка 128)
- `k8s/gitlab/WAIT_FOR_GITLAB.md` (строка 43)
- `k8s/gitlab/SUCCESS.md` (строка 27)
- `k8s/gitlab/STATUS.md` (строка 47)
- `k8s/gitlab/GYBER_ORG_SETUP.md` (строка 26)
- `k8s/gitlab/FIX_SUMMARY.md` (строка 84)
- `k8s/gitlab/DEPLOYMENT_SUMMARY.md` (строка 30)
- `k8s/gitlab/COMMUNITY_LAB_SETUP.md` (строка 38)

**Описание**: Пароль root пользователя GitLab для начального входа

---

## 2. GitLab Personal Access Token

**Значение**: `glpat-JSzSIDGQnBl0ZKFy4Myt6286MQp1OjEH.01.0w1hvf5ve`

**Найден в файлах**:
- `k8s/gitlab/gitlab-token.env` (строка 5)
- `k8s/gitlab/TOKEN_SAVED.md` (строка 5, 24)

**Описание**: Personal Access Token для GitLab API

---

## 3. GitLab URL (чувствительная информация)

**Значение**: `https://gyber.org/lab`

**Найден в файлах**:
- `k8s/gitlab/gitlab-token.env` (строка 6)

**Описание**: Внутренний URL GitLab сервера

---

## Действия после удаления

После удаления секретов из файлов:

1. **GitLab Root Password**: Пароль должен быть изменен в GitLab или получен заново через:
   ```bash
   kubectl exec -n gitlab $(kubectl get pods -n gitlab -l app=gitlab -o jsonpath='{.items[0].metadata.name}') -- grep 'Password:' /etc/gitlab/initial_root_password
   ```

2. **GitLab Token**: Токен должен быть пересоздан через GitLab UI или скрипты автоматизации

3. **GitLab URL**: Может быть восстановлен из конфигурации Kubernetes или переменных окружения

---

## ⚠️ ВАЖНО

- Этот файл содержит реальные секреты
- НЕ коммитить этот файл в репозиторий
- Добавить в `.gitignore`
- После проверки секретов - удалить этот файл или переместить в безопасное место

