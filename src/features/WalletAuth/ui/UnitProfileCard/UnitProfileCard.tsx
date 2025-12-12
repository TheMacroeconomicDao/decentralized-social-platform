'use client';

import { useUnitProfile } from '@/shared/hooks/useUnitProfile';
import { useToast } from '@/shared/hooks/useToast';
import { Button, ThemeButton } from '@/shared/ui/Button/Button';
import { SafeImage } from '@/shared/ui/SafeImage';
import { ToastContainer } from '@/shared/ui/Toast';
import cls from './UnitProfileCard.module.scss';
import { classNames } from '@/shared/lib/classNames/classNames';

interface UnitProfileCardProps {
  className?: string;
  compact?: boolean;
  showActions?: boolean;
}

export const UnitProfileCard = ({ 
  className, 
  compact = false, 
  showActions = true 
}: UnitProfileCardProps) => {
  const { profile, logout } = useUnitProfile();
  const { toasts, removeToast, success, error } = useToast();

  if (!profile) {
    return null;
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance?: string) => {
    if (!balance) return '0 ETH';
    const num = parseFloat(balance);
    return `${num.toFixed(4)} ETH`;
  };

  const getChainName = (chainId: number) => {
    switch (chainId) {
      case 1: return 'Ethereum';
      case 137: return 'Polygon';
      case 10: return 'Optimism';
      case 42161: return 'Arbitrum';
      case 8453: return 'Base';
      case 11155111: return 'Sepolia';
      default: return 'Unknown';
    }
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(profile.address);
      success('Address copied to clipboard!', 3000);
    } catch (err) {
      console.error('Failed to copy address:', err);
      error('Failed to copy address. Please try again.', 3000);
    }
  };

  return (
    <div className={classNames(cls.UnitProfileCard, {
      [cls.compact]: compact,
    }, [className || ''])}>
      <div className={cls.header}>
        <div className={cls.avatar}>
          <SafeImage
            src={profile.avatar || '/images/teams/member-placeholder.png'}
            alt={profile.unitname}
            width={compact ? 40 : 64}
            height={compact ? 40 : 64}
            className={cls.avatarImage}
          />
          <div className={cls.statusIndicator}></div>
        </div>
        
        <div className={cls.info}>
          <h3 className={cls.unitname}>
            {profile.unitname}
            {profile.ensName && (
              <span className={cls.ensName}>{profile.ensName}</span>
            )}
          </h3>
          <div className={cls.address} onClick={handleCopyAddress}>
            <span className={cls.addressText}>{formatAddress(profile.address)}</span>
            <button className={cls.copyButton} title="Copy address">
              📋
            </button>
          </div>
        </div>
      </div>

      {!compact && (
        <div className={cls.details}>
          <div className={cls.detailItem}>
            <span className={cls.label}>Balance:</span>
            <span className={cls.value}>{formatBalance(profile.balance)}</span>
          </div>
          <div className={cls.detailItem}>
            <span className={cls.label}>Network:</span>
            <span className={cls.value}>{getChainName(profile.chainId)}</span>
          </div>
          <div className={cls.detailItem}>
            <span className={cls.label}>Member since:</span>
            <span className={cls.value}>
              {new Date(profile.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}

      {showActions && (
        <div className={cls.actions}>
          <Button
            theme={ThemeButton.CLEAR}
            onClick={logout}
            className={cls.logoutButton}
          >
            🚪 Logout
          </Button>
          {!compact && (
            <Button
              theme={ThemeButton.BLUE}
              className={cls.dashboardButton}
            >
              📊 Dashboard
            </Button>
          )}
        </div>
      )}
      
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
}; 