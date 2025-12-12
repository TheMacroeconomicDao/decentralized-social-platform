'use client';

import { useState } from 'react';
import { useUnitProfile } from '@/shared/hooks/useUnitProfile';
import { Button, ThemeButton } from '@/shared/ui/Button/Button';
import cls from './UnitProfileCreator.module.scss';
import { classNames } from '@/shared/lib/classNames/classNames';

interface UnitProfileCreatorProps {
  className?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const UnitProfileCreator = ({ className, onSuccess, onCancel }: UnitProfileCreatorProps) => {
  const [unitname, setUnitname] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  const { createUnitProfile, checkUnitnameAvailability, isLoading, error, clearError } = useUnitProfile();

  const validateUnitname = (name: string): boolean => {
    if (name.length < 3) {
      setValidationError('Unitname must be at least 3 characters long');
      return false;
    }
    if (name.length > 20) {
      setValidationError('Unitname must be less than 20 characters');
      return false;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
      setValidationError('Unitname can only contain letters, numbers, underscores, and hyphens');
      return false;
    }
    setValidationError('');
    return true;
  };

  const checkAvailability = async (name: string) => {
    if (!validateUnitname(name)) return;
    
    setIsValidating(true);
    try {
      const isAvailable = await checkUnitnameAvailability(name);
      if (!isAvailable) {
        setValidationError('This unitname is already taken. Please choose another one.');
      } else {
        setValidationError('');
      }
    } catch (error) {
      setValidationError('Error checking availability. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleUnitmameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUnitname(value);
    if (value) {
      validateUnitname(value);
    } else {
      setValidationError('');
    }
  };

  const handleUnitmameBlur = () => {
    if (unitname && !validationError) {
      checkAvailability(unitname);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateUnitname(unitname)) {
      return;
    }

    setIsValidating(true);
    clearError();

    try {
      await createUnitProfile(unitname);
      onSuccess?.();
    } catch (err) {
      console.error('Failed to create unit profile:', err);
    } finally {
      setIsValidating(false);
    }
  };

  const handleCancel = () => {
    setUnitname('');
    setValidationError('');
    clearError();
    onCancel?.();
  };

  return (
    <div className={classNames(cls.UnitProfileCreator, {}, [className || ''])}>
      <div className={cls.header}>
        <h2 className={cls.title}>Create Your Unit Profile</h2>
        <p className={cls.subtitle}>
          Choose a unique unitname for your identity in the Gybernaty ecosystem
        </p>
      </div>

      <form onSubmit={handleSubmit} className={cls.form}>
        <div className={cls.inputGroup}>
          <label htmlFor="unitname" className={cls.label}>
            Unitname
          </label>
          <input
            id="unitname"
            type="text"
            value={unitname}
            onChange={handleUnitmameChange}
            onBlur={handleUnitmameBlur}
            placeholder="Enter your unitname"
            className={classNames(cls.input, {
              [cls.error]: !!(validationError || error),
              [cls.valid]: !!(unitname && !validationError && !error),
              [cls.checking]: isValidating,
            })}
            disabled={isLoading || isValidating}
            autoComplete="off"
          />
          {validationError && (
            <span className={cls.errorMessage}>{validationError}</span>
          )}
          {error && (
            <span className={cls.errorMessage}>{error}</span>
          )}
        </div>

        <div className={cls.infoBox}>
          <h4 className={cls.infoTitle}>🔐 What happens next?</h4>
          <ul className={cls.infoList}>
            <li>You&apos;ll be asked to sign a message with your wallet</li>
            <li>This proves you own the wallet address</li>
            <li>Your unit profile will be created and stored locally</li>
            <li>No gas fees - it&apos;s just a signature!</li>
          </ul>
        </div>

        <div className={cls.actions}>
          <Button
            type="button"
            theme={ThemeButton.CLEAR}
            onClick={handleCancel}
            disabled={isLoading || isValidating}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            theme={ThemeButton.ORANGE}
            disabled={!unitname || !!validationError || isLoading || isValidating}
            className={cls.createButton}
          >
            {isLoading || isValidating ? (
              <>
                <span className={cls.spinner}></span>
                Creating...
              </>
            ) : (
              '🚀 Create Unit Profile'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}; 