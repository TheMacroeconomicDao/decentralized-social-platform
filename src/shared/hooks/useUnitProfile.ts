'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useSignMessage, useDisconnect, useEnsName, useBalance } from 'wagmi';
import { UnitProfile, UnitProfileState, SignatureData } from '@/shared/types/unit-profile';

const STORAGE_KEY = 'dsp_unit_profile';
const SIGNATURE_KEY = 'dsp_signature_data';
const UNITNAMES_KEY = 'dsp_unitnames_registry';

const DEFAULT_PREFERENCES = {
  encryptByDefault: true,
  allowDirectMessages: true,
  showOnlineStatus: true,
  theme: 'dark' as const,
  language: 'en' as const,
};

const DEFAULT_STATS = {
  messagesCount: 0,
  chatsCount: 0,
  connectionsCount: 0,
  reputation: 0,
};

// Simulated unitname registry (in real app, this would be on blockchain or backend)
const getUnitnamesRegistry = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  try {
    const registry = localStorage.getItem(UNITNAMES_KEY);
    return registry ? JSON.parse(registry) : {};
  } catch {
    return {};
  }
};

const setUnitnamesRegistry = (registry: Record<string, string>) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(UNITNAMES_KEY, JSON.stringify(registry));
};

// Main hook that always calls wagmi hooks unconditionally
export const useUnitProfile = () => {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<UnitProfileState>({
    profile: null,
    isLoading: false,
    error: null,
  });

  // Always call wagmi hooks unconditionally (Rules of Hooks)
  const { address, isConnected, chainId } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ 
    address: address,
    enabled: !!address && mounted
  });
  const { data: balance } = useBalance({ 
    address: address,
    enabled: !!address && mounted
  });

  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load profile from localStorage on mount
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    
    const savedProfile = localStorage.getItem(STORAGE_KEY);
    const savedSignature = localStorage.getItem(SIGNATURE_KEY);
    
    if (savedProfile && savedSignature && isConnected && address) {
      try {
        const profile: UnitProfile = JSON.parse(savedProfile);
        const signature: SignatureData = JSON.parse(savedSignature);
        
        // Verify the profile belongs to current address
        if (profile.address === address && signature.address === address) {
          // Ensure profile has all required fields with defaults
          const updatedProfile: UnitProfile = {
            ...profile,
            isConnected: true,
            lastLoginAt: Date.now(),
            balance: balance?.formatted,
            ensName: ensName || profile.ensName,
            chainId: chainId || profile.chainId,
            preferences: {
              ...DEFAULT_PREFERENCES,
              ...profile.preferences,
            },
            stats: {
              ...DEFAULT_STATS,
              ...profile.stats,
            },
          };

          setState({
            profile: updatedProfile,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Error loading saved profile:', error);
        if (typeof window !== 'undefined') {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(SIGNATURE_KEY);
        }
      }
    }
  }, [mounted, address, isConnected, chainId, ensName, balance]);

  const checkUnitnameAvailability = useCallback(async (unitname: string): Promise<boolean> => {
    if (!mounted || typeof window === 'undefined') return false;
    
    // Basic validation
    if (!unitname || unitname.length < 3 || unitname.length > 20) {
      return false;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(unitname)) {
      return false;
    }

    // Check against local registry
    const registry = getUnitnamesRegistry();
    const normalizedUnitname = unitname.toLowerCase();
    
    // Check if unitname is already taken
    if (registry[normalizedUnitname]) {
      return false;
    }

    // In a real app, you would also check against blockchain/backend
    // For now, we'll simulate this with a small delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return true;
  }, [mounted]);

  const createUnitProfile = useCallback(async (unitname: string): Promise<void> => {
    if (!mounted || !address || !isConnected || !signMessageAsync) {
      setState(prev => ({ ...prev, error: 'Wallet not connected' }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Check unitname availability
      const isAvailable = await checkUnitnameAvailability(unitname);
      if (!isAvailable) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Unitname is already taken or invalid. Please choose another one.'
        }));
        return;
      }

      // Create signature message
      const message = `Welcome to DSP - Decentralized Social Platform!\n\nSign this message to create your unit profile:\n\nUnitname: ${unitname}\nAddress: ${address}\nTimestamp: ${Date.now()}\n\nThis signature proves you own this wallet and creates your unique unit identity in the Gybernaty ecosystem.`;

      // Request signature from user
      const signature = await signMessageAsync({ message });

      // Create unit profile with all required fields
      const profile: UnitProfile = {
        address,
        unitname,
        ensName: ensName || undefined,
        chainId: chainId || 1,
        balance: balance?.formatted,
        isConnected: true,
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
        preferences: DEFAULT_PREFERENCES,
        stats: DEFAULT_STATS,
      };

      // Create signature data
      const signatureData: SignatureData = {
        message,
        signature,
        address,
        timestamp: Date.now(),
      };

      // Register unitname in local registry
      const registry = getUnitnamesRegistry();
      registry[unitname.toLowerCase()] = address;
      setUnitnamesRegistry(registry);

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
        localStorage.setItem(SIGNATURE_KEY, JSON.stringify(signatureData));
      }

      setState({
        profile,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error creating unit profile:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create unit profile',
      }));
    }
  }, [mounted, address, isConnected, chainId, ensName, balance, signMessageAsync, checkUnitnameAvailability]);

  const updateUnitProfile = useCallback(async (updates: Partial<UnitProfile>): Promise<void> => {
    if (!mounted || !state.profile || typeof window === 'undefined') return;

    const updatedProfile = {
      ...state.profile,
      ...updates,
      lastLoginAt: Date.now(),
      // Ensure preferences and stats are properly merged
      preferences: {
        ...state.profile.preferences,
        ...updates.preferences,
      },
      stats: {
        ...state.profile.stats,
        ...updates.stats,
      },
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
    setState(prev => ({ ...prev, profile: updatedProfile }));
  }, [mounted, state.profile]);

  const logout = useCallback(() => {
    if (!mounted || typeof window === 'undefined') return;
    
    // Remove unitname from registry if profile exists
    if (state.profile) {
      const registry = getUnitnamesRegistry();
      delete registry[state.profile.unitname.toLowerCase()];
      setUnitnamesRegistry(registry);
    }

    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SIGNATURE_KEY);
    setState({
      profile: null,
      isLoading: false,
      error: null,
    });
    disconnect();
  }, [mounted, disconnect, state.profile]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Return default values during SSR or when not mounted
  if (!mounted) {
    return {
      profile: null,
      isLoading: false,
      error: null,
      isWalletConnected: false,
      walletAddress: undefined,
      createUnitProfile: async () => {},
      updateUnitProfile: async () => {},
      checkUnitnameAvailability: async () => false,
      logout: () => {},
      clearError: () => {},
    };
  }

  return {
    ...state,
    isWalletConnected: isConnected,
    walletAddress: address,
    createUnitProfile,
    updateUnitProfile,
    checkUnitnameAvailability,
    logout,
    clearError,
  };
}; 