'use client';

import { useUnitProfile } from '@/shared/hooks/useUnitProfile';
import { UnitProfileView } from '@/features/UnitProfile';
import { WalletAuthModal } from '@/features/WalletAuth/ui/WalletAuthModal/WalletAuthModal';
import { useState } from 'react';
import { Button, ThemeButton } from '@/shared/ui/Button/Button';
import cls from './page.module.scss';

export default function UnitDashboard() {
  const { profile } = useUnitProfile();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  if (!profile) {
    return (
      <>
        <div className={cls.container}>
          <div className={cls.noProfile}>
            <h1 className={cls.title}>🔗 Unit Dashboard</h1>
            <p className={cls.subtitle}>
              Connect your wallet to access your unit profile and dashboard
            </p>
            <Button
              theme={ThemeButton.ORANGE}
              onClick={() => setIsAuthModalOpen(true)}
              className={cls.connectButton}
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
    <div className={cls.container}>
      <div className={cls.header}>
        <h1 className={cls.title}>📊 Unit Dashboard</h1>
        <p className={cls.subtitle}>
          Welcome to your personal unit dashboard, {profile.unitname}!
        </p>
      </div>

      <div className={cls.content}>
        <UnitProfileView />
      </div>
    </div>
  );
} 