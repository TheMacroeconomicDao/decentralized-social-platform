'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import type { DUNACLA, CLARecord } from '@/shared/types/unit-profile';

const CLA_STORAGE_KEY = 'dsp_duna_cla_v1';
const CLA_VERSION = '1.0';

/**
 * Builds the legally meaningful CLA acceptance message per DUNA-CLA v1.0.
 *
 * This message constitutes an electronic signature under:
 *   - ESIGN Act (15 USC § 7001)
 *   - Wyoming UETA (W.S. § 34-12-1 et seq.)
 *
 * It expressly covers all required IP transfer conditions:
 *   1. Copyright Assignment (DUNA-CLA § 2) — irrevocable, perpetual
 *   2. Patent License (DUNA-CLA § 3) — perpetual, royalty-free
 *   3. Moral Rights Waiver (DUNA-CLA § 5) — full waiver + non-assertion
 *   4. Representations & Warranties (DUNA-CLA § 4) — originality, authority
 *   5. Governing Law (DUNA-CLA § 11) — Wyoming, DUNA Act
 */
export const buildCLAMessage = (
  address: string,
  timestamp: number,
  githubUsername?: string,
): string => `GYBERNATY DUNA CONTRIBUTOR LICENSE AGREEMENT
Version: ${CLA_VERSION}
Effective Date: ${new Date(timestamp).toISOString()}

By signing this message with my wallet, I, the undersigned Contributor,
hereby agree to and accept the following terms of the Gybernaty DUNA
Contributor License Agreement (DUNA-CLA) version ${CLA_VERSION}:

1. COPYRIGHT ASSIGNMENT (DUNA-CLA § 2)
   I irrevocably assign to Gybernaty DUNA all right, title, and interest
   worldwide in and to any Contribution I make, including all copyrights,
   neighboring rights, and all other intellectual property rights of any kind.
   This assignment is perpetual, exclusive, and irrevocable.

2. PATENT LICENSE (DUNA-CLA § 3)
   I grant to Gybernaty DUNA a perpetual, irrevocable, worldwide,
   non-exclusive, royalty-free patent license under any patents I own
   or control that are necessarily infringed by my Contributions,
   including the right to sublicense.

3. MORAL RIGHTS WAIVER (DUNA-CLA § 5)
   To the fullest extent permitted by applicable law, I waive all moral
   rights in my Contributions, including rights of attribution, integrity,
   disclosure, and withdrawal, and I covenant not to assert these rights
   against Gybernaty DUNA or any downstream recipients.

4. REPRESENTATIONS AND WARRANTIES (DUNA-CLA § 4)
   I represent and warrant that: (a) each Contribution is my original work;
   (b) I have the legal right and authority to grant the rights herein;
   (c) my Contributions do not infringe any third-party rights;
   (d) I am not aware of any prior obligations conflicting with this Agreement.

5. GOVERNING LAW (DUNA-CLA § 11)
   This Agreement is governed by the laws of the State of Wyoming, United
   States, and the Wyoming Decentralized Unincorporated Nonprofit Association
   Act (W.S. § 17-22), without regard to conflict of law principles.

This electronic signature has the same legal effect as a handwritten
signature pursuant to the ESIGN Act (15 USC § 7001) and Wyoming UETA.

Contributor Wallet Address: ${address}
GitHub Username: ${githubUsername ?? 'Not provided'}
Timestamp (UTC): ${new Date(timestamp).toISOString()}
Agreement Version: ${CLA_VERSION}
Jurisdiction: Wyoming, United States`;

// ─────────────────────────────────────────────────────────────────────────────

interface UseDUNACLAReturn {
  claAccepted: DUNACLA | null;
  isCLARequired: boolean;
  isCLALoading: boolean;
  claError: string | null;
  acceptCLA: (githubUsername?: string) => Promise<void>;
  checkCLAStatus: () => { hasAccepted: boolean; version: string | null; acceptedAt: number | null };
  resetCLA: () => void;
}

export const useDUNACLA = (): UseDUNACLAReturn => {
  const [claAccepted, setCLAAccepted] = useState<DUNACLA | null>(null);
  const [isCLALoading, setIsCLALoading] = useState(false);
  const [claError, setCLAError] = useState<string | null>(null);
  const [isCLARequired, setIsCLARequired] = useState(false);

  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  // Load CLA status from localStorage on mount / address change
  useEffect(() => {
    if (!address || !isConnected) {
      setCLAAccepted(null);
      setIsCLARequired(false);
      return;
    }

    if (typeof window === 'undefined') return;

    try {
      const raw = localStorage.getItem(CLA_STORAGE_KEY);
      if (!raw) {
        setCLAAccepted(null);
        setIsCLARequired(true);
        return;
      }

      const record: CLARecord = JSON.parse(raw);

      if (record.address === address) {
        setCLAAccepted(record.cla);
        setIsCLARequired(false);
      } else {
        // CLA belongs to a different wallet
        setCLAAccepted(null);
        setIsCLARequired(true);
      }
    } catch {
      localStorage.removeItem(CLA_STORAGE_KEY);
      setCLAAccepted(null);
      setIsCLARequired(true);
    }
  }, [address, isConnected]);

  /**
   * Accept the DUNA-CLA.
   * Constructs the legally-binding message, requests an EIP-191 wallet
   * signature, and persists the CLARecord to localStorage.
   */
  const acceptCLA = useCallback(async (githubUsername?: string): Promise<void> => {
    if (!address || !isConnected) {
      setCLAError('Wallet not connected. Please connect your wallet first.');
      return;
    }

    setIsCLALoading(true);
    setCLAError(null);

    try {
      const timestamp = Date.now();
      const message = buildCLAMessage(address, timestamp, githubUsername?.trim() || undefined);

      const signature = await signMessageAsync({ message });

      const cla: DUNACLA = {
        version: CLA_VERSION,
        acceptedAt: timestamp,
        signature,
        githubUsername: githubUsername?.trim() || undefined,
        claType: 'electronic',
      };

      const record: CLARecord = {
        cla,
        message,
        address,
        timestamp,
      };

      localStorage.setItem(CLA_STORAGE_KEY, JSON.stringify(record));
      setCLAAccepted(cla);
      setIsCLARequired(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to accept CLA. Please try again.';
      // User rejected the signature request — give a friendlier message
      if (message.includes('User rejected') || message.includes('user rejected')) {
        setCLAError('Signature request was rejected. Please sign the message to accept the CLA.');
      } else {
        setCLAError(message);
      }
    } finally {
      setIsCLALoading(false);
    }
  }, [address, isConnected, signMessageAsync]);

  /** Returns current CLA status without triggering re-renders. */
  const checkCLAStatus = useCallback((): {
    hasAccepted: boolean;
    version: string | null;
    acceptedAt: number | null;
  } => {
    if (typeof window === 'undefined') {
      return { hasAccepted: false, version: null, acceptedAt: null };
    }
    try {
      const raw = localStorage.getItem(CLA_STORAGE_KEY);
      if (!raw) return { hasAccepted: false, version: null, acceptedAt: null };
      const record: CLARecord = JSON.parse(raw);
      return {
        hasAccepted: true,
        version: record.cla.version,
        acceptedAt: record.cla.acceptedAt,
      };
    } catch {
      return { hasAccepted: false, version: null, acceptedAt: null };
    }
  }, []);

  /** Remove CLA acceptance (for testing / wallet change). */
  const resetCLA = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CLA_STORAGE_KEY);
    }
    setCLAAccepted(null);
    setIsCLARequired(true);
    setCLAError(null);
  }, []);

  return {
    claAccepted,
    isCLARequired,
    isCLALoading,
    claError,
    acceptCLA,
    checkCLAStatus,
    resetCLA,
  };
};
