'use client';

import { useState } from 'react';
import { UnitProfile } from '@/shared/types/unit-profile';
import { Button, ThemeButton } from '@/shared/ui/Button/Button';
import cls from './UnitProfileEditor.module.scss';
import { classNames } from '@/shared/lib/classNames/classNames';
import { motion } from 'framer-motion';

interface UnitProfileEditorProps {
  profile: UnitProfile;
  onSave: (updatedData: Partial<UnitProfile>) => Promise<void>;
  onCancel: () => void;
  className?: string;
}

export const UnitProfileEditor = ({ 
  profile, 
  onSave, 
  onCancel, 
  className 
}: UnitProfileEditorProps) => {
  const [formData, setFormData] = useState({
    bio: profile.bio || '',
    location: profile.location || '',
    skills: profile.skills?.join(', ') || '',
    socialLinks: {
      github: profile.socialLinks?.github || '',
      telegram: profile.socialLinks?.telegram || '',
      twitter: profile.socialLinks?.twitter || '',
      discord: profile.socialLinks?.discord || '',
      website: profile.socialLinks?.website || '',
    },
    preferences: {
      encryptByDefault: profile.preferences?.encryptByDefault ?? true,
      allowDirectMessages: profile.preferences?.allowDirectMessages ?? true,
      showOnlineStatus: profile.preferences?.showOnlineStatus ?? true,
      theme: profile.preferences?.theme || 'dark',
      language: profile.preferences?.language || 'en',
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handlePreferenceChange = (preference: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: value
      }
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }

    // Validate URLs
    const urlFields = ['github', 'twitter', 'discord', 'website'];
    urlFields.forEach(field => {
      const url = formData.socialLinks[field as keyof typeof formData.socialLinks];
      if (url && !isValidUrl(url)) {
        newErrors[`socialLinks.${field}`] = 'Please enter a valid URL';
      }
    });

    // Validate Telegram (can be username or URL)
    const telegram = formData.socialLinks.telegram;
    if (telegram && !isValidTelegram(telegram)) {
      newErrors['socialLinks.telegram'] = 'Please enter a valid Telegram username or URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const isValidTelegram = (string: string): boolean => {
    // Allow @username, username, or full URL
    return /^(@?[a-zA-Z0-9_]{5,32}|https?:\/\/t\.me\/[a-zA-Z0-9_]{5,32})$/.test(string);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const updatedData: Partial<UnitProfile> = {
        bio: formData.bio || undefined,
        location: formData.location || undefined,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        socialLinks: {
          github: formData.socialLinks.github || undefined,
          telegram: formData.socialLinks.telegram || undefined,
          twitter: formData.socialLinks.twitter || undefined,
          discord: formData.socialLinks.discord || undefined,
          website: formData.socialLinks.website || undefined,
        },
        preferences: formData.preferences,
      };

      await onSave(updatedData);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className={classNames(cls.UnitProfileEditor, {}, [className || ''])}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={cls.header}>
        <h2 className={cls.title}>✏️ Edit Profile</h2>
        <p className={cls.subtitle}>Update your unit profile information</p>
      </div>

      <form onSubmit={handleSubmit} className={cls.form}>
        {/* Basic Information */}
        <div className={cls.section}>
          <h3 className={cls.sectionTitle}>📝 Basic Information</h3>
          
          <div className={cls.inputGroup}>
            <label htmlFor="bio" className={cls.label}>Bio</label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell us about yourself..."
              className={classNames(cls.textarea, {
                [cls.error]: !!errors.bio
              })}
              rows={4}
              maxLength={500}
            />
            {errors.bio && <span className={cls.errorMessage}>{errors.bio}</span>}
            <span className={cls.charCount}>{formData.bio.length}/500</span>
          </div>

          <div className={cls.inputGroup}>
            <label htmlFor="location" className={cls.label}>Location</label>
            <input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="e.g. San Francisco, CA"
              className={cls.input}
            />
          </div>

          <div className={cls.inputGroup}>
            <label htmlFor="skills" className={cls.label}>Skills</label>
            <input
              id="skills"
              type="text"
              value={formData.skills}
              onChange={(e) => handleInputChange('skills', e.target.value)}
              placeholder="e.g. React, TypeScript, Web3, Solidity"
              className={cls.input}
            />
            <span className={cls.helpText}>Separate skills with commas</span>
          </div>
        </div>

        {/* Social Links */}
        <div className={cls.section}>
          <h3 className={cls.sectionTitle}>🔗 Social Links</h3>
          
          <div className={cls.socialGrid}>
            <div className={cls.inputGroup}>
              <label htmlFor="github" className={cls.label}>
                <span className={cls.socialIcon}>🐙</span>
                GitHub
              </label>
              <input
                id="github"
                type="url"
                value={formData.socialLinks.github}
                onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                placeholder="https://github.com/username"
                className={classNames(cls.input, {
                  [cls.error]: !!errors['socialLinks.github']
                })}
              />
              {errors['socialLinks.github'] && (
                <span className={cls.errorMessage}>{errors['socialLinks.github']}</span>
              )}
            </div>

            <div className={cls.inputGroup}>
              <label htmlFor="telegram" className={cls.label}>
                <span className={cls.socialIcon}>📱</span>
                Telegram
              </label>
              <input
                id="telegram"
                type="text"
                value={formData.socialLinks.telegram}
                onChange={(e) => handleSocialLinkChange('telegram', e.target.value)}
                placeholder="@username or https://t.me/username"
                className={classNames(cls.input, {
                  [cls.error]: !!errors['socialLinks.telegram']
                })}
              />
              {errors['socialLinks.telegram'] && (
                <span className={cls.errorMessage}>{errors['socialLinks.telegram']}</span>
              )}
            </div>

            <div className={cls.inputGroup}>
              <label htmlFor="twitter" className={cls.label}>
                <span className={cls.socialIcon}>🐦</span>
                Twitter
              </label>
              <input
                id="twitter"
                type="url"
                value={formData.socialLinks.twitter}
                onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                placeholder="https://twitter.com/username"
                className={classNames(cls.input, {
                  [cls.error]: !!errors['socialLinks.twitter']
                })}
              />
              {errors['socialLinks.twitter'] && (
                <span className={cls.errorMessage}>{errors['socialLinks.twitter']}</span>
              )}
            </div>

            <div className={cls.inputGroup}>
              <label htmlFor="discord" className={cls.label}>
                <span className={cls.socialIcon}>🎮</span>
                Discord
              </label>
              <input
                id="discord"
                type="text"
                value={formData.socialLinks.discord}
                onChange={(e) => handleSocialLinkChange('discord', e.target.value)}
                placeholder="username#1234"
                className={classNames(cls.input, {
                  [cls.error]: !!errors['socialLinks.discord']
                })}
              />
              {errors['socialLinks.discord'] && (
                <span className={cls.errorMessage}>{errors['socialLinks.discord']}</span>
              )}
            </div>

            <div className={cls.inputGroup}>
              <label htmlFor="website" className={cls.label}>
                <span className={cls.socialIcon}>🌐</span>
                Website
              </label>
              <input
                id="website"
                type="url"
                value={formData.socialLinks.website}
                onChange={(e) => handleSocialLinkChange('website', e.target.value)}
                placeholder="https://yourwebsite.com"
                className={classNames(cls.input, {
                  [cls.error]: !!errors['socialLinks.website']
                })}
              />
              {errors['socialLinks.website'] && (
                <span className={cls.errorMessage}>{errors['socialLinks.website']}</span>
              )}
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className={cls.section}>
          <h3 className={cls.sectionTitle}>⚙️ Preferences</h3>
          
          <div className={cls.preferencesGrid}>
            <div className={cls.checkboxGroup}>
              <label className={cls.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.preferences.encryptByDefault}
                  onChange={(e) => handlePreferenceChange('encryptByDefault', e.target.checked)}
                  className={cls.checkbox}
                />
                <span className={cls.checkboxText}>🔐 Encrypt messages by default</span>
              </label>
            </div>

            <div className={cls.checkboxGroup}>
              <label className={cls.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.preferences.allowDirectMessages}
                  onChange={(e) => handlePreferenceChange('allowDirectMessages', e.target.checked)}
                  className={cls.checkbox}
                />
                <span className={cls.checkboxText}>💬 Allow direct messages</span>
              </label>
            </div>

            <div className={cls.checkboxGroup}>
              <label className={cls.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.preferences.showOnlineStatus}
                  onChange={(e) => handlePreferenceChange('showOnlineStatus', e.target.checked)}
                  className={cls.checkbox}
                />
                <span className={cls.checkboxText}>🟢 Show online status</span>
              </label>
            </div>

            <div className={cls.inputGroup}>
              <label htmlFor="theme" className={cls.label}>Theme</label>
              <select
                id="theme"
                value={formData.preferences.theme}
                onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                className={cls.select}
              >
                <option value="dark">🌙 Dark</option>
                <option value="light">☀️ Light</option>
                <option value="auto">🔄 Auto</option>
              </select>
            </div>

            <div className={cls.inputGroup}>
              <label htmlFor="language" className={cls.label}>Language</label>
              <select
                id="language"
                value={formData.preferences.language}
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
                className={cls.select}
              >
                <option value="en">🇺🇸 English</option>
                <option value="ru">🇷🇺 Русский</option>
                <option value="auto">🔄 Auto</option>
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={cls.actions}>
          <Button
            type="button"
            theme={ThemeButton.CLEAR}
            onClick={onCancel}
            disabled={isLoading}
            className={cls.cancelButton}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            theme={ThemeButton.ORANGE}
            disabled={isLoading}
            className={cls.saveButton}
          >
            {isLoading ? (
              <>
                <span className={cls.spinner}></span>
                Saving...
              </>
            ) : (
              '💾 Save Changes'
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}; 