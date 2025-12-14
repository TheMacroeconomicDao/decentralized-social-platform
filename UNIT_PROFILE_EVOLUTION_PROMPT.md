# Промпт для реализации Unit Profile Evolution 2025

## Контекст проекта

Ты работаешь над проектом **Gybernaty DSP (Decentralized Social Platform)** - децентрализованной социальной платформой для киберсоциальной корпорации Gybernaty, объединяющей прогрессивных исследователей и разработчиков.

### Философия Gybernaty
- **4 столпа**: Science, Technology, Innovation, Community
- **Миссия**: Реализация масштабной open source экосистемы для открытого образования и эффективного обмена опытом
- **Видение**: Глобальный хаб для продвинутых энтузиастов и разработчиков

### Технологический стек
- **Frontend**: Next.js 15.5.7, React 19.2.1, TypeScript 5.8.3
- **Web3**: Wagmi 2.15.6, RainbowKit 2.2.8, Viem 2.31.7
- **IPFS**: Helia 5.4.2, @helia/json 4.0.6, @helia/unixfs 5.0.3
- **Архитектура**: Feature-Sliced Design (FSD)
- **Стилизация**: SCSS/Sass
- **Анимации**: Framer Motion 12.23.24

### Структура проекта (FSD)
```
src/
├── app/              # Страницы Next.js
├── widgets/          # Композиционные компоненты
├── entities/         # Бизнес-сущности
├── features/         # Функциональные модули
│   ├── UnitProfile/  # Профиль пользователя
│   └── WalletAuth/   # Аутентификация через кошелек
└── shared/           # Переиспользуемые компоненты
    ├── hooks/        # Пользовательские хуки
    ├── lib/          # Утилиты
    ├── types/        # TypeScript типы
    └── ui/           # UI компоненты
```

## Текущее состояние Unit Profile

### Существующие файлы

**Типы:**
- `src/shared/types/unit-profile.ts` - интерфейс UnitProfile
- `src/shared/types/ipfs-storage.ts` - интерфейсы для IPFS (IPFSUserProfile, EncryptedData, etc.)

**Хуки:**
- `src/shared/hooks/useUnitProfile.ts` - основной хук для работы с профилем
  - Использует localStorage для хранения
  - Есть createUnitProfile, updateUnitProfile, logout
  - Unitname registry только в localStorage

**Компоненты:**
- `src/features/UnitProfile/ui/UnitProfileView/UnitProfileView.tsx` - просмотр профиля
- `src/features/UnitProfile/ui/UnitProfileEditor/UnitProfileEditor.tsx` - редактирование профиля
- `src/features/UnitProfile/ui/TeamsContribute/TeamsContribute.tsx` - команды и контрибуции (ХАРДКОД!)
- `src/app/unit-profile/page.tsx` - страница профиля (ХАРДКОД в строках 96-101, 124-138!)
- `src/app/unit-dashboard/page.tsx` - дашборд

**Данные:**
- `src/widgets/Team/data/teams.ts` - данные о командах (18 участников)
- `src/shared/data/mockUnitProfile.ts` - моковый профиль

### Критические проблемы

1. **Хардкод данных:**
   - `unit-profile/page.tsx:124-138`: Full Name, Email, Unit Type, Github - хардкод
   - `unit-profile/page.tsx:96-101`: Социальные ссылки - хардкод (не используют profile.socialLinks)
   - `TeamsContribute.tsx`: Полностью хардкод, нет связи с профилем

2. **Хранение:**
   - Только localStorage, нет IPFS синхронизации
   - Нет версионирования профиля
   - Нет backup/восстановления

3. **Unitname Registry:**
   - Только localStorage, нет глобальной проверки
   - Базовая валидация (regex), нет проверки резервированных слов

4. **Нефункциональные элементы:**
   - Tabs (Dashboard/Units/Projects) не работают
   - Select'ы (specialization, stack, qualifications) не функциональны
   - Links/Projects/Docs - только моки (Array.from({ length: 16 }))

5. **Отсутствующие функции:**
   - Нет загрузки аватара (только URL)
   - Нет связи с командами из teams.ts
   - Нет real-time обновления статистики
   - Нет системы репутации
   - Нет activity feed
   - Нет GitHub интеграции
   - Нет achievements/badges
   - Нет расширенных privacy settings
   - Нет поиска пользователей
   - Нет социального графа (follow/unfollow)

## Задачи для реализации

### Phase 1: Критические исправления (ПРИОРИТЕТ 1)

#### 1.1 Расширить UnitProfile interface
**Файл:** `src/shared/types/unit-profile.ts`

Добавить поля:
```typescript
export interface UnitProfile {
  // ... существующие поля ...
  
  // Новые обязательные поля
  fullName?: string;
  email?: string;
  unitType?: 'Lead Dev' | 'Frontend Dev' | 'Backend Dev' | 'Fullstack Dev' | 'DevOps' | 'Designer' | 'PM' | 'Researcher' | 'Other';
  specialization?: string; // Front End, Back End, Full Stack, etc.
  stack?: string[]; // ['React', 'TypeScript', 'Solidity']
  qualifications?: 'Junior' | 'Middle' | 'Senior' | 'Lead' | 'Architect';
  
  // Расширенные данные
  links?: Array<{
    id: string;
    title: string;
    url: string;
    icon?: string;
    type: 'project' | 'article' | 'resource' | 'other';
  }>;
  
  projects?: Array<{
    id: string;
    name: string;
    description?: string;
    url?: string;
    githubUrl?: string;
    status: 'active' | 'completed' | 'archived';
    technologies?: string[];
    createdAt: number;
  }>;
  
  docs?: Array<{
    id: string;
    title: string;
    url: string;
    type: 'documentation' | 'paper' | 'tutorial' | 'other';
    createdAt: number;
  }>;
  
  // Связь с командами
  teams?: Array<{
    id: number;
    name: string;
    role?: string;
    joinedAt: number;
  }>;
  
  contributions?: Array<{
    id: string;
    project: string;
    type: 'code' | 'design' | 'documentation' | 'research' | 'other';
    description?: string;
    url?: string;
    createdAt: number;
  }>;
  
  // Версионирование
  version?: number;
  ipfsHash?: string; // CID последней версии в IPFS
  previousVersions?: Array<{
    version: number;
    ipfsHash: string;
    updatedAt: number;
  }>;
  
  // Privacy settings
  privacy?: {
    profileVisibility: 'public' | 'friends' | 'private';
    fieldVisibility: {
      email: 'public' | 'friends' | 'private';
      location: 'public' | 'friends' | 'private';
      skills: 'public' | 'friends' | 'private';
      // ... другие поля
    };
  };
  
  // Notifications
  notifications?: {
    pushEnabled: boolean;
    emailEnabled: boolean;
    inAppEnabled: boolean;
    types: {
      messages: boolean;
      mentions: boolean;
      achievements: boolean;
      contributions: boolean;
    };
  };
}
```

#### 1.2 Убрать хардкод из unit-profile/page.tsx
**Файл:** `src/app/unit-profile/page.tsx`

**Строки 96-101:** Заменить хардкод социальных ссылок на:
```tsx
<div className={cls.socialLinks}>
  {profile.socialLinks?.telegram && (
    <a href={profile.socialLinks.telegram} className={cls.socialLink} target="_blank" rel="noopener noreferrer">📱</a>
  )}
  {profile.socialLinks?.github && (
    <a href={profile.socialLinks.github} className={cls.socialLink} target="_blank" rel="noopener noreferrer">🐙</a>
  )}
  {profile.socialLinks?.twitter && (
    <a href={profile.socialLinks.twitter} className={cls.socialLink} target="_blank" rel="noopener noreferrer">🐦</a>
  )}
  {profile.socialLinks?.discord && (
    <a href={profile.socialLinks.discord} className={cls.socialLink} target="_blank" rel="noopener noreferrer">🎮</a>
  )}
</div>
```

**Строки 124-138:** Заменить хардкод на данные из профиля:
```tsx
<div className={cls.infoRow}>
  <span className={cls.label}>Full Name:</span>
  <span className={cls.value}>{profile.fullName || 'Not set'}</span>
</div>
<div className={cls.infoRow}>
  <span className={cls.label}>Unit Type:</span>
  <span className={cls.value}>{profile.unitType || 'Not set'}</span>
</div>
<div className={cls.infoRow}>
  <span className={cls.label}>Email:</span>
  <span className={cls.value}>{profile.email || 'Not set'}</span>
</div>
<div className={cls.infoRow}>
  <span className={cls.label}>Github:</span>
  <span className={cls.value}>
    {profile.socialLinks?.github ? (
      <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer">
        {profile.socialLinks.github.replace('https://github.com/', '/')}
      </a>
    ) : 'Not set'}
  </span>
</div>
```

#### 1.3 Исправить TeamsContribute компонент
**Файл:** `src/features/UnitProfile/ui/TeamsContribute/TeamsContribute.tsx`

Заменить хардкод на данные из профиля:
```tsx
export const TeamsContribute = ({ className }: TeamsContributeProps) => {
  const { profile } = useUnitProfile();
  
  if (!profile) return null;
  
  return (
    <div className={`${cls.TeamsContribute} ${className || ''}`}>
      <div className={cls.section}>
        <h4 className={cls.title}>Teams:</h4>
        <div className={cls.teamsContent}>
          {profile.teams && profile.teams.length > 0 ? (
            profile.teams.map((team) => (
              <p key={team.id} className={cls.teamText}>
                {team.name}{team.role ? `: ${team.role}` : ''}
              </p>
            ))
          ) : (
            <p className={cls.teamText}>No teams assigned</p>
          )}
        </div>
      </div>

      <div className={cls.section}>
        <h4 className={cls.title}>Contributions:</h4>
        <div className={cls.contributeContent}>
          {profile.contributions && profile.contributions.length > 0 ? (
            profile.contributions.map((contribution) => (
              <div key={contribution.id} className={cls.contributionGroup}>
                <h5 className={cls.contributionTitle}>{contribution.project}:</h5>
                <ul className={cls.contributionList}>
                  <li className={cls.contributionItem}>
                    {contribution.type} - {contribution.description || 'No description'}
                  </li>
                </ul>
              </div>
            ))
          ) : (
            <p className={cls.teamText}>No contributions yet</p>
          )}
        </div>
      </div>
    </div>
  );
};
```

#### 1.4 Реализовать функциональные select'ы
**Файл:** `src/app/unit-profile/page.tsx` (строки 145-177)

Заменить статичные select'ы на функциональные с сохранением:
```tsx
<div className={cls.specialisation}>
  <h4>*Specialisation:</h4>
  <select 
    className={cls.select}
    value={profile.specialization || ''}
    onChange={(e) => updateUnitProfile({ specialization: e.target.value })}
  >
    <option value="">Select</option>
    <option value="Front End">Front End</option>
    <option value="Back End">Back End</option>
    <option value="Full Stack">Full Stack</option>
    <option value="DevOps">DevOps</option>
    <option value="Design">Design</option>
    <option value="Research">Research</option>
  </select>
</div>

<div className={cls.stack}>
  <h4>*Stack:</h4>
  <select 
    className={cls.select}
    value=""
    onChange={(e) => {
      if (e.target.value) {
        const newStack = [...(profile.stack || []), e.target.value];
        updateUnitProfile({ stack: newStack });
        e.target.value = '';
      }
    }}
  >
    <option value="">Add technology</option>
    <option value="React">React</option>
    <option value="TypeScript">TypeScript</option>
    <option value="Solidity">Solidity</option>
    <option value="Node.js">Node.js</option>
    {/* ... больше опций */}
  </select>
  {profile.stack && profile.stack.length > 0 && (
    <div className={cls.stackTags}>
      {profile.stack.map((tech, idx) => (
        <span key={idx} className={cls.stackTag}>
          {tech}
          <button onClick={() => {
            const newStack = profile.stack!.filter((_, i) => i !== idx);
            updateUnitProfile({ stack: newStack });
          }}>×</button>
        </span>
      ))}
    </div>
  )}
</div>

<div className={cls.qualifications}>
  <h4>Qualifications:</h4>
  <select 
    className={cls.select}
    value={profile.qualifications || ''}
    onChange={(e) => updateUnitProfile({ qualifications: e.target.value as any })}
  >
    <option value="">Select</option>
    <option value="Junior">Junior</option>
    <option value="Middle">Middle</option>
    <option value="Senior">Senior</option>
    <option value="Lead">Lead</option>
    <option value="Architect">Architect</option>
  </select>
</div>

<div className={cls.language}>
  <h4>Language:</h4>
  <select 
    className={cls.select}
    value={profile.preferences?.language || 'en'}
    onChange={(e) => updateUnitProfile({ 
      preferences: { ...profile.preferences, language: e.target.value as any }
    })}
  >
    <option value="en">English</option>
    <option value="ru">Русский</option>
    <option value="auto">Auto</option>
  </select>
</div>

<div className={cls.visibility}>
  <h4>Profile visibility:</h4>
  <select
    className={cls.select}
    value={profile.privacy?.profileVisibility || 'public'}
    onChange={(e) => updateUnitProfile({
      privacy: {
        ...profile.privacy,
        profileVisibility: e.target.value as any
      }
    })}
  >
    <option value="public">Public</option>
    <option value="friends">Friends only</option>
    <option value="private">Private</option>
  </select>
</div>
```

#### 1.5 Реализовать функциональные табы
**Файл:** `src/app/unit-profile/page.tsx`

Добавить контент для каждого таба:
```tsx
<div className={cls.content}>
  {activeTab === 'Dashboard' && (
    <div className={cls.dashboardContent}>
      <UnitProfileView />
      {/* Статистика, активность, etc. */}
    </div>
  )}
  
  {activeTab === 'Units' && (
    <div className={cls.unitsContent}>
      <h2>My Units</h2>
      {/* Список юнитов/команд пользователя */}
      {profile.teams && profile.teams.length > 0 ? (
        <div className={cls.unitsList}>
          {profile.teams.map(team => (
            <div key={team.id} className={cls.unitCard}>
              <h3>{team.name}</h3>
              {team.role && <p>Role: {team.role}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p>No units assigned</p>
      )}
    </div>
  )}
  
  {activeTab === 'Projects' && (
    <div className={cls.projectsContent}>
      <h2>My Projects</h2>
      {profile.projects && profile.projects.length > 0 ? (
        <div className={cls.projectsList}>
          {profile.projects.map(project => (
            <div key={project.id} className={cls.projectCard}>
              <h3>{project.name}</h3>
              {project.description && <p>{project.description}</p>}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  View on GitHub
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No projects yet</p>
      )}
    </div>
  )}
</div>
```

#### 1.6 Реализовать CRUD для Links/Projects/Docs
**Файл:** `src/app/unit-profile/page.tsx` (строки 182-226)

Заменить моки на реальный функционал:
```tsx
<div className={cls.section}>
  <div className={cls.sectionHeader}>
    <h3>Links</h3>
    <button 
      className={cls.addButton}
      onClick={() => {
        const newLink = {
          id: Date.now().toString(),
          title: 'New Link',
          url: '',
          type: 'other' as const
        };
        updateUnitProfile({
          links: [...(profile.links || []), newLink]
        });
      }}
    >+</button>
  </div>
  <div className={cls.linksGrid}>
    {profile.links && profile.links.length > 0 ? (
      profile.links.map((link) => (
        <div key={link.id} className={cls.linkItem}>
          <div className={cls.linkIcon}>{link.icon || '🔗'}</div>
          <span>{link.title}</span>
          <a href={link.url} target="_blank" rel="noopener noreferrer">Open</a>
          <button onClick={() => {
            updateUnitProfile({
              links: profile.links!.filter(l => l.id !== link.id)
            });
          }}>Delete</button>
        </div>
      ))
    ) : (
      <p>No links added yet</p>
    )}
  </div>
</div>

{/* Аналогично для Projects и Docs */}
```

### Phase 2: IPFS интеграция

#### 2.1 Создать IPFS клиент
**Файл:** `src/shared/lib/ipfs/IPFSClient.ts`

```typescript
import { createHelia } from 'helia';
import { json } from '@helia/json';
import { unixfs } from '@helia/unixfs';
import type { Helia } from 'helia';
import type { UnitProfile } from '@/shared/types/unit-profile';

class IPFSClient {
  private helia: Helia | null = null;
  private json: ReturnType<typeof json> | null = null;
  private fs: ReturnType<typeof unixfs> | null = null;
  private isInitialized = false;

  async init(): Promise<void> {
    if (this.isInitialized) return;
    
    this.helia = await createHelia();
    this.json = json(this.helia);
    this.fs = unixfs(this.helia);
    this.isInitialized = true;
  }

  async uploadProfile(profile: UnitProfile): Promise<string> {
    if (!this.isInitialized) await this.init();
    if (!this.json) throw new Error('IPFS not initialized');

    const cid = await this.json.add(profile);
    return cid.toString();
  }

  async getProfile(cid: string): Promise<UnitProfile | null> {
    if (!this.isInitialized) await this.init();
    if (!this.json) throw new Error('IPFS not initialized');

    try {
      const profile = await this.json.get(cid);
      return profile as UnitProfile;
    } catch (error) {
      console.error('Error fetching profile from IPFS:', error);
      return null;
    }
  }

  async uploadAvatar(file: File): Promise<string> {
    if (!this.isInitialized) await this.init();
    if (!this.fs) throw new Error('IPFS not initialized');

    const arrayBuffer = await file.arrayBuffer();
    const cid = await this.fs.addBytes(new Uint8Array(arrayBuffer));
    return cid.toString();
  }
}

export const ipfsClient = new IPFSClient();
```

#### 2.2 Обновить useUnitProfile для IPFS синхронизации
**Файл:** `src/shared/hooks/useUnitProfile.ts`

**ВАЖНО:** Добавить методы и обновить возвращаемое значение хука:

```typescript
import { ipfsClient } from '@/shared/lib/ipfs/IPFSClient';

// В useUnitProfile добавить:
const syncToIPFS = useCallback(async (): Promise<string | null> => {
  if (!state.profile || !mounted) return null;
  
  try {
    const cid = await ipfsClient.uploadProfile(state.profile);
    
    // Сохранить CID в профиль
    const updatedProfile = {
      ...state.profile,
      ipfsHash: cid,
      version: (state.profile.version || 0) + 1,
      previousVersions: [
        ...(state.profile.previousVersions || []),
        {
          version: state.profile.version || 0,
          ipfsHash: state.profile.ipfsHash || '',
          updatedAt: Date.now()
        }
      ]
    };
    
    await updateUnitProfile(updatedProfile);
    return cid;
  } catch (error) {
    console.error('Error syncing to IPFS:', error);
    setState(prev => ({ ...prev, error: 'Failed to sync to IPFS' }));
    return null;
  }
}, [state.profile, mounted, updateUnitProfile]);

const loadFromIPFS = useCallback(async (cid: string): Promise<UnitProfile | null> => {
  if (!mounted) return null;
  
  setState(prev => ({ ...prev, isLoading: true }));
  
  try {
    const profile = await ipfsClient.getProfile(cid);
    if (profile) {
      setState({ profile, isLoading: false, error: null });
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      }
    }
    return profile;
  } catch (error) {
    console.error('Error loading from IPFS:', error);
    setState(prev => ({ ...prev, isLoading: false, error: 'Failed to load from IPFS' }));
    return null;
  }
}, [mounted]);

// Обновить updateUnitProfile для автоматической синхронизации с IPFS (опционально)
const updateUnitProfileWithIPFS = useCallback(async (updates: Partial<UnitProfile>): Promise<void> => {
  await updateUnitProfile(updates);
  // Опционально: автоматическая синхронизация с IPFS
  // await syncToIPFS();
}, [updateUnitProfile]);
```

**Обновить возвращаемое значение хука:**
```typescript
return {
  ...state,
  isWalletConnected: isConnected,
  walletAddress: address,
  createUnitProfile,
  updateUnitProfile,
  updateUnitProfileWithIPFS, // Новый метод
  checkUnitnameAvailability,
  logout,
  clearError,
  syncToIPFS, // Новый метод
  loadFromIPFS, // Новый метод
};
```

**Также обновить SSR fallback:**
```typescript
if (!mounted) {
  return {
    // ... существующие поля ...
    syncToIPFS: async () => null,
    loadFromIPFS: async () => null,
    updateUnitProfileWithIPFS: async () => {},
  };
}
```

### Phase 3: Unitname Registry

#### 3.1 Создать Unitname Registry сервис
**Файл:** `src/shared/lib/registry/UnitnameRegistry.ts`

**ВАЖНО:** После создания этого сервиса нужно обновить `useUnitProfile.ts` для его использования.

```typescript
import { ipfsClient } from '../ipfs/IPFSClient';

const RESERVED_NAMES = ['admin', 'system', 'root', 'gybernaty', 'dsp', 'api', 'www'];

export class UnitnameRegistry {
  private registryCache: Map<string, string> = new Map();

  async checkAvailability(unitname: string): Promise<{
    available: boolean;
    reason?: string;
  }> {
    // Валидация
    if (!unitname || unitname.length < 3 || unitname.length > 20) {
      return { available: false, reason: 'Unitname must be 3-20 characters' };
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(unitname)) {
      return { available: false, reason: 'Only alphanumeric, underscore and dash allowed' };
    }

    const normalized = unitname.toLowerCase();
    
    // Проверка резервированных имен
    if (RESERVED_NAMES.includes(normalized)) {
      return { available: false, reason: 'This unitname is reserved' };
    }

    // Проверка в локальном кеше
    if (this.registryCache.has(normalized)) {
      return { available: false, reason: 'Unitname already taken' };
    }

    // Проверка в IPFS (глобальный реестр)
    // TODO: Реализовать проверку через IPFS или блокчейн
    
    return { available: true };
  }

  async register(unitname: string, address: string): Promise<boolean> {
    const check = await this.checkAvailability(unitname);
    if (!check.available) {
      throw new Error(check.reason || 'Unitname not available');
    }

    const normalized = unitname.toLowerCase();
    this.registryCache.set(normalized, address);
    
    // Сохранить в IPFS/блокчейн
    // TODO: Реализовать сохранение в децентрализованный реестр
    
    return true;
  }

  async resolve(unitname: string): Promise<string | null> {
    const normalized = unitname.toLowerCase();
    return this.registryCache.get(normalized) || null;
  }
}

export const unitnameRegistry = new UnitnameRegistry();
```

#### 3.2 Интегрировать UnitnameRegistry в useUnitProfile
**Файл:** `src/shared/hooks/useUnitProfile.ts`

**Обновить checkUnitnameAvailability:**
```typescript
import { unitnameRegistry } from '@/shared/lib/registry/UnitnameRegistry';

const checkUnitnameAvailability = useCallback(async (unitname: string): Promise<boolean> => {
  if (!mounted || typeof window === 'undefined') return false;
  
  try {
    const result = await unitnameRegistry.checkAvailability(unitname);
    return result.available;
  } catch (error) {
    console.error('Error checking unitname availability:', error);
    return false;
  }
}, [mounted]);
```

**Обновить createUnitProfile для использования registry:**
```typescript
const createUnitProfile = useCallback(async (unitname: string): Promise<void> => {
  // ... существующий код проверки ...
  
  try {
    // Использовать новый registry
    await unitnameRegistry.register(unitname, address);
    
    // ... остальной код создания профиля ...
  } catch (error) {
    // Обработать ошибку регистрации
    if (error instanceof Error && error.message.includes('not available')) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message
      }));
      return;
    }
    throw error;
  }
}, [/* ... */]);
```

### Phase 4: Загрузка аватара

#### 4.1 Компонент загрузки аватара
**Файл:** `src/features/UnitProfile/ui/AvatarUpload/AvatarUpload.tsx`

```tsx
'use client';

import { useState } from 'react';
import { useUnitProfile } from '@/shared/hooks/useUnitProfile';
import { ipfsClient } from '@/shared/lib/ipfs/IPFSClient';
import cls from './AvatarUpload.module.scss';

export const AvatarUpload = () => {
  const { profile, updateUnitProfile } = useUnitProfile();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    // Валидация
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      alert('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Загрузить в IPFS
      const cid = await ipfsClient.uploadAvatar(file);
      const ipfsUrl = `https://ipfs.io/ipfs/${cid}`;
      
      // Обновить профиль
      await updateUnitProfile({ avatar: ipfsUrl });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={cls.avatarUpload}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
        id="avatar-upload"
        style={{ display: 'none' }}
      />
      <label htmlFor="avatar-upload" className={cls.uploadButton}>
        {isUploading ? 'Uploading...' : 'Change Avatar'}
      </label>
    </div>
  );
};
```

### Phase 5: Интеграция с командами

#### 5.1 Связать профиль с teams.ts
**Файл:** `src/shared/lib/teams/teamService.ts`

**ВАЖНО:** Нужно обновить структуру teams.ts для правильного маппинга. Проверь существующий файл `src/widgets/Team/data/teams.ts` - там есть поля `id`, `fullName`, `skills`, `link`.

```typescript
import { teams } from '@/widgets/Team/data/teams';
import type { UnitProfile } from '@/shared/types/unit-profile';

export const findUserTeams = (address: string): UnitProfile['teams'] => {
  // Найти команды пользователя по адресу или другим критериям
  // Пока используем моковую логику
  return teams
    .filter(team => team.link?.includes(address) || false)
    .map(team => ({
      id: team.id,
      name: team.fullName,
      role: team.skills,
      joinedAt: Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 // Рандомная дата
    }));
};

export const syncTeamsToProfile = async (
  profile: UnitProfile,
  updateProfile: (updates: Partial<UnitProfile>) => Promise<void>
): Promise<void> => {
  const userTeams = findUserTeams(profile.address);
  if (userTeams && userTeams.length > 0) {
    await updateProfile({ teams: userTeams });
  }
};

// Хук для автоматической синхронизации при загрузке профиля
import { useEffect } from 'react';
import { useUnitProfile } from '@/shared/hooks/useUnitProfile';

export const useTeamsSync = () => {
  const { profile, updateUnitProfile } = useUnitProfile();
  
  useEffect(() => {
    if (profile && (!profile.teams || profile.teams.length === 0)) {
      syncTeamsToProfile(profile, updateUnitProfile).catch(console.error);
    }
  }, [profile?.address]); // Синхронизировать только при смене адреса
};
```

#### 5.2 Использовать синхронизацию команд
**Файл:** `src/app/unit-profile/page.tsx` или `src/app/unit-dashboard/page.tsx`

Добавить хук для автоматической синхронизации:
```tsx
import { useTeamsSync } from '@/shared/lib/teams/teamService';

export default function UnitProfilePage() {
  const { profile } = useUnitProfile();
  useTeamsSync(); // Автоматическая синхронизация команд
  
  // ... остальной код ...
}
```

## Дополнительные важные задачи

### 1.7 Обновить UnitProfileEditor для новых полей
**Файл:** `src/features/UnitProfile/ui/UnitProfileEditor/UnitProfileEditor.tsx`

Добавить поля в форму:
- fullName (input)
- email (input с валидацией)
- unitType (select)
- specialization (select)
- stack (multi-select или tags input)
- qualifications (select)
- links (динамический список с CRUD)
- projects (динамический список с CRUD)
- docs (динамический список с CRUD)

**Пример для fullName и email:**
```tsx
<div className={cls.inputGroup}>
  <label htmlFor="fullName" className={cls.label}>Full Name</label>
  <input
    id="fullName"
    type="text"
    value={formData.fullName || ''}
    onChange={(e) => handleInputChange('fullName', e.target.value)}
    placeholder="Enter your full name"
    className={cls.input}
  />
</div>

<div className={cls.inputGroup}>
  <label htmlFor="email" className={cls.label}>Email</label>
  <input
    id="email"
    type="email"
    value={formData.email || ''}
    onChange={(e) => handleInputChange('email', e.target.value)}
    placeholder="your.email@example.com"
    className={classNames(cls.input, {
      [cls.error]: !!errors.email
    })}
  />
  {errors.email && <span className={cls.errorMessage}>{errors.email}</span>}
</div>
```

**Добавить валидацию email в validateForm:**
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (formData.email && !emailRegex.test(formData.email)) {
  newErrors.email = 'Please enter a valid email address';
}
```

### 1.8 Миграция существующих профилей
**Файл:** `src/shared/hooks/useUnitProfile.ts`

Добавить функцию миграции для старых профилей:
```typescript
const migrateProfile = useCallback((profile: UnitProfile): UnitProfile => {
  // Добавить дефолтные значения для новых полей
  return {
    ...profile,
    version: profile.version || 1,
    privacy: profile.privacy || {
      profileVisibility: 'public',
      fieldVisibility: {
        email: 'private',
        location: 'public',
        skills: 'public',
      }
    },
    notifications: profile.notifications || {
      pushEnabled: true,
      emailEnabled: false,
      inAppEnabled: true,
      types: {
        messages: true,
        mentions: true,
        achievements: true,
        contributions: true,
      }
    },
    // Остальные поля уже optional, так что undefined допустимо
  };
}, []);

// Использовать в useEffect при загрузке профиля:
useEffect(() => {
  // ... существующий код ...
  if (savedProfile && savedSignature && isConnected && address) {
    try {
      const profile: UnitProfile = JSON.parse(savedProfile);
      const migratedProfile = migrateProfile(profile); // Миграция
      // ... остальной код ...
    }
  }
}, [/* ... */]);
```

### 1.9 Обновить экспорты
**Файл:** `src/features/UnitProfile/index.ts`

Убедиться, что все компоненты экспортированы:
```typescript
export { UnitProfileView } from './ui/UnitProfileView/UnitProfileView';
export { UnitProfileEditor } from './ui/UnitProfileEditor/UnitProfileEditor';
export { TeamsContribute } from './ui/TeamsContribute/TeamsContribute';
export { AvatarUpload } from './ui/AvatarUpload/AvatarUpload'; // Новый компонент
```

### 1.10 Обновить mockUnitProfile для тестирования
**Файл:** `src/shared/data/mockUnitProfile.ts`

Добавить новые поля в моковый профиль для тестирования:
```typescript
export const mockUnitProfile: UnitProfile = {
  // ... существующие поля ...
  fullName: 'Cyber Pioneer',
  email: 'cyber@example.com',
  unitType: 'Lead Dev',
  specialization: 'Full Stack',
  stack: ['React', 'TypeScript', 'Solidity'],
  qualifications: 'Senior',
  links: [/* ... */],
  projects: [/* ... */],
  docs: [/* ... */],
  teams: [/* ... */],
  contributions: [/* ... */],
  version: 1,
  privacy: { /* ... */ },
  notifications: { /* ... */ },
};
```

### 1.11 Добавить стили для новых компонентов
**Файлы:**
- `src/features/UnitProfile/ui/AvatarUpload/AvatarUpload.module.scss`
- Обновить существующие `.module.scss` файлы для новых элементов

**Пример для AvatarUpload:**
```scss
.avatarUpload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  .uploadButton {
    padding: 8px 16px;
    background: #d49d32;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: #b88728;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}
```

### 1.12 Использовать существующие UI компоненты
**Важно:** Использовать компоненты из `shared/ui/`:
- `Button` из `@/shared/ui/Button/Button`
- `Toast` из `@/shared/ui/Toast` (уже используется в UnitProfileView)
- `SafeImage` из `@/shared/ui/SafeImage` (уже используется)

**Пример:**
```tsx
import { Button, ThemeButton } from '@/shared/ui/Button/Button';
import { useToast } from '@/shared/hooks/useToast';

// В компоненте:
const { success, error } = useToast();

// При успешной операции:
success('Profile updated successfully');

// При ошибке:
error('Failed to update profile');
```

## Инструкции по реализации

### Порядок выполнения

1. **Начни с Phase 1.1** - Расширь интерфейс UnitProfile
2. **Phase 1.7** - Обновить UnitProfileEditor для новых полей
3. **Phase 1.8** - Добавить миграцию существующих профилей
4. **Phase 1.2-1.3** - Убери весь хардкод
5. **Phase 1.4-1.6** - Реализуй функциональные элементы
6. **Phase 1.9-1.12** - Обновить экспорты, моки, стили
7. **Phase 2** - IPFS интеграция
8. **Phase 3** - Unitname Registry
9. **Phase 4** - Загрузка аватара
10. **Phase 5** - Интеграция с командами

### Правила

1. **Всегда читай существующие файлы перед изменением**
2. **Следуй Feature-Sliced Design архитектуре**
3. **Используй TypeScript строго**
4. **Тестируй каждый компонент после создания**
5. **Сохраняй обратную совместимость** - существующие профили должны работать
6. **Используй существующие UI компоненты** из `shared/ui/`
7. **Добавляй loading states и error handling** везде
8. **Валидируй все пользовательские вводы**

### Важные замечания

- **Не ломай существующий функционал** - профили в localStorage должны продолжать работать
- **IPFS интеграция должна быть опциональной** - если IPFS недоступен, использовать localStorage
- **Все изменения должны быть backward compatible**
- **Используй существующие стили** из `.module.scss` файлов
- **Следуй паттернам проекта** - смотри на существующие компоненты

### Тестирование

После каждого этапа проверь:

**Phase 1:**
1. ✅ Профиль загружается из localStorage
2. ✅ Старые профили мигрируются корректно (новые поля имеют дефолты)
3. ✅ Редактирование профиля работает
4. ✅ Новые поля сохраняются и отображаются
5. ✅ Хардкод заменен на данные из профиля
6. ✅ Select'ы и табы функциональны
7. ✅ Валидация форм работает (email, URLs)
8. ✅ CRUD для Links/Projects/Docs работает

**Phase 2:**
9. ✅ IPFS клиент инициализируется
10. ✅ Профиль загружается в IPFS и получает CID
11. ✅ Профиль загружается из IPFS по CID
12. ✅ Версионирование работает (previousVersions обновляется)
13. ✅ Fallback на localStorage если IPFS недоступен

**Phase 3:**
14. ✅ Unitname валидация работает (длина, формат, резервированные имена)
15. ✅ Проверка доступности unitname работает
16. ✅ Регистрация unitname работает

**Phase 4:**
17. ✅ Загрузка аватара работает
18. ✅ Валидация файла (тип, размер)
19. ✅ Аватар сохраняется в IPFS
20. ✅ URL аватара обновляется в профиле

**Phase 5:**
21. ✅ Связь с командами работает
22. ✅ Teams отображаются в профиле
23. ✅ Contributions отображаются

**Общее:**
24. ✅ Нет ошибок в консоли
25. ✅ TypeScript компилируется без ошибок
26. ✅ Все компоненты экспортированы
27. ✅ Стили применяются корректно

## Дополнительные улучшения (опционально)

После реализации основных задач можно добавить:

1. **Система репутации** - расчет на основе активности
2. **Activity Feed** - история действий пользователя
3. **GitHub интеграция** - автоматический импорт контрибуций
4. **Achievements/Badges** - система достижений
5. **Расширенные privacy settings** - гранулярный контроль видимости
6. **Поиск пользователей** - поиск по unitname
7. **Социальный граф** - follow/unfollow система
8. **Real-time обновления** - WebSocket/SSE

## Дополнительные технические детали

### Обработка ошибок IPFS

IPFS может быть недоступен или медленным. Всегда делай fallback:

```typescript
try {
  const cid = await ipfsClient.uploadProfile(profile);
  // Успех
} catch (error) {
  console.warn('IPFS unavailable, using localStorage only:', error);
  // Продолжаем работу с localStorage
  // Не показываем ошибку пользователю, если это не критично
}
```

### Валидация данных

Всегда валидируй перед сохранением:

```typescript
const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
```

### Оптимизация производительности

- Используй `useCallback` для функций, передаваемых в дочерние компоненты
- Используй `useMemo` для вычисляемых значений
- Делай lazy loading для IPFS клиента (инициализация только при необходимости)

### Безопасность

- Никогда не храни приватные ключи в localStorage
- Валидируй все пользовательские вводы на клиенте и сервере
- Используй HTTPS для всех запросов
- Санитизируй данные перед отображением (XSS защита)

## Структура файлов после реализации

```
src/
├── shared/
│   ├── types/
│   │   └── unit-profile.ts (обновлен)
│   ├── hooks/
│   │   └── useUnitProfile.ts (обновлен)
│   └── lib/
│       ├── ipfs/
│       │   └── IPFSClient.ts (новый)
│       ├── registry/
│       │   └── UnitnameRegistry.ts (новый)
│       └── teams/
│           └── teamService.ts (новый)
├── features/
│   └── UnitProfile/
│       ├── index.ts (обновлен)
│       └── ui/
│           ├── UnitProfileView/
│           │   └── UnitProfileView.tsx (обновлен)
│           ├── UnitProfileEditor/
│           │   └── UnitProfileEditor.tsx (обновлен)
│           ├── TeamsContribute/
│           │   └── TeamsContribute.tsx (обновлен)
│           └── AvatarUpload/ (новый)
│               ├── AvatarUpload.tsx
│               └── AvatarUpload.module.scss
└── app/
    └── unit-profile/
        └── page.tsx (обновлен)
```

## Вопросы?

Если что-то непонятно:
1. Изучи существующий код в проекте
2. Посмотри на примеры в `mockUnitProfile.ts`
3. Проверь документацию Next.js 15 и React 19
4. Используй TypeScript для подсказок
5. Смотри на существующие компоненты как на примеры паттернов

## Чеклист перед началом

- [ ] Прочитал весь промпт
- [ ] Изучил существующий код проекта
- [ ] Понял архитектуру Feature-Sliced Design
- [ ] Знаю где находятся все файлы
- [ ] Понимаю структуру UnitProfile interface
- [ ] Знаю как работает useUnitProfile хук

**Удачи в реализации! 🚀**
