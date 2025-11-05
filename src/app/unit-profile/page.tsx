'use client';

import { useState, useEffect } from 'react';
import { useUnitProfile } from '@/shared/hooks/useUnitProfile';
import { WalletAuthModal } from '@/features/WalletAuth/ui/WalletAuthModal/WalletAuthModal';
import { TeamsContribute } from '@/features/UnitProfile/ui/TeamsContribute/TeamsContribute';
import { Button, ThemeButton } from '@/shared/ui/Button/Button';
import cls from './page.module.scss';

type TabType = 'Dashboard' | 'Units' | 'Projects';

export default function UnitProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('Dashboard');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Always call useUnitProfile unconditionally
  const { profile } = useUnitProfile();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cls.container}>
        <div className={cls.noProfile}>
          <h1>Loading...</h1>
        </div>
      </div>
    );
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
    <div className={cls.container}>
      <div className={cls.header}>
        <h1 className={cls.title}>UNIT PROFILE</h1>
        <div className={cls.walletAddress}>
          <span>Wallet Address: </span>
          <span className={cls.address}>{profile.address}</span>
        </div>
      </div>

      <div className={cls.tabs}>
        {(['Dashboard', 'Units', 'Projects'] as TabType[]).map((tab) => (
          <button
            key={tab}
            className={`${cls.tab} ${activeTab === tab ? cls.active : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={cls.content}>
        <div className={cls.leftPanel}>
          <div className={cls.profileCard}>
            <div className={cls.avatarSection}>
              <div className={cls.avatar}>
                <div 
                  style={{
                    backgroundImage: `url(${profile.avatar || '/images/teams/member-placeholder.png'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    width: '100%',
                    height: '100%'
                  }}
                  role="img"
                  aria-label={profile.unitname}
                />
              </div>
              <div className={cls.socialLinks}>
                <a href="#" className={cls.socialLink}>📱</a>
                <a href="#" className={cls.socialLink}>📧</a>
                <a href="#" className={cls.socialLink}>🐙</a>
                <a href="#" className={cls.socialLink}>🐦</a>
              </div>
            </div>
            
            <div className={cls.aboutSection}>
              <h3>About me:</h3>
              <p className={cls.aboutText}>
                {profile.bio || 'About me About me About me Abo ut me n About me About me Abo ut me About me About me Abo ut me About me About me Abo'}
              </p>
            </div>
          </div>
        </div>

        <div className={cls.rightPanel}>
          <div className={cls.userInfo}>
            <div className={cls.infoRow}>
              <span className={cls.label}>*Username:</span>
              <span className={cls.value}>{profile.unitname}</span>
            </div>
            <div className={cls.infoRow}>
              <span className={cls.label}>Balance:</span>
              <span className={cls.value}>{profile.balance || '0'} ETH</span>
            </div>
            <div className={cls.infoRow}>
              <span className={cls.label}>Full Name:</span>
              <span className={cls.value}>Vasiliy Voyt</span>
            </div>
            <div className={cls.infoRow}>
              <span className={cls.label}>Unit Type:</span>
              <span className={cls.value}>Lead Dev</span>
            </div>
            <div className={cls.infoRow}>
              <span className={cls.label}>Email:</span>
              <span className={cls.value}>novikov.egor@gmail.com</span>
            </div>
            <div className={cls.infoRow}>
              <span className={cls.label}>Github:</span>
              <span className={cls.value}>/themacroeconomicdao</span>
            </div>
          </div>

          <div className={cls.teamsSection}>
            <TeamsContribute />
          </div>

          <div className={cls.rightSidebar}>
            <div className={cls.specialisation}>
              <h4>*Specialisation:</h4>
              <select className={cls.select}>
                <option>Front End</option>
              </select>
            </div>
            
            <div className={cls.stack}>
              <h4>*Stack:</h4>
              <select className={cls.select}>
                <option>Select</option>
              </select>
            </div>
            
            <div className={cls.qualifications}>
              <h4>Qualifications:</h4>
              <select className={cls.select}>
                <option>Middle</option>
              </select>
            </div>
            
            <div className={cls.language}>
              <h4>Language:</h4>
              <select className={cls.select}>
                <option>ENG/RU/RU</option>
              </select>
            </div>
            
            <div className={cls.visibility}>
              <h4>Profile visibility:</h4>
              <button className={cls.publicButton}>Public</button>
            </div>
          </div>
        </div>
      </div>

      <div className={cls.bottomSection}>
        <div className={cls.section}>
          <div className={cls.sectionHeader}>
            <h3>Links</h3>
            <button className={cls.addButton}>+</button>
          </div>
          <div className={cls.linksGrid}>
            {Array.from({ length: 16 }, (_, i) => (
              <div key={i} className={cls.linkItem}>
                <div className={cls.linkIcon}>X</div>
                <span>CyberPlan</span>
              </div>
            ))}
          </div>
        </div>

        <div className={cls.section}>
          <div className={cls.sectionHeader}>
            <h3>Projects</h3>
            <button className={cls.addButton}>+</button>
          </div>
          <div className={cls.projectsGrid}>
            {Array.from({ length: 16 }, (_, i) => (
              <div key={i} className={cls.projectItem}>
                <div className={cls.projectIcon}>X</div>
                <span>CyberPlan</span>
              </div>
            ))}
          </div>
        </div>

        <div className={cls.section}>
          <div className={cls.sectionHeader}>
            <h3>Docs</h3>
            <button className={cls.addButton}>+</button>
          </div>
          <div className={cls.docsGrid}>
            {Array.from({ length: 16 }, (_, i) => (
              <div key={i} className={cls.docItem}>
                <div className={cls.docIcon}>📄</div>
                <span>CyberPlan</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 