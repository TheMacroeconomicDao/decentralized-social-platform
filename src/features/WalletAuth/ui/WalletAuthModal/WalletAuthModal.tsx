'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [showWelcome, setShowWelcome] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  
  // Always call hooks unconditionally
  const { isConnected } = useAccount();
  const { profile } = useUnitProfile();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show welcome screen when wallet connects
  useEffect(() => {
    if (isConnected && !profile && !showProfileCreator) {
      setShowWelcome(true);
      // Auto-hide welcome after 3 seconds, or user can click to continue
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowWelcome(false);
    }
  }, [isConnected, profile, showProfileCreator]);

  if (!isOpen || !mounted) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleProfileCreated = () => {
    setShowProfileCreator(false);
    setShowSuccess(true);
    
    // After showing success screen, close modal and optionally redirect
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
      
      if (redirectAfterAuth) {
        setTimeout(() => {
          router.push('/unit-profile');
        }, 300);
      }
    }, 2500); // Show success for 2.5 seconds
  };

  const handleCreateProfile = () => {
    setShowProfileCreator(true);
  };

  const handleViewProfile = () => {
    onClose();
    router.push('/unit-profile');
  };

  const handleContinueFromWelcome = () => {
    setShowWelcome(false);
  };

  const renderContent = () => {
    // Success screen after profile creation
    if (showSuccess) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
          className={cls.successContainer}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className={cls.successIcon}
          >
            ✅
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={cls.successTitle}
          >
            Profile Created Successfully!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={cls.successSubtitle}
          >
            Welcome to Gybernaty! Your unique Unit Profile is now active.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={cls.successActions}
          >
            <button
              onClick={() => {
                setShowSuccess(false);
                onClose();
                router.push('/unit-profile');
              }}
              className={cls.viewProfileButton}
            >
              👤 View My Profile
            </button>
            <button
              onClick={() => {
                setShowSuccess(false);
                onClose();
              }}
              className={cls.exploreButton}
            >
              🌐 Explore Platform
            </button>
          </motion.div>
        </motion.div>
      );
    }

    // If user has a profile, show the profile card with option to view full profile
    if (profile && !showSuccess) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={cls.profileContainer}
        >
          <UnitProfileCard />
          <div className={cls.profileActions}>
            <button 
              onClick={handleViewProfile}
              className={cls.viewProfileButton}
            >
              👤 View Full Profile
            </button>
          </div>
        </motion.div>
      );
    }

    // If wallet is connected but no profile, show profile creator
    if (isConnected && showProfileCreator) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <UnitProfileCreator
            onSuccess={handleProfileCreated}
            onCancel={() => setShowProfileCreator(false)}
          />
        </motion.div>
      );
    }

    // Welcome screen after wallet connection (best practice 2025)
    if (isConnected && showWelcome && !showProfileCreator) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={cls.welcomeContainer}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className={cls.welcomeIcon}
          >
            ✨
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={cls.welcomeTitle}
          >
            Welcome to Gybernaty!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={cls.welcomeSubtitle}
          >
            Your wallet is connected. Create your unique Unit Profile to unlock the full potential of the decentralized social platform.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={cls.welcomeBenefits}
          >
            <div className={cls.benefit}>
              <span className={cls.benefitIcon}>🆔</span>
              <span>Unique identity</span>
            </div>
            <div className={cls.benefit}>
              <span className={cls.benefitIcon}>💬</span>
              <span>Decentralized messaging</span>
            </div>
            <div className={cls.benefit}>
              <span className={cls.benefitIcon}>🌐</span>
              <span>Join the community</span>
            </div>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={handleContinueFromWelcome}
            className={cls.continueButton}
          >
            Continue →
          </motion.button>
        </motion.div>
      );
    }

    // If wallet is connected but no profile creator shown, show create profile prompt
    if (isConnected && !showProfileCreator && !showWelcome) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={cls.createProfilePrompt}
        >
          <div className={cls.header}>
            <motion.h2
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className={cls.title}
            >
              🚀 Create Your Unit Profile
            </motion.h2>
            <p className={cls.subtitle}>
              Join thousands of users in the Gybernaty ecosystem. Your profile is your identity in the decentralized world.
            </p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={cls.profileBenefits}
          >
            <div className={cls.benefitCard}>
              <div className={cls.benefitIcon}>🔐</div>
              <h3>Secure & Private</h3>
              <p>Your data is encrypted and stored on IPFS</p>
            </div>
            <div className={cls.benefitCard}>
              <div className={cls.benefitIcon}>🌍</div>
              <h3>Decentralized</h3>
              <p>No central authority, you own your identity</p>
            </div>
            <div className={cls.benefitCard}>
              <div className={cls.benefitIcon}>💎</div>
              <h3>Unique Identity</h3>
              <p>Create your unique unitname and build reputation</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className={cls.actions}
          >
            <button
              onClick={handleCreateProfile}
              className={cls.createButton}
            >
              🚀 Create Unit Profile
            </button>
          </motion.div>
        </motion.div>
      );
    }

    // Default: show wallet connect
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={cls.connectContainer}
      >
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
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={classNames(cls.WalletAuthModal, {}, [className || ''])}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cls.overlay}
            onClick={handleOverlayClick}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={cls.modal}
            >
              <button className={cls.closeButton} onClick={onClose}>
                ✕
              </button>
              <AnimatePresence mode="wait">
                {renderContent()}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}; 