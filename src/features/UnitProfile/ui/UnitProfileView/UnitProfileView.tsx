'use client';

import { useState } from 'react';
import { useUnitProfile } from '@/shared/hooks/useUnitProfile';
import { useToast } from '@/shared/hooks/useToast';
import { Button, ThemeButton } from '@/shared/ui/Button/Button';
import { SafeImage } from '@/shared/ui/SafeImage';
import { ToastContainer } from '@/shared/ui/Toast';
import { UnitProfileEditor } from '../UnitProfileEditor/UnitProfileEditor';
import cls from './UnitProfileView.module.scss';
import { classNames } from '@/shared/lib/classNames/classNames';
import { motion } from 'framer-motion';

interface UnitProfileViewProps {
  className?: string;
  editable?: boolean;
}

export const UnitProfileView = ({ className, editable = true }: UnitProfileViewProps) => {
  const { profile, updateUnitProfile } = useUnitProfile();
  const { toasts, success, error, removeToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  if (!profile) {
    return null;
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const formatBalance = (balance?: string) => {
    if (!balance) return '0.0000 ETH';
    const num = parseFloat(balance);
    return `${num.toFixed(4)} ETH`;
  };

  const getChainName = (chainId: number) => {
    switch (chainId) {
      case 1: return 'Ethereum Mainnet';
      case 137: return 'Polygon';
      case 10: return 'Optimism';
      case 42161: return 'Arbitrum One';
      case 8453: return 'Base';
      case 11155111: return 'Sepolia Testnet';
      default: return `Chain ${chainId}`;
    }
  };

  const getChainIcon = (chainId: number) => {
    switch (chainId) {
      case 1: return '⟠';
      case 137: return '🔮';
      case 10: return '🔴';
      case 42161: return '🔵';
      case 8453: return '🟦';
      default: return '⚡';
    }
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(profile.address);
      success('Address copied to clipboard');
    } catch (err) {
      console.error('Failed to copy address:', err);
      error('Failed to copy address');
    }
  };

  const handleSaveProfile = async (updatedData: Partial<typeof profile>) => {
    await updateUnitProfile(updatedData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <UnitProfileEditor
        profile={profile}
        onSave={handleSaveProfile}
        onCancel={() => setIsEditing(false)}
        className={className}
      />
    );
  }

  return (
    <motion.div 
      className={classNames(cls.UnitProfileView, {}, [className || ''])}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <div className={cls.header}>
        <div className={cls.avatarSection}>
          <div className={cls.avatarContainer}>
            <SafeImage
              src={profile.avatar || '/images/teams/member-placeholder.png'}
              alt={profile.unitname}
              width={120}
              height={120}
              className={cls.avatar}
            />
            <div className={cls.statusIndicator}></div>
          </div>
          
          {editable && (
            <Button
              theme={ThemeButton.CLEAR}
              onClick={() => setIsEditing(true)}
              className={cls.editButton}
            >
              ✏️ Edit Profile
            </Button>
          )}
        </div>

        <div className={cls.profileInfo}>
          <div className={cls.nameSection}>
            <h1 className={cls.unitname}>{profile.unitname}</h1>
            {profile.ensName && (
              <span className={cls.ensName}>{profile.ensName}</span>
            )}
            <div className={cls.addressContainer} onClick={handleCopyAddress}>
              <span className={cls.address}>{formatAddress(profile.address)}</span>
              <button className={cls.copyButton} title="Copy full address">
                📋
              </button>
            </div>
          </div>

          <div className={cls.chainInfo}>
            <span className={cls.chainIcon}>{getChainIcon(profile.chainId)}</span>
            <span className={cls.chainName}>{getChainName(profile.chainId)}</span>
            <span className={cls.balance}>{formatBalance(profile.balance)}</span>
          </div>

          {profile.bio && (
            <p className={cls.bio}>{profile.bio}</p>
          )}

          {profile.location && (
            <div className={cls.location}>
              <span className={cls.locationIcon}>📍</span>
              <span>{profile.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className={cls.statsSection}>
        <h3 className={cls.sectionTitle}>📊 Statistics</h3>
        <div className={cls.statsGrid}>
          <motion.div 
            className={cls.statCard}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className={cls.statIcon}>💬</div>
            <div className={cls.statInfo}>
              <span className={cls.statValue}>{profile.stats?.messagesCount || 0}</span>
              <span className={cls.statLabel}>Messages</span>
            </div>
          </motion.div>

          <motion.div 
            className={cls.statCard}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className={cls.statIcon}>💼</div>
            <div className={cls.statInfo}>
              <span className={cls.statValue}>{profile.stats?.chatsCount || 0}</span>
              <span className={cls.statLabel}>Chats</span>
            </div>
          </motion.div>

          <motion.div 
            className={cls.statCard}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className={cls.statIcon}>🤝</div>
            <div className={cls.statInfo}>
              <span className={cls.statValue}>{profile.stats?.connectionsCount || 0}</span>
              <span className={cls.statLabel}>Connections</span>
            </div>
          </motion.div>

          <motion.div 
            className={cls.statCard}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className={cls.statIcon}>⭐</div>
            <div className={cls.statInfo}>
              <span className={cls.statValue}>{profile.stats?.reputation || 0}</span>
              <span className={cls.statLabel}>Reputation</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Skills Section */}
      {profile.skills && profile.skills.length > 0 && (
        <div className={cls.skillsSection}>
          <h3 className={cls.sectionTitle}>🛠️ Skills</h3>
          <div className={cls.skillsContainer}>
            {profile.skills.map((skill, index) => (
              <motion.span
                key={skill}
                className={cls.skillTag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* Social Links Section */}
      {profile.socialLinks && Object.keys(profile.socialLinks).length > 0 && (
        <div className={cls.socialSection}>
          <h3 className={cls.sectionTitle}>🔗 Social Links</h3>
          <div className={cls.socialLinks}>
            {profile.socialLinks.github && (
              <a
                href={profile.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className={cls.socialLink}
              >
                <span className={cls.socialIcon}>🐙</span>
                <span>GitHub</span>
              </a>
            )}
            {profile.socialLinks.telegram && (
              <a
                href={profile.socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className={cls.socialLink}
              >
                <span className={cls.socialIcon}>📱</span>
                <span>Telegram</span>
              </a>
            )}
            {profile.socialLinks.twitter && (
              <a
                href={profile.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className={cls.socialLink}
              >
                <span className={cls.socialIcon}>🐦</span>
                <span>Twitter</span>
              </a>
            )}
            {profile.socialLinks.discord && (
              <a
                href={profile.socialLinks.discord}
                target="_blank"
                rel="noopener noreferrer"
                className={cls.socialLink}
              >
                <span className={cls.socialIcon}>🎮</span>
                <span>Discord</span>
              </a>
            )}
            {profile.socialLinks.website && (
              <a
                href={profile.socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className={cls.socialLink}
              >
                <span className={cls.socialIcon}>🌐</span>
                <span>Website</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Member Info Section */}
      <div className={cls.memberInfo}>
        <h3 className={cls.sectionTitle}>ℹ️ Member Information</h3>
        <div className={cls.infoGrid}>
          <div className={cls.infoItem}>
            <span className={cls.infoLabel}>Member since:</span>
            <span className={cls.infoValue}>
              {new Date(profile.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          <div className={cls.infoItem}>
            <span className={cls.infoLabel}>Last active:</span>
            <span className={cls.infoValue}>
              {new Date(profile.lastLoginAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
          {profile.timezone && (
            <div className={cls.infoItem}>
              <span className={cls.infoLabel}>Timezone:</span>
              <span className={cls.infoValue}>{profile.timezone}</span>
            </div>
          )}
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </motion.div>
  );
}; 