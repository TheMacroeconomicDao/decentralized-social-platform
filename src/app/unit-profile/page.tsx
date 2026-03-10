'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUnitProfile } from '@/shared/hooks/useUnitProfile';
import { useDUNACLA } from '@/shared/hooks/useDUNACLA';
import { WalletAuthModal } from '@/features/WalletAuth/ui/WalletAuthModal/WalletAuthModal';
import { DUNACLAAcceptor } from '@/features/WalletAuth/ui/DUNACLAAcceptor/DUNACLAAcceptor';
import { UnitProfileEditor } from '@/features/UnitProfile/ui/UnitProfileEditor/UnitProfileEditor';
import { TeamsContribute } from '@/features/UnitProfile/ui/TeamsContribute/TeamsContribute';
import { Button, ThemeButton } from '@/shared/ui/Button/Button';
import { UnitProfile, Specialisation, QualificationLevel, ProfileVisibility, ProfileLink, ProfileProject, ProfileDoc } from '@/shared/types/unit-profile';
import { mockUnitProfile } from '@/shared/data/mockUnitProfile';
import cls from './page.module.scss';

type TabType = 'Dashboard' | 'Units' | 'Projects';

const SPECIALISATION_OPTIONS: { value: Specialisation; label: string }[] = [
  { value: 'frontend', label: 'Front End' },
  { value: 'backend', label: 'Back End' },
  { value: 'fullstack', label: 'Full Stack' },
  { value: 'devops', label: 'DevOps' },
  { value: 'blockchain', label: 'Blockchain' },
  { value: 'ai-ml', label: 'AI / ML' },
  { value: 'design', label: 'Design' },
  { value: 'research', label: 'Research' },
  { value: 'pm', label: 'Project Management' },
  { value: 'other', label: 'Other' },
];

const QUALIFICATION_OPTIONS: { value: QualificationLevel; label: string }[] = [
  { value: 'junior', label: 'Junior' },
  { value: 'middle', label: 'Middle' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
  { value: 'principal', label: 'Principal' },
];

const VISIBILITY_OPTIONS: { value: ProfileVisibility; label: string }[] = [
  { value: 'public', label: 'Public' },
  { value: 'community', label: 'Community' },
  { value: 'private', label: 'Private' },
];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function getSocialUrl(platform: string, value?: string): string | null {
  if (!value) return null;
  if (value.startsWith('http')) return value;
  const clean = value.replace(/^@/, '');
  switch (platform) {
    case 'telegram': return `https://t.me/${clean}`;
    case 'github': return `https://github.com/${clean}`;
    case 'twitter': return `https://x.com/${clean}`;
    case 'discord': return null;
    default: return value;
  }
}

function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function UnitProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('Dashboard');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showCLAModal, setShowCLAModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [devProfile, setDevProfile] = useState<UnitProfile | null>(null);

  const searchParams = useSearchParams();
  const isDevPreview = process.env.NODE_ENV === 'development' && searchParams.get('preview') === '1';

  const { profile: realProfile, updateUnitProfile: realUpdate, logout: realLogout } = useUnitProfile();
  const { claAccepted, isCLARequired } = useDUNACLA();

  const profile = isDevPreview ? (devProfile || mockUnitProfile) : realProfile;
  const updateUnitProfile = isDevPreview
    ? async (updates: Partial<UnitProfile>) => { setDevProfile(prev => ({ ...(prev || mockUnitProfile), ...updates } as UnitProfile)); }
    : realUpdate;
  const logout = isDevPreview ? () => {} : realLogout;

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && profile && isCLARequired && !claAccepted) {
      setShowCLAModal(true);
    }
  }, [mounted, profile, isCLARequired, claAccepted]);

  const handleCopyAddress = useCallback(async () => {
    if (!profile?.address) return;
    try {
      await navigator.clipboard.writeText(profile.address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch { /* clipboard not available */ }
  }, [profile?.address]);

  const handleSelectChange = useCallback((field: string, value: string) => {
    if (!profile) return;
    updateUnitProfile({ [field]: value } as Partial<UnitProfile>);
  }, [profile, updateUnitProfile]);

  const handleAddLink = useCallback(() => {
    if (!profile) return;
    const title = prompt('Link title:');
    const url = prompt('URL:');
    if (!title || !url) return;
    const newLink: ProfileLink = { id: generateId(), title, url };
    updateUnitProfile({ links: [...(profile.links || []), newLink] });
  }, [profile, updateUnitProfile]);

  const handleAddProject = useCallback(() => {
    if (!profile) return;
    const title = prompt('Project name:');
    const url = prompt('Project URL (optional):');
    if (!title) return;
    const newProject: ProfileProject = { id: generateId(), title, url: url || undefined };
    updateUnitProfile({ projects: [...(profile.projects || []), newProject] });
  }, [profile, updateUnitProfile]);

  const handleAddDoc = useCallback(() => {
    if (!profile) return;
    const title = prompt('Document title:');
    const url = prompt('Document URL (optional):');
    if (!title) return;
    const newDoc: ProfileDoc = { id: generateId(), title, url: url || undefined };
    updateUnitProfile({ docs: [...(profile.docs || []), newDoc] });
  }, [profile, updateUnitProfile]);

  const handleRemoveLink = useCallback((id: string) => {
    if (!profile) return;
    updateUnitProfile({ links: (profile.links || []).filter(l => l.id !== id) });
  }, [profile, updateUnitProfile]);

  const handleRemoveProject = useCallback((id: string) => {
    if (!profile) return;
    updateUnitProfile({ projects: (profile.projects || []).filter(p => p.id !== id) });
  }, [profile, updateUnitProfile]);

  const handleRemoveDoc = useCallback((id: string) => {
    if (!profile) return;
    updateUnitProfile({ docs: (profile.docs || []).filter(d => d.id !== id) });
  }, [profile, updateUnitProfile]);

  const handleSaveProfile = useCallback(async (updates: Partial<UnitProfile>) => {
    await updateUnitProfile(updates);
    setIsEditing(false);
  }, [updateUnitProfile]);

  if (!mounted) {
    return (
      <div className={cls.container}>
        <div className={cls.noProfile}><h1>Loading...</h1></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <>
        <div className={cls.container}>
          <div className={cls.noProfile}>
            <h1>Connect your wallet to access Unit Profile</h1>
            <Button theme={ThemeButton.ORANGE} onClick={() => setIsAuthModalOpen(true)}>
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

  if (isEditing) {
    return (
      <div className={cls.container}>
        <UnitProfileEditor
          profile={profile}
          onSave={handleSaveProfile}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  const socialEntries = [
    { key: 'telegram', icon: '/images/icons/telegram-icon.svg', label: 'Telegram' },
    { key: 'github', icon: '/images/icons/github-icon.svg', label: 'GitHub' },
    { key: 'twitter', icon: '/images/icons/twitter-icon.svg', label: 'Twitter' },
    { key: 'discord', icon: '/images/icons/discord-icon.svg', label: 'Discord' },
  ].filter(s => profile.socialLinks?.[s.key as keyof typeof profile.socialLinks]);

  return (
    <>
    <div className={cls.container}>
      {/* CLA Status Banner */}
      <div className={cls.claBanner}>
        {claAccepted ? (
          <span className={cls.claBadgeOk}>
            CLA Accepted — DUNA-CLA v{claAccepted.version}
            {claAccepted.githubUsername && ` · @${claAccepted.githubUsername}`}
          </span>
        ) : (
          <button
            type="button"
            className={cls.claBadgeWarn}
            onClick={() => setShowCLAModal(true)}
          >
            IP Assignment Required — Accept DUNA-CLA
          </button>
        )}
      </div>

      {/* Header */}
      <div className={cls.header}>
        <h1 className={cls.title}>UNIT PROFILE</h1>
        <div className={cls.walletAddress}>
          <span>Wallet Address: </span>
          <button
            className={cls.addressCopy}
            onClick={handleCopyAddress}
            title="Copy address"
          >
            <span className={cls.address}>{formatAddress(profile.address)}</span>
            <span className={cls.copyIcon}>{copiedAddress ? '✓' : '⧉'}</span>
          </button>
        </div>
        <div className={cls.headerActions}>
          <button className={cls.editButton} onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
          <button className={cls.logoutButton} onClick={logout}>
            Disconnect
          </button>
        </div>
      </div>

      {/* Tabs */}
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

      {/* Dashboard Tab */}
      {activeTab === 'Dashboard' && (
        <>
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
                  {socialEntries.length > 0 && (
                    <div className={cls.socialLinks}>
                      {socialEntries.map(({ key, icon, label }) => {
                        const value = profile.socialLinks?.[key as keyof typeof profile.socialLinks];
                        const url = getSocialUrl(key, value);
                        if (!url) return (
                          <span key={key} className={cls.socialLink} title={`${label}: ${value}`}>
                            <img src={icon} alt={label} width={18} height={18} />
                          </span>
                        );
                        return (
                          <a key={key} href={url} target="_blank" rel="noopener noreferrer" className={cls.socialLink} title={label}>
                            <img src={icon} alt={label} width={18} height={18} />
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className={cls.aboutSection}>
                  <h3>About me:</h3>
                  <p className={cls.aboutText}>
                    {profile.bio || 'No bio yet. Click "Edit Profile" to add one.'}
                  </p>
                  {profile.skills && profile.skills.length > 0 && (
                    <div className={cls.skillsTags}>
                      {profile.skills.map((skill, i) => (
                        <span key={i} className={cls.skillTag}>{skill}</span>
                      ))}
                    </div>
                  )}
                  {profile.location && (
                    <p className={cls.location}>{profile.location}</p>
                  )}
                </div>
              </div>
            </div>

            <div className={cls.rightPanel}>
              <div className={cls.userInfo}>
                <div className={cls.infoRow}>
                  <span className={cls.label}>Username:</span>
                  <span className={cls.value}>{profile.unitname}</span>
                </div>
                <div className={cls.infoRow}>
                  <span className={cls.label}>Balance:</span>
                  <span className={cls.value}>{profile.balance || '0'} ETH</span>
                </div>
                {profile.fullName && (
                  <div className={cls.infoRow}>
                    <span className={cls.label}>Full Name:</span>
                    <span className={cls.value}>{profile.fullName}</span>
                  </div>
                )}
                {profile.unitType && (
                  <div className={cls.infoRow}>
                    <span className={cls.label}>Unit Type:</span>
                    <span className={cls.value}>{profile.unitType}</span>
                  </div>
                )}
                {profile.email && (
                  <div className={cls.infoRow}>
                    <span className={cls.label}>Email:</span>
                    <span className={cls.value}>{profile.email}</span>
                  </div>
                )}
                {profile.socialLinks?.github && (
                  <div className={cls.infoRow}>
                    <span className={cls.label}>Github:</span>
                    <span className={cls.value}>{profile.socialLinks.github}</span>
                  </div>
                )}
                {profile.ensName && (
                  <div className={cls.infoRow}>
                    <span className={cls.label}>ENS:</span>
                    <span className={cls.value}>{profile.ensName}</span>
                  </div>
                )}
                <div className={cls.infoRow}>
                  <span className={cls.label}>Member since:</span>
                  <span className={cls.value}>{formatDate(profile.createdAt)}</span>
                </div>
              </div>

              <div className={cls.teamsSection}>
                <TeamsContribute />
              </div>

              <div className={cls.rightSidebar}>
                <div className={cls.sidebarField}>
                  <h4>Specialisation:</h4>
                  <select
                    className={cls.select}
                    value={profile.specialisation || ''}
                    onChange={(e) => handleSelectChange('specialisation', e.target.value)}
                  >
                    <option value="">Select</option>
                    {SPECIALISATION_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div className={cls.sidebarField}>
                  <h4>Stack:</h4>
                  <div className={cls.stackDisplay}>
                    {profile.skills && profile.skills.length > 0
                      ? profile.skills.join(', ')
                      : 'Not specified'}
                  </div>
                </div>

                <div className={cls.sidebarField}>
                  <h4>Qualifications:</h4>
                  <select
                    className={cls.select}
                    value={profile.qualifications || ''}
                    onChange={(e) => handleSelectChange('qualifications', e.target.value)}
                  >
                    <option value="">Select</option>
                    {QUALIFICATION_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div className={cls.sidebarField}>
                  <h4>Language:</h4>
                  <div className={cls.stackDisplay}>
                    {profile.languages?.join(' / ') || profile.preferences.language.toUpperCase()}
                  </div>
                </div>

                <div className={cls.sidebarField}>
                  <h4>Profile visibility:</h4>
                  <select
                    className={`${cls.select} ${
                      (profile.profileVisibility || 'public') === 'public' ? cls.selectPublic :
                      (profile.profileVisibility || 'public') === 'private' ? cls.selectPrivate : ''
                    }`}
                    value={profile.profileVisibility || 'public'}
                    onChange={(e) => handleSelectChange('profileVisibility', e.target.value)}
                  >
                    {VISIBILITY_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom sections: Links, Projects, Docs */}
          <div className={cls.bottomSection}>
            <div className={cls.section}>
              <div className={cls.sectionHeader}>
                <h3>Links</h3>
                <button className={cls.addButton} onClick={handleAddLink} title="Add link">+</button>
              </div>
              <div className={cls.linksGrid}>
                {profile.links && profile.links.length > 0 ? (
                  profile.links.map((link) => (
                    <div key={link.id} className={cls.linkItem}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className={cls.itemLink}>
                        <div className={cls.linkIcon}>🔗</div>
                        <span>{link.title}</span>
                      </a>
                      <button
                        className={cls.removeItemBtn}
                        onClick={() => handleRemoveLink(link.id)}
                        title="Remove"
                      >×</button>
                    </div>
                  ))
                ) : (
                  <div className={cls.emptyState}>No links yet</div>
                )}
              </div>
            </div>

            <div className={cls.section}>
              <div className={cls.sectionHeader}>
                <h3>Projects</h3>
                <button className={cls.addButton} onClick={handleAddProject} title="Add project">+</button>
              </div>
              <div className={cls.projectsGrid}>
                {profile.projects && profile.projects.length > 0 ? (
                  profile.projects.map((project) => (
                    <div key={project.id} className={cls.projectItem}>
                      {project.url ? (
                        <a href={project.url} target="_blank" rel="noopener noreferrer" className={cls.itemLink}>
                          <div className={cls.projectIcon}>📁</div>
                          <span>{project.title}</span>
                        </a>
                      ) : (
                        <>
                          <div className={cls.projectIcon}>📁</div>
                          <span>{project.title}</span>
                        </>
                      )}
                      <button
                        className={cls.removeItemBtn}
                        onClick={() => handleRemoveProject(project.id)}
                        title="Remove"
                      >×</button>
                    </div>
                  ))
                ) : (
                  <div className={cls.emptyState}>No projects yet</div>
                )}
              </div>
            </div>

            <div className={cls.section}>
              <div className={cls.sectionHeader}>
                <h3>Docs</h3>
                <button className={cls.addButton} onClick={handleAddDoc} title="Add document">+</button>
              </div>
              <div className={cls.docsGrid}>
                {profile.docs && profile.docs.length > 0 ? (
                  profile.docs.map((doc) => (
                    <div key={doc.id} className={cls.docItem}>
                      {doc.url ? (
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className={cls.itemLink}>
                          <div className={cls.docIcon}>📄</div>
                          <span>{doc.title}</span>
                        </a>
                      ) : (
                        <>
                          <div className={cls.docIcon}>📄</div>
                          <span>{doc.title}</span>
                        </>
                      )}
                      <button
                        className={cls.removeItemBtn}
                        onClick={() => handleRemoveDoc(doc.id)}
                        title="Remove"
                      >×</button>
                    </div>
                  ))
                ) : (
                  <div className={cls.emptyState}>No documents yet</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Units Tab */}
      {activeTab === 'Units' && (
        <div className={cls.tabContent}>
          <div className={cls.statsGrid}>
            <div className={cls.statCard}>
              <div className={cls.statValue}>{profile.stats.messagesCount}</div>
              <div className={cls.statLabel}>Messages</div>
            </div>
            <div className={cls.statCard}>
              <div className={cls.statValue}>{profile.stats.chatsCount}</div>
              <div className={cls.statLabel}>Chats</div>
            </div>
            <div className={cls.statCard}>
              <div className={cls.statValue}>{profile.stats.connectionsCount}</div>
              <div className={cls.statLabel}>Connections</div>
            </div>
            <div className={cls.statCard}>
              <div className={cls.statValue}>{profile.stats.reputation}</div>
              <div className={cls.statLabel}>Reputation</div>
            </div>
          </div>
          <div className={cls.emptyTabState}>
            <p>Unit network connections will appear here as the platform grows.</p>
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'Projects' && (
        <div className={cls.tabContent}>
          {profile.projects && profile.projects.length > 0 ? (
            <div className={cls.projectsList}>
              {profile.projects.map((project) => (
                <div key={project.id} className={cls.projectCard}>
                  <h4>{project.title}</h4>
                  {project.description && <p>{project.description}</p>}
                  {project.role && <span className={cls.projectRole}>{project.role}</span>}
                  {project.url && (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className={cls.projectUrl}>
                      View project
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={cls.emptyTabState}>
              <p>Your projects will appear here. Add them from the Dashboard tab.</p>
            </div>
          )}
        </div>
      )}
    </div>

    {/* CLA Modal Overlay */}
    {showCLAModal && (
      <div className={cls.claModalOverlay} role="presentation">
        <div className={cls.claModalBox}>
          <button
            type="button"
            className={cls.claModalClose}
            onClick={() => setShowCLAModal(false)}
            aria-label="Close"
          >
            ✕
          </button>
          <DUNACLAAcceptor onSuccess={() => setShowCLAModal(false)} />
        </div>
      </div>
    )}
    </>
  );
}
