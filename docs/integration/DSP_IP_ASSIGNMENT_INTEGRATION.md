# DSP Client × IP Assignment Integration Plan

**Версия:** 1.0  
**Дата:** 2026-03-08  
**Статус:** 📋 Design Document

---

## 📋 Executive Summary

Этот документ описывает **полную интеграцию** IP Assignment решения (из `legal/03-IP-ASSIGNMENT/`) в DSP Client для обеспечения автоматической передачи авторских прав при регистрации участника сообщества.

### Цель

Интегрировать механизм принятия DUNA-CLA (Contributor License Agreement) в текущий флоу регистрации пользователя через Unit Profile.

---

## 🎯 Текущий флоу пользователя (AS-IS)

### 1. Пользователь заходит на gyber.org

```
┌─────────────────────────────────────┐
│  Главная страница gyber.org         │
│  - Header с навигацией              │
│  - AI Chat (Claude integration)     │
│  - Ecosystem status                 │
└─────────────────────────────────────┘
```

### 2. Пользователь нажимает "Connect Wallet"

```
┌─────────────────────────────────────┐
│  WalletAuthModal                    │
│  - Выбор кошелька (RainbowKit)      │
│  - Подключение через wagmi          │
│  - Подпись сообщения для профиля    │
└─────────────────────────────────────┘
```

**Файлы:**
- `src/features/WalletAuth/ui/WalletAuthModal/WalletAuthModal.tsx`
- `src/shared/hooks/useUnitProfile.ts`

### 3. Создание Unit Profile

```
┌─────────────────────────────────────┐
│  UnitProfileCreator                 │
│  - Ввод unitname                    │
│  - Проверка доступности             │
│  - Подпись сообщения (signMessage)  │
│  - Сохранение в localStorage        │
└─────────────────────────────────────┘
```

**Файлы:**
- `src/features/WalletAuth/ui/UnitProfileCreator/UnitProfileCreator.tsx`
- `src/shared/types/unit-profile.ts`

### 4. Просмотр/редактирование профиля

```
┌─────────────────────────────────────┐
│  Unit Profile Page                  │
│  - Avatar, bio, social links        │
│  - Skills, stack, qualifications    │
│  - Teams contribute                 │
│  - Projects, docs                   │
└─────────────────────────────────────┘
```

**Файлы:**
- `src/app/unit-profile/page.tsx`
- `src/features/UnitProfile/ui/UnitProfileView/UnitProfileView.tsx`
- `src/features/UnitProfile/ui/UnitProfileEditor/UnitProfileEditor.tsx`

---

## 🎯 Новый флоу с IP Assignment (TO-BE)

### Обновлённый флоу регистрации

```
1. Connect Wallet (без изменений)
    ↓
2. Create Unit Profile (без изменений)
    ↓
3. ⭐ NEW: Accept DUNA-CLA (IP Assignment)
    ↓
4. Access Unit Profile (обновлённый UI)
```

---

## 📦 Новые компоненты для интеграции

### 1. Типы данных (TypeScript)

**Файл:** `src/shared/types/unit-profile.ts`

**Добавить:**

```typescript
// ============================================
// IP Assignment & CLA Types
// ============================================

export interface DUNACLA {
  version: string; // "1.0"
  acceptedAt: number; // timestamp
  signature: string; // cryptographic signature
  githubUsername?: string; // optional GitHub username
  claType: 'electronic' | 'on-chain'; // method of acceptance
}

export interface CLARecord {
  cla: DUNACLA;
  message: string; // signed message
  address: string; // wallet address
  timestamp: number;
}

export interface UnitProfile {
  address: string;
  unitname: string;
  avatar?: string;
  bio?: string;
  ensName?: string;
  chainId: number;
  balance?: string;
  isConnected: boolean;
  createdAt: number;
  lastLoginAt: number;
  
  // ⭐ NEW: CLA acceptance status
  claAccepted?: DUNACLA;
  
  socialLinks?: {
    telegram?: string;
    github?: string; // ⭐ IMPORTANT for CLA
    twitter?: string;
    discord?: string;
    website?: string;
  };
  preferences: {
    encryptByDefault: boolean;
    allowDirectMessages: boolean;
    showOnlineStatus: boolean;
    theme: 'dark' | 'light' | 'auto';
    language: 'en' | 'ru' | 'auto';
  };
  stats: {
    messagesCount: number;
    chatsCount: number;
    connectionsCount: number;
    reputation: number;
  };
  skills?: string[];
  location?: string;
  timezone?: string;
}

export interface UnitProfileState {
  profile: UnitProfile | null;
  isLoading: boolean;
  error: string | null;
  
  // ⭐ NEW: CLA-specific state
  isCLARequired?: boolean;
  isCLALoading?: boolean;
  claError?: string | null;
}
```

---

### 2. Хук для управления CLA

**Файл:** `src/shared/hooks/useDUNACLA.ts` (НОВЫЙ)

```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { DUNACLA, CLARecord } from '@/shared/types/unit-profile';

const CLA_STORAGE_KEY = 'dsp_duna_cla';
const CLA_VERSION = '1.0';

// DUNA-CLA text (full version from legal/03-IP-ASSIGNMENT/templates/DUNA-CLA-v1.0.md)
const DUNA_CLA_TEXT = `
# GYBERNATY DUNA CONTRIBUTOR LICENSE AGREEMENT (DUNA-CLA)

Version: 1.0
Effective Date: [Date of Electronic Acceptance]
Jurisdiction: State of Wyoming, United States

## IMPORTANT NOTICE

By clicking "I Agree", submitting a pull request, or contributing code to any 
Gybernaty DUNA repository, you acknowledge that you have read, understood, and 
agree to be bound by this Contributor License Agreement.

This is a legally binding contract. If you do not agree to these terms, do not 
contribute to Gybernaty DUNA projects.

## 1. DEFINITIONS

**1.1 "Agreement"** — this Contributor License Agreement (DUNA-CLA).

**1.2 "Contribution"** — any original work of authorship submitted by Contributor 
to Gybernaty DUNA, including but not limited to:
- Software code (in any programming language)
- Documentation, comments, and specifications
- Designs, architectures, and algorithms
- Graphics, user interfaces, and visual elements
- Configuration files, scripts, and automation
- Bug reports, feature requests, and other feedback

**1.3 "DUNA"** — Gybernaty DAO DUNA, a Wyoming Decentralized Unincorporated 
Nonprofit Association, organized under Wyoming Statute § 17-22.

**1.4 "Contributor"** — any individual or legal entity making a Contribution to the DUNA.

**1.5 "Effective Date"** — the date on which Contributor electronically accepts 
this Agreement through GitHub CLA Assistant, on-chain signature, or other digital means.

**1.6 "GBR Token"** — the governance token of Gybernaty DUNA 
(BEP-20, contract: 0xa970cae9fa1d7cca913b7c19df45bf33d55384a9).

## 2. COPYRIGHT ASSIGNMENT

### 2.1 Assignment of Rights

Contributor hereby irrevocably assigns to Gybernaty DUNA all right, title, and 
interest worldwide in and to the Contribution, including:
- All copyrights and neighboring rights
- All moral rights (to the extent waivable)
- All other intellectual property rights of any kind

This assignment is perpetual, exclusive, and irrevocable.

### 2.2 Work Made for Hire

To the fullest extent permitted by applicable law, each Contribution is considered 
a "work made for hire" for Gybernaty DUNA.

## 3. PATENT LICENSE

### 3.1 Grant of Patent License

Contributor hereby grants to Gybernaty DUNA and all recipients of the Contribution 
a perpetual, irrevocable, worldwide, non-exclusive, royalty-free license under any 
patents owned or controlled by Contributor that are necessarily infringed by the 
Contribution.

## 4. REPRESENTATIONS AND WARRANTIES

### 4.1 Original Work

Contributor represents and warrants that:
(a) the Contribution is Contributor's original work;
(b) Contributor has the legal right to grant the rights under this Agreement;
(c) the Contribution does not infringe any third-party rights.

## 5. MORAL RIGHTS WAIVER

### 5.1 Waiver of Moral Rights

To the fullest extent permitted by law, Contributor hereby waives any and all 
moral rights in the Contribution, including rights of attribution, integrity, 
and disclosure.

## 6. GOVERNANCE AND MEMBERSHIP

### 6.1 Token-Based Membership

Contributor acknowledges that membership in Gybernaty DUNA is determined solely 
by holding GBR governance tokens.

## 7. OPEN SOURCE LICENSING

### 7.1 License Grant Authority

Gybernaty DUNA is authorized to license the Contribution under any open source 
license approved by on-chain governance (MIT, Apache 2.0, GPL, etc.).

## 8. ANONYMITY AND PSEUDONYMITY

### 8.1 Pseudonymous Participation

Contributor may participate under a pseudonym (GitHub username, wallet address) 
without disclosing legal identity.

## 9. TAX COMPLIANCE

### 9.1 IRS Reporting

Contributor acknowledges that Contributions valued over $600 may require IRS 
Form 1099 reporting.

## 10. TERM AND TERMINATION

### 10.1 Perpetual

This Agreement is perpetual and irrevocable.

## 11. GOVERNING LAW

### 11.1 Wyoming Law

This Agreement is governed by the laws of the State of Wyoming, without regard 
to conflict of law principles.

### 11.2 DUNA Act

This Agreement is subject to the Wyoming Decentralized Unincorporated Nonprofit 
Association Act (W.S. § 17-22).

## 12. ELECTRONIC ACCEPTANCE

### 12.1 Clickwrap Acceptance

Electronic acceptance of this Agreement (including via GitHub CLA Assistant, 
on-chain signature, or other digital means) constitutes a legally binding signature.

### 12.2 Legal Validity

This Agreement is governed by:
- ESIGN Act (Electronic Signatures in Global and National Commerce Act)
- UETA (Uniform Electronic Transactions Act) as adopted by Wyoming

---

ACCEPTANCE:

By clicking "I Agree" or accepting this Agreement through any electronic means, 
Contributor acknowledges reading, understanding, and agreeing to be bound by 
this Agreement.

Effective Date: [Date of Electronic Acceptance]
Contributor: [GitHub Username / Wallet Address]
Agreement Version: 1.0
Jurisdiction: Wyoming, United States
`;

export const useDUNACLA = () => {
  const [claAccepted, setCLAAccepted] = useState<DUNACLA | null>(null);
  const [isCLALoading, setIsCLALoading] = useState(false);
  const [claError, setCLAEror] = useState<string | null>(null);
  const [isCLARequired, setIsCLARequired] = useState(false);

  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  // Load CLA status from localStorage on mount
  useEffect(() => {
    if (!address || !isConnected) {
      setCLAAccepted(null);
      setIsCLARequired(false);
      return;
    }

    const savedCLA = localStorage.getItem(CLA_STORAGE_KEY);
    if (savedCLA) {
      try {
        const claRecord: CLARecord = JSON.parse(savedCLA);
        
        // Verify CLA belongs to current address
        if (claRecord.address === address) {
          setCLAAccepted(claRecord.cla);
          setIsCLARequired(false);
        } else {
          // CLA belongs to different address
          setCLAAccepted(null);
          setIsCLARequired(true);
        }
      } catch (error) {
        console.error('Error loading CLA:', error);
        localStorage.removeItem(CLA_STORAGE_KEY);
        setIsCLARequired(true);
      }
    } else {
      // No CLA found, required for new users
      setIsCLARequired(true);
    }
  }, [address, isConnected]);

  // Accept CLA
  const acceptCLA = useCallback(async (
    githubUsername?: string
  ): Promise<void> => {
    if (!address || !isConnected || !signMessageAsync) {
      setCLAEror('Wallet not connected');
      return;
    }

    setIsCLALoading(true);
    setCLAEror(null);

    try {
      // Create CLA acceptance message
      const message = `GYBERNATY DUNA CONTRIBUTOR LICENSE AGREEMENT (DUNA-CLA) v1.0

By signing this message, I agree to:

1. Assign all copyrights in my Contributions to Gybernaty DUNA
2. Grant a perpetual patent license to DUNA
3. Waive moral rights to my Contributions
4. Represent that my Contributions are original
5. Accept Wyoming law as governing this Agreement

Wallet Address: ${address}
GitHub Username: ${githubUsername || 'Not provided'}
Timestamp: ${Date.now()}

This is a legally binding agreement under the ESIGN Act and Wyoming DUNA Act.`;

      // Request signature
      const signature = await signMessageAsync({ message });

      // Create CLA record
      const cla: DUNACLA = {
        version: CLA_VERSION,
        acceptedAt: Date.now(),
        signature,
        githubUsername: githubUsername || undefined,
        claType: 'electronic',
      };

      const claRecord: CLARecord = {
        cla,
        message,
        address,
        timestamp: Date.now(),
      };

      // Save to localStorage
      localStorage.setItem(CLA_STORAGE_KEY, JSON.stringify(claRecord));
      setCLAAccepted(cla);
      setIsCLARequired(false);
    } catch (error) {
      console.error('Error accepting CLA:', error);
      setCLAEror(
        error instanceof Error ? error.message : 'Failed to accept CLA'
      );
    } finally {
      setIsCLALoading(false);
    }
  }, [address, isConnected, signMessageAsync]);

  // Check CLA status
  const checkCLAStatus = useCallback((): {
    hasAccepted: boolean;
    version: string | null;
    acceptedAt: number | null;
  } => {
    const savedCLA = localStorage.getItem(CLA_STORAGE_KEY);
    if (!savedCLA) {
      return { hasAccepted: false, version: null, acceptedAt: null };
    }

    try {
      const claRecord: CLARecord = JSON.parse(savedCLA);
      return {
        hasAccepted: true,
        version: claRecord.cla.version,
        acceptedAt: claRecord.cla.acceptedAt,
      };
    } catch {
      return { hasAccepted: false, version: null, acceptedAt: null };
    }
  }, []);

  // Reset CLA (for testing/debugging)
  const resetCLA = useCallback(() => {
    localStorage.removeItem(CLA_STORAGE_KEY);
    setCLAAccepted(null);
    setIsCLARequired(true);
  }, []);

  return {
    claAccepted,
    isCLALoading,
    claError,
    isCLARequired,
    acceptCLA,
    checkCLAStatus,
    resetCLA,
  };
};
```

---

### 3. UI компонент для принятия CLA

**Файл:** `src/features/WalletAuth/ui/DUNACLAAcceptor/DUNACLAAcceptor.tsx` (НОВЫЙ)

```typescript
'use client';

import { useState } from 'react';
import { useDUNACLA } from '@/shared/hooks/useDUNACLA';
import { Button, ThemeButton } from '@/shared/ui/Button/Button';
import cls from './DUNACLAAcceptor.module.scss';

interface DUNACLAAcceptorProps {
  onSuccess?: () => void;
  skipRedirect?: boolean;
}

export const DUNACLAAcceptor: React.FC<DUNACLAAcceptorProps> = ({
  onSuccess,
  skipRedirect = false,
}) => {
  const {
    isCLALoading,
    claError,
    acceptCLA,
  } = useDUNACLA();

  const [githubUsername, setGithubUsername] = useState('');
  const [showFullText, setShowFullText] = useState(false);
  const [hasRead, setHasRead] = useState(false);

  const handleAccept = async () => {
    if (!hasRead) {
      alert('Please confirm that you have read the DUNA-CLA');
      return;
    }

    await acceptCLA(githubUsername.trim() || undefined);
    
    if (!claError && onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className={cls.container}>
      <div className={cls.header}>
        <h2>📜 Contributor License Agreement</h2>
        <p className={cls.subtitle}>
          Required to contribute to Gybernaty DUNA projects
        </p>
      </div>

      <div className={cls.claText}>
        <div className={cls.claScroll}>
          <h3>GYBERNATY DUNA CONTRIBUTOR LICENSE AGREEMENT (DUNA-CLA)</h3>
          <p><strong>Version:</strong> 1.0</p>
          <p><strong>Jurisdiction:</strong> State of Wyoming, United States</p>
          
          <div className={cls.claContent}>
            {/* Краткая версия (всегда видна) */}
            <section className={cls.section}>
              <h4>⚖️ What you're agreeing to:</h4>
              <ul>
                <li>
                  <strong>Copyright Assignment:</strong> You assign all copyrights 
                  in your Contributions to Gybernaty DUNA
                </li>
                <li>
                  <strong>Patent License:</strong> You grant a perpetual patent 
                  license to DUNA and downstream users
                </li>
                <li>
                  <strong>Moral Rights Waiver:</strong> You waive moral rights 
                  (attribution, integrity, etc.)
                </li>
                <li>
                  <strong>Representations:</strong> You represent that your 
                  Contributions are original and don't infringe others' rights
                </li>
                <li>
                  <strong>Open Source Licensing:</strong> DUNA can license your 
                  Contributions under MIT, Apache 2.0, GPL, etc.
                </li>
                <li>
                  <strong>Anonymity:</strong> You can participate under a 
                  pseudonym (GitHub username, wallet address)
                </li>
                <li>
                  <strong>Governing Law:</strong> Wyoming law applies 
                  (ESIGN Act, UETA, DUNA Act)
                </li>
              </ul>
            </section>

            <section className={cls.section}>
              <h4>✅ What you get in return:</h4>
              <ul>
                <li>Membership in the Gybernaty community</li>
                <li>Right to participate in governance (if holding GBR tokens)</li>
                <li>Access to all DUNA projects and resources</li>
                <li>Recognition for your Contributions</li>
                <li>Ability to use all DUNA projects under their licenses</li>
              </ul>
            </section>

            <section className={cls.section}>
              <h4>❌ What you do NOT give up:</h4>
              <ul>
                <li>Rights to your other works (only Contributions)</li>
                <li>Right to work on competing projects</li>
                <li>Right to leave the community at any time</li>
                <li>No financial obligations or liabilities</li>
              </ul>
            </section>

            {/* Полная версия (по клику) */}
            {showFullText && (
              <section className={cls.fullText}>
                <hr />
                <h4>📄 Full Legal Text</h4>
                {/* Здесь можно вставить полный текст из DUNA-CLA-v1.0.md */}
                <p><em>Full legal text available at: legal/03-IP-ASSIGNMENT/templates/DUNA-CLA-v1.0.md</em></p>
              </section>
            )}
          </div>
        </div>
      </div>

      <div className={cls.githubInput}>
        <label htmlFor="github">
          GitHub Username (optional, for public recognition):
        </label>
        <input
          id="github"
          type="text"
          placeholder="e.g., yourusername"
          value={githubUsername}
          onChange={(e) => setGithubUsername(e.target.value)}
          disabled={isCLALoading}
        />
        <p className={cls.hint}>
          Your GitHub username will be linked to your Contributions for public recognition.
          You can remain anonymous if you prefer.
        </p>
      </div>

      <div className={cls.confirmation}>
        <label>
          <input
            type="checkbox"
            checked={hasRead}
            onChange={(e) => setHasRead(e.target.checked)}
            disabled={isCLALoading}
          />
          <span>
            I have read and understood the DUNA-CLA. I agree to be bound by its terms.
          </span>
        </label>
      </div>

      {claError && (
        <div className={cls.error}>
          <strong>Error:</strong> {claError}
        </div>
      )}

      <div className={cls.actions}>
        <Button
          theme={ThemeButton.ORANGE}
          onClick={handleAccept}
          disabled={isCLALoading || !hasRead}
          loading={isCLALoading}
        >
          {isCLALoading ? 'Accepting...' : '✅ I Agree & Accept DUNA-CLA'}
        </Button>

        {!showFullText && (
          <button
            className={cls.viewFull}
            onClick={() => setShowFullText(true)}
            disabled={isCLALoading}
          >
            📄 View Full Legal Text
          </button>
        )}
      </div>

      <div className={cls.legalNotice}>
        <p>
          <strong>Legal Notice:</strong> This is a legally binding contract under 
          the ESIGN Act (15 USC § 7001) and Wyoming UETA. By clicking "I Agree", 
          you are providing your electronic signature.
        </p>
      </div>
    </div>
  );
};
```

**Стили:** `src/features/WalletAuth/ui/DUNACLAAcceptor/DUNACLAAcceptor.module.scss`

```scss
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.header {
  text-align: center;
  margin-bottom: 2rem;

  h2 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #ff6b35, #f7931e);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .subtitle {
    color: #888;
    font-size: 1rem;
  }
}

.claText {
  margin-bottom: 2rem;

  .claScroll {
    max-height: 400px;
    overflow-y: auto;
    padding: 1.5rem;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);

    h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }

    .section {
      margin: 1.5rem 0;

      h4 {
        font-size: 1.2rem;
        margin-bottom: 0.75rem;
        color: #f7931e;
      }

      ul {
        list-style: none;
        padding-left: 0;

        li {
          margin-bottom: 0.75rem;
          line-height: 1.6;
          padding-left: 1.5rem;
          position: relative;

          &::before {
            content: '→';
            position: absolute;
            left: 0;
            color: #ff6b35;
          }

          strong {
            color: #fff;
          }
        }
      }
    }

    .fullText {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 2px solid rgba(255, 255, 255, 0.1);
    }
  }
}

.githubInput {
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  input {
    width: 100%;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    color: #fff;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: #f7931e;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .hint {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: #888;
  }
}

.confirmation {
  margin-bottom: 1.5rem;

  label {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    cursor: pointer;

    input[type="checkbox"] {
      width: 20px;
      height: 20px;
      margin-top: 2px;
      accent-color: #f7931e;
    }

    span {
      font-size: 0.95rem;
      line-height: 1.5;
    }
  }
}

.error {
  padding: 1rem;
  background: rgba(220, 38, 38, 0.2);
  border: 1px solid rgba(220, 38, 38, 0.5);
  border-radius: 6px;
  color: #fca5a5;
  margin-bottom: 1.5rem;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;

  .viewFull {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #888;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.2s;

    &:hover {
      border-color: #f7931e;
      color: #f7931e;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

.legalNotice {
  margin-top: 2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-left: 3px solid #f7931e;
  border-radius: 4px;

  p {
    font-size: 0.875rem;
    color: #888;
    line-height: 1.6;
  }
}
```

---

### 4. Интеграция в Unit Profile Creator

**Файл:** `src/features/WalletAuth/ui/UnitProfileCreator/UnitProfileCreator.tsx`

**Обновить:**

```typescript
// Добавить импорт
import { useDUNACLA } from '@/shared/hooks/useDUNACLA';
import { DUNACLAAcceptor } from './DUNACLAAcceptor/DUNACLAAcceptor';

// Обновить компонент
export const UnitProfileCreator: React.FC<UnitProfileCreatorProps> = ({
  onComplete,
}) => {
  const {
    createUnitProfile,
    checkUnitnameAvailability,
    isWalletConnected,
  } = useUnitProfile();
  
  // ⭐ NEW: CLA hook
  const {
    claAccepted,
    isCLARequired,
    acceptCLA,
  } = useDUNACLA();

  const [step, setStep] = useState<'unitname' | 'cla' | 'complete'>('unitname');
  const [unitname, setUnitname] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  // ⭐ NEW: После создания профиля, перейти к CLA
  const handleUnitnameComplete = async () => {
    await createUnitProfile(unitname);
    setStep('cla'); // Перейти к принятию CLA
  };

  // ⭐ NEW: После принятия CLA
  const handleCLAAccepted = () => {
    setStep('complete');
    onComplete?.();
  };

  return (
    <div>
      {step === 'unitname' && (
        // Существующий UI создания unitname
        <UnitnameInput
          value={unitname}
          onChange={setUnitname}
          onCheck={checkUnitnameAvailability}
          onComplete={handleUnitnameComplete}
        />
      )}

      {step === 'cla' && (
        // ⭐ NEW: Принятие CLA
        <DUNACLAAcceptor onSuccess={handleCLAAccepted} />
      )}

      {step === 'complete' && (
        <CompleteMessage />
      )}
    </div>
  );
};
```

---

### 5. Интеграция в Unit Profile Page

**Файл:** `src/app/unit-profile/page.tsx`

**Обновить:**

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useUnitProfile } from '@/shared/hooks/useUnitProfile';
import { useDUNACLA } from '@/shared/hooks/useDUNACLA'; // ⭐ NEW
import { WalletAuthModal } from '@/features/WalletAuth/ui/WalletAuthModal/WalletAuthModal';
import { DUNACLAAcceptor } from '@/features/WalletAuth/ui/DUNACLAAcceptor/DUNACLAAcceptor'; // ⭐ NEW
import { TeamsContribute } from '@/features/UnitProfile/ui/TeamsContribute/TeamsContribute';
import { Button, ThemeButton } from '@/shared/ui/Button/Button';
import cls from './page.module.scss';

export default function UnitProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('Dashboard');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showCLA, setShowCLA] = useState(false); // ⭐ NEW

  const { profile } = useUnitProfile();
  const { isCLARequired, claAccepted } = useDUNACLA(); // ⭐ NEW

  useEffect(() => {
    setMounted(true);
  }, []);

  // ⭐ NEW: Показать CLA modal если требуется
  useEffect(() => {
    if (mounted && profile && isCLARequired && !claAccepted) {
      setShowCLA(true);
    }
  }, [mounted, profile, isCLARequired, claAccepted]);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return (
      <>
        <div className={cls.container}>
          <div className={cls.noProfile}>
            <h1>Connect your wallet to access Unit Profile</h1>
            <Button
              theme={ThemeButton.ORANGE}
              onClick={() => setIsAuthModalOpen(true)}
            >
              Connect Wallet
            </Button>
          </div>
        </div>
        <WalletAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          redirectAfterAuth={true}
        />
      </>
    );
  }

  return (
    <>
      <div className={cls.container}>
        {/* ⭐ NEW: CLA Status Badge */}
        <div className={cls.claStatus}>
          {claAccepted ? (
            <span className={cls.badgeSuccess}>
              ✅ CLA Accepted (v{claAccepted.version})
            </span>
          ) : (
            <span className={cls.badgeWarning}>
              ⚠️ CLA Required
            </span>
          )}
        </div>

        {/* Существующий UI профиля */}
        <div className={cls.header}>
          <h1 className={cls.title}>UNIT PROFILE</h1>
          <div className={cls.walletAddress}>
            <span>Wallet Address: </span>
            <span className={cls.address}>{profile.address}</span>
          </div>
        </div>

        {/* ... остальной существующий UI ... */}
      </div>

      {/* ⭐ NEW: CLA Modal */}
      {showCLA && (
        <div className={cls.claModal}>
          <div className={cls.claModalContent}>
            <button
              className={cls.closeModal}
              onClick={() => setShowCLA(false)}
            >
              ×
            </button>
            <DUNACLAAcceptor
              onSuccess={() => {
                setShowCLA(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
```

---

## 📊 Диаграмма последовательности

```
┌─────────┐    ┌──────────┐    ┌───────────┐    ┌──────────┐    ┌──────────┐
│  User   │    │   DSP    │    │  wagmi    │    │  localStorage  │ │  GitHub  │
│         │    │  Client  │    │  (wallet) │    │          │    │   (opt)  │
└────┬────┘    └────┬─────┘    └─────┬─────┘    └─────┬────┘    └────┬─────┘
     │              │                 │                │              │
     │ 1. Connect   │                 │                │              │
     │ Wallet ────> │                 │                │              │
     │              │                 │                │              │
     │              │ 2. Sign Message │                │              │
     │              │────────────────>│                │              │
     │              │                 │                │              │
     │              │ 3. Create       │                │              │
     │              │    Unit Profile │                │              │
     │              │────────────────>│                │              │
     │              │                 │                │              │
     │              │ 4. Save to      │                │              │
     │              │    localStorage │───────────────>│              │
     │              │                 │                │              │
     │              │ 5. Show CLA     │                │              │
     │              │    Modal ─────> │                │              │
     │              │                 │                │              │
     │ 6. Read CLA  │                 │                │              │
     │    & GitHub  │                 │                │              │
     │─────────────>│                 │                │              │
     │              │                 │                │              │
     │ 7. Accept    │                 │                │              │
     │    CLA ────> │                 │                │              │
     │              │                 │                │              │
     │              │ 8. Sign CLA     │                │              │
     │              │    Message ────>│                │              │
     │              │                 │                │              │
     │              │ 9. Save CLA     │                │              │
     │              │    Record ─────────────────────>│              │
     │              │                 │                │              │
     │              │ 10. (Optional)  │                │              │
     │              │     Link GitHub │──────────────────────────────>│
     │              │                 │                │              │
     │ 11. Access   │                 │                │              │
     │    Unit      │                 │                │              │
     │    Profile <─────────────────  │                │              │
     │              │                 │                │              │
```

---

## 🗺️ Roadmap интеграции

### Этап 1: Подготовка (1-2 дня)

- [ ] Изучить этот документ командой
- [ ] Создать GitHub issue для tracking
- [ ] Назначить ответственных разработчиков

### Этап 2: Типы данных (1 день)

- [ ] Обновить `src/shared/types/unit-profile.ts`
- [ ] Добавить типы DUNACLA, CLARecord
- [ ] Обновить UnitProfile интерфейс

### Этап 3: Хук useDUNACLA (2 дня)

- [ ] Создать `src/shared/hooks/useDUNACLA.ts`
- [ ] Реализовать логику принятия CLA
- [ ] Реализовать localStorage integration
- [ ] Написать тесты для хука

### Этап 4: UI компоненты (3-4 дня)

- [ ] Создать `DUNACLAAcceptor` компонент
- [ ] Создать стили SCSS
- [ ] Добавить модалку для CLA
- [ ] Протестировать на разных устройствах

### Этап 5: Интеграция (2-3 дня)

- [ ] Обновить `UnitProfileCreator`
- [ ] Обновить `UnitProfilePage`
- [ ] Обновить `useUnitProfile` хук
- [ ] Протестировать полный флоу

### Этап 6: Тестирование (2-3 дня)

- [ ] Unit tests для новых компонентов
- [ ] Integration tests для флоу
- [ ] E2E tests с Playwright
- [ ] Accessibility audit
- [ ] Mobile responsiveness check

### Этап 7: Деплой (1 день)

- [ ] Deploy to stage
- [ ] Testing on stage
- [ ] Deploy to production
- [ ] Monitoring

**Общее время:** 12-16 дней (~2-3 недели)

---

## 📚 Ресурсы

### Документы
- [DUNA-CLA Template](./legal/03-IP-ASSIGNMENT/templates/DUNA-CLA-v1.0.md)
- [GitHub CLA Setup](./legal/03-IP-ASSIGNMENT/GITHUB_CLA_SETUP.md)
- [IP Assignment Complete](./legal/03-IP-ASSIGNMENT/IP_ASSIGNMENT_COMPLETE.md)

### Внешние ссылки
- [Wyoming DUNA Act](https://wyoleg.gov/2024/Introduced/SF0050.pdf)
- [ESIGN Act](https://www.ecfr.gov/current/title-15/chapter-IX/subchapter-B/part-7001)
- [GitHub CLA Assistant](https://cla-assistant.io/)

---

*Документ подготовлен для Gybernaty DUNA*  
*Версия: 1.0*  
*Дата: 2026-03-08*  
*Статус: 📋 Design Document - Ready for Implementation*
