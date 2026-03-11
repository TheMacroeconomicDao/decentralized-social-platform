# Руководство по миграции на модульную архитектуру

Это руководство описывает процесс перехода от старой структуры проекта к новой модульной архитектуре.

## 1. Миграция с EnvHelper на EnvironmentService

### Было:

```typescript
import { EnvHelper } from './common/helpers/env.helper';

function bootstrap() {
  const port = EnvHelper.getPort();
  const dbUrl = EnvHelper.getDatabaseUrl();
  
  // ...
}
```

### Стало:

```typescript
import { EnvironmentService } from './common/environment';

@Injectable()
class AppService {
  constructor(private readonly environment: EnvironmentService) {}
  
  getConfiguration() {
    const port = this.environment.getPort();
    const dbUrl = this.environment.getString('DATABASE_URL');
    // ...
  }
}
```

### Шаги миграции:

1. Добавьте EnvironmentModule в imports вашего модуля
2. Внедрите EnvironmentService через конструктор в ваш сервис
3. Замените вызовы `EnvHelper.method` на `this.environment.method`

## 2. Миграция с PrismaModule на DatabaseModule

### Было:

```typescript
import { PrismaService } from './common/prisma.module';

@Injectable()
class UserService {
  constructor(private prisma: PrismaService) {}
  
  async findUser(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
```

### Стало:

```typescript
import { PrismaService } from './common/database';

@Injectable()
class UserService {
  constructor(private prisma: PrismaService) {}
  
  async findUser(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
  
  async checkDbHealth() {
    // Новая функциональность
    return this.prisma.isHealthy();
  }
}
```

### Шаги миграции:

1. Обновите импорты с `./common/prisma.module` на `./common/database`
2. Замените PrismaModule на DatabaseModule в imports вашего модуля

## 3. Переход на модуль безопасности

### Было:

```typescript
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from './common/guards/roles.guard';

@Injectable()
class AuthService {
  constructor(private jwtService: JwtService) {}
  
  generateToken(payload: any) {
    return this.jwtService.sign(payload);
  }
}
```

### Стало:

```typescript
import { SecurityService } from './common/security';

@Injectable()
class AuthService {
  constructor(private security: SecurityService) {}
  
  generateToken(payload: any) {
    return this.security.generateToken(payload);
  }
}
```

### Шаги миграции:

1. Добавьте SecurityModule в imports вашего модуля
2. Внедрите SecurityService через конструктор
3. Используйте методы SecurityService вместо прямых зависимостей

## 4. Работа с Upload Module

Если требуется функциональность для работы с файлами:

```typescript
import { UploadService } from './common/upload';

@Injectable()
class FilesService {
  constructor(private uploadService: UploadService) {}
  
  async saveProfileImage(userId: string, file: Buffer) {
    return this.uploadService.saveFile(file, `profile-${userId}.jpg`, 'profiles');
  }
  
  async deleteFile(path: string) {
    return this.uploadService.deleteFile(path);
  }
}
```

## 5. Общие рекомендации

1. **Единая точка входа** - используйте импорты из `./common` вместо прямых импортов из подпапок
2. **Dependency Injection** - внедряйте зависимости через конструкторы
3. **Инкапсуляция** - инкапсулируйте логику в соответствующих сервисах
4. **Миграция по частям** - не обязательно мигрировать всё сразу, можно делать это поэтапно

## Плюсы после миграции

1. Лучшая тестируемость через возможность мокать сервисы
2. Более чистый код с явными зависимостями
3. Улучшенное логирование во всех сервисах
4. Легче внедрять новую функциональность
5. Удобное расширение существующих модулей 