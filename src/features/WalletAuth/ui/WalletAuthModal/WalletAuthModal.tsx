'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useUnitProfile } from '@/shared/hooks/useUnitProfile';
import { WalletConnectButton } from '../WalletConnectButton/WalletConnectButton';
import { UnitProfileCreator } from '../UnitProfileCreator/UnitProfileCreator';
import { UnitProfileCard } from '../UnitProfileCard/UnitProfileCard';
import cls from './WalletAuthModal.module.scss';
import { classNames } from '@/shared/lib/classNames/classNames';

interface WalletAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  redirectAfterAuth?: boolean;
}

export const WalletAuthModal = ({ 
  isOpen, 
  onClose, 
  className, 
  redirectAfterAuth = false 
}: WalletAuthModalProps) => {
  const [showProfileCreator, setShowProfileCreator] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  
  // Always call hooks unconditionally
  const { isConnected } = useAccount();
  const { profile } = useUnitProfile();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleProfileCreated = () => {
    setShowProfileCreator(false);
    onClose();
    
    // Redirect to unit profile page after successful creation
    if (redirectAfterAuth) {
      setTimeout(() => {
        router.push('/unit-profile');
      }, 500); // Small delay for smooth transition
    }
  };

  const handleCreateProfile = () => {
    setShowProfileCreator(true);
  };

  const handleViewProfile = () => {
    onClose();
    router.push('/unit-profile');
  };

  const renderContent = () => {
    // If user has a profile, show the profile card with option to view full profile
    if (profile) {
      return (
        <div className={cls.profileContainer}>
          <UnitProfileCard />
          <div className={cls.profileActions}>
            <button 
              onClick={handleViewProfile}
              className={cls.viewProfileButton}
            >
              👤 View Full Profile
            </button>
          </div>
        </div>
      );
    }

    // If wallet is connected but no profile, show profile creator
    if (isConnected && showProfileCreator) {
      return (
        <UnitProfileCreator
          onSuccess={handleProfileCreated}
          onCancel={() => setShowProfileCreator(false)}
        />
      );
    }

    // If wallet is connected but no profile creator shown, show connect to create profile
    if (isConnected && !showProfileCreator) {
      return (
        <div className={cls.createProfilePrompt}>
          <div className={cls.header}>
            <h2 className={cls.title}>🎉 Wallet Connected!</h2>
            <p className={cls.subtitle}>
              Create your unit profile to join the Gybernaty ecosystem
            </p>
          </div>
          
          <div className={cls.actions}>
            <button
              onClick={handleCreateProfile}
              className={cls.createButton}
            >
              🚀 Create Unit Profile
            </button>
          </div>
        </div>
      );
    }

    // Default: show wallet connect
    return (
      <div className={cls.connectContainer}>
        <div className={cls.header}>
          <h2 className={cls.title}>Connect Your Wallet</h2>
          <p className={cls.subtitle}>
            Connect your crypto wallet to create your unit profile and join the Gybernaty ecosystem
          </p>
        </div>
        
        <div className={cls.walletConnect}>
          <WalletConnectButton />
        </div>
        
        <div className={cls.features}>
          <div className={cls.feature}>
            <span className={cls.icon}>🔐</span>
            <span>Secure wallet authentication</span>
          </div>
          <div className={cls.feature}>
            <span className={cls.icon}>🆔</span>
            <span>Create unique unit identity</span>
          </div>
          <div className={cls.feature}>
            <span className={cls.icon}>🌐</span>
            <span>Join decentralized community</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={classNames(cls.WalletAuthModal, {}, [className || ''])}>
      <div className={cls.overlay} onClick={handleOverlayClick}>
        <div className={cls.modal}>
          <button className={cls.closeButton} onClick={onClose}>
            ✕
          </button>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}; 