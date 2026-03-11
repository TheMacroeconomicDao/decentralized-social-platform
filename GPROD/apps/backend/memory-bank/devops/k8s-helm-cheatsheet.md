# Kubernetes и Helm шпаргалка для GProd

## Основные команды Kubernetes

```bash
# Получить список всех подов в namespace develop-gprod
kubectl get pods -n develop-gprod

# Получить логи пода
kubectl logs -n develop-gprod <имя-пода>

# Зайти внутрь контейнера
kubectl exec -it -n develop-gprod <имя-пода> -- /bin/sh

# Применить манифест
kubectl apply -f k8s/dev/backend.yaml

# Перезапустить деплоймент
kubectl rollout restart deployment gprod-backend -n develop-gprod

# Проверить статус PVC
kubectl get pvc -n develop-gprod

# Проверить сертификаты
kubectl get certificate -n develop-gprod
```

## Основные команды Helm

```bash
# Установить/обновить релиз
helm upgrade --install gprod-backend ./helm/gprod-backend \
  -n develop-gprod --create-namespace \
  -f ./helm/gprod-backend/values-dev.yaml

# Откатить релиз к предыдущей версии
helm rollback gprod-backend -n develop-gprod

# Получить список релизов
helm list -n develop-gprod

# Удалить релиз
helm uninstall gprod-backend -n develop-gprod
```

## Структура Helm-чарта

```
helm/gprod-backend/
├── Chart.yaml          # Метаданные чарта
├── values.yaml         # Значения по умолчанию
├── values-dev.yaml     # Значения для dev-окружения
├── templates/
│   ├── deployment.yaml # Шаблон для Deployment
│   ├── service.yaml    # Шаблон для Service
│   ├── ingress.yaml    # Шаблон для Ingress
│   └── secret.yaml     # Шаблон для Secret
```

## Работа с секретами

### Создание секрета вручную

```bash
kubectl create secret generic gprod-backend-env \
  --from-env-file=.env.development \
  -n develop-gprod
```

### Проверка секрета

```bash
# Получить секрет (закодированные значения)
kubectl get secret gprod-backend-env -n develop-gprod -o yaml

# Декодировать конкретное значение
kubectl get secret gprod-backend-env -n develop-gprod \
  -o jsonpath="{.data.DATABASE\\_URL}" | base64 --decode
```

## Полезные ссылки

- Документация Kubernetes: https://kubernetes.io/docs/
- Документация Helm: https://helm.sh/docs/
- Примеры манифестов: https://github.com/kubernetes/examples
