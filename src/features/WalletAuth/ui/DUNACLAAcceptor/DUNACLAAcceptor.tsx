'use client';

import React, { useState } from 'react';
import { useDUNACLA } from '@/shared/hooks/useDUNACLA';
import { Button, ThemeButton } from '@/shared/ui/Button/Button';
import cls from './DUNACLAAcceptor.module.scss';

interface DUNACLAAcceptorProps {
  onSuccess?: () => void;
  className?: string;
}

/** Full legal text sections, matched to DUNA-CLA v1.0 */
const CLA_SUMMARY_ITEMS = [
  {
    icon: '©',
    title: 'Copyright Assignment',
    section: '§ 2',
    description:
      'You irrevocably assign all copyright in your Contributions to Gybernaty DUNA. ' +
      'This assignment is perpetual, exclusive, and worldwide.',
  },
  {
    icon: '⚗',
    title: 'Patent License',
    section: '§ 3',
    description:
      'You grant a perpetual, royalty-free, worldwide patent license covering any patents ' +
      'you own that are necessarily infringed by your Contributions, including sublicense rights.',
  },
  {
    icon: '∅',
    title: 'Moral Rights Waiver',
    section: '§ 5',
    description:
      'To the fullest extent permitted by law, you waive all moral rights ' +
      '(attribution, integrity, disclosure, withdrawal) and covenant not to assert them.',
  },
  {
    icon: '✓',
    title: 'Representations & Warranties',
    section: '§ 4',
    description:
      'You represent that each Contribution is your original work, you have authority ' +
      'to grant these rights, and the Contribution does not infringe third-party rights.',
  },
  {
    icon: '⚖',
    title: 'Open-Source Licensing Authority',
    section: '§ 7',
    description:
      'DUNA may license your Contributions under any OSI-approved license ' +
      '(MIT, Apache 2.0, GPL, etc.) via on-chain governance.',
  },
  {
    icon: '🔒',
    title: 'Anonymity Protection',
    section: '§ 8',
    description:
      'You may contribute under a pseudonym (GitHub username or wallet address). ' +
      'Legal name is only required for contributions valued over $600.',
  },
  {
    icon: '🏛',
    title: 'Governing Law',
    section: '§ 11',
    description:
      'This Agreement is governed by Wyoming law and the Wyoming Decentralized ' +
      'Unincorporated Nonprofit Association Act (W.S. § 17-22).',
  },
  {
    icon: '♾',
    title: 'Perpetual & Irrevocable',
    section: '§ 10',
    description:
      'Once accepted, the agreement is permanent. All rights granted survive your departure ' +
      'from the community and any future changes to the DUNA.',
  },
] as const;

export const DUNACLAAcceptor: React.FC<DUNACLAAcceptorProps> = ({ onSuccess, className }) => {
  const { isCLALoading, claError, acceptCLA } = useDUNACLA();

  const [githubUsername, setGithubUsername] = useState('');
  const [hasRead, setHasRead] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleAccept = async () => {
    setLocalError(null);

    if (!hasRead) {
      setLocalError('Please confirm that you have read and understood the DUNA-CLA.');
      return;
    }

    await acceptCLA(githubUsername.trim() || undefined);

    // acceptCLA sets claError internally; if no error, fire onSuccess
    if (!claError) {
      onSuccess?.();
    }
  };

  const displayError = localError || claError;
  const isDisabled = isCLALoading || !hasRead;

  return (
    <div className={`${cls.container} ${className ?? ''}`} role="dialog" aria-modal="true" aria-labelledby="cla-title">
      {/* ── Header ── */}
      <div className={cls.header}>
        <h2 id="cla-title" className={cls.title}>
          Contributor License Agreement
        </h2>
        <p className={cls.subtitle}>
          DUNA-CLA v1.0 — Required to contribute to Gybernaty DUNA
        </p>
        <p className={cls.legalBasis}>
          Electronic acceptance under{' '}
          <abbr title="Electronic Signatures in Global and National Commerce Act">ESIGN Act</abbr>
          {' '}(15 USC § 7001) &amp; Wyoming UETA
        </p>
      </div>

      {/* ── CLA Summary ── */}
      <section className={cls.claSection} aria-label="Agreement summary">
        <h3 className={cls.sectionTitle}>What you are agreeing to:</h3>
        <ul className={cls.summaryList}>
          {CLA_SUMMARY_ITEMS.map((item) => (
            <li key={item.section} className={cls.summaryItem}>
              <span className={cls.itemIcon} aria-hidden="true">{item.icon}</span>
              <div className={cls.itemContent}>
                <strong className={cls.itemTitle}>
                  {item.title}{' '}
                  <span className={cls.itemSection}>{item.section}</span>
                </strong>
                <p className={cls.itemDescription}>{item.description}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Full legal text toggle */}
        <button
          type="button"
          className={cls.toggleButton}
          onClick={() => setShowFullText((v) => !v)}
          aria-expanded={showFullText}
        >
          {showFullText ? '▲ Hide full legal text' : '▼ View full legal text (DUNA-CLA v1.0)'}
        </button>

        {showFullText && (
          <div className={cls.fullText} aria-live="polite">
            <p className={cls.fullTextIntro}>
              The following is a summary of the complete DUNA-CLA v1.0.
              The full document is available at{' '}
              <code>legal/03-IP-ASSIGNMENT/templates/DUNA-CLA-v1.0.md</code>.
            </p>

            <h4>§ 1 — Definitions</h4>
            <p>
              <strong>Contribution:</strong> any original work submitted to Gybernaty DUNA,
              including code, documentation, designs, algorithms, and feedback.{' '}
              <strong>DUNA:</strong> Gybernaty DAO DUNA, a Wyoming Decentralized Unincorporated
              Nonprofit Association (W.S. § 17-22).{' '}
              <strong>GBR Token:</strong> BEP-20 governance token
              (0xa970cae9fa1d7cca913b7c19df45bf33d55384a9).
            </p>

            <h4>§ 2 — Copyright Assignment</h4>
            <p>
              Contributor irrevocably assigns all right, title, and interest worldwide,
              including all copyrights, moral rights, and other IP rights. Each Contribution
              is deemed a "work made for hire" to the fullest extent permitted by law.
              Contributor agrees to execute any additional documents to perfect DUNA's rights.
            </p>

            <h4>§ 3 — Patent License</h4>
            <p>
              Perpetual, irrevocable, worldwide, non-exclusive, royalty-free patent license
              covering patents necessarily infringed by the Contribution alone or in combination
              with existing DUNA work. Includes sublicense rights. Terminates if Contributor
              initiates patent litigation against DUNA.
            </p>

            <h4>§ 4 — Representations & Warranties</h4>
            <p>
              Contributor warrants: (a) originality; (b) authority to grant rights;
              (c) no third-party infringement; (d) no prior conflicting obligations.
              Contributor will promptly disclose any known third-party rights.
            </p>

            <h4>§ 5 — Moral Rights Waiver</h4>
            <p>
              Full waiver of attribution, integrity, disclosure, and withdrawal rights.
              Non-assertion covenant survives termination and applies to all derivative works.
            </p>

            <h4>§ 6 — Governance & Membership</h4>
            <p>
              DUNA membership is determined solely by holding GBR tokens.
              All IP decisions are made via on-chain governance. No fiduciary duties arise.
            </p>

            <h4>§ 7 — Open-Source Licensing</h4>
            <p>
              DUNA may license Contributions under MIT, Apache 2.0, GPL, or any OSI-approved
              license, including commercial use. Revenue flows to DUNA treasury only;
              no profit distribution to token holders (preserves nonprofit status).
            </p>

            <h4>§ 8 — Anonymity & Pseudonymity</h4>
            <p>
              Pseudonymous participation (GitHub username or wallet address) is permitted.
              Legal name is only required for contributions valued over $600 (IRS 1099 threshold).
              DUNA maintains privacy of personal data in compliance with applicable law.
            </p>

            <h4>§ 9 — Tax Compliance</h4>
            <p>
              Contributions over $600/year may require IRS Form 1099.
              Contributor is solely responsible for personal tax obligations.
            </p>

            <h4>§ 10 — Term</h4>
            <p>
              Perpetual and irrevocable. All rights survive termination of participation
              and any future dissolution of DUNA.
            </p>

            <h4>§ 11 — Governing Law</h4>
            <p>
              Wyoming law. Jurisdiction: Wyoming state or federal courts.
              Disputes under $50,000 resolved by binding AAA arbitration.
              Class action waiver applies.
            </p>

            <h4>§ 12 — Electronic Acceptance</h4>
            <p>
              This wallet signature constitutes a legally binding electronic signature
              under the ESIGN Act (15 USC § 7001) and Wyoming UETA (W.S. § 34-12-1 et seq.).
              DUNA maintains records of all acceptances including timestamp, wallet address,
              and signed message.
            </p>
          </div>
        )}
      </section>

      {/* ── GitHub Username (optional) ── */}
      <div className={cls.githubSection}>
        <label htmlFor="cla-github" className={cls.fieldLabel}>
          GitHub Username{' '}
          <span className={cls.optional}>(optional — for contribution attribution)</span>
        </label>
        <input
          id="cla-github"
          type="text"
          className={cls.textInput}
          placeholder="e.g. yourusername"
          value={githubUsername}
          onChange={(e) => setGithubUsername(e.target.value)}
          disabled={isCLALoading}
          autoComplete="username"
          aria-describedby="cla-github-hint"
        />
        <p id="cla-github-hint" className={cls.fieldHint}>
          Linking your GitHub username enables CLA Assistant to track contributions.
          You may remain anonymous per DUNA-CLA § 8.
        </p>
      </div>

      {/* ── Confirmation Checkbox ── */}
      <div className={cls.confirmation}>
        <label className={cls.checkboxLabel}>
          <input
            type="checkbox"
            className={cls.checkbox}
            checked={hasRead}
            onChange={(e) => {
              setHasRead(e.target.checked);
              if (localError) setLocalError(null);
            }}
            disabled={isCLALoading}
            aria-required="true"
          />
          <span className={cls.checkboxText}>
            I have read and understood the DUNA-CLA v1.0. I agree to irrevocably assign
            all intellectual property rights in my Contributions to Gybernaty DUNA,
            grant the patent license, and waive all moral rights as described above.
            I understand this is a legally binding agreement.
          </span>
        </label>
      </div>

      {/* ── Error ── */}
      {displayError && (
        <div className={cls.errorBox} role="alert">
          <strong>Error: </strong>{displayError}
        </div>
      )}

      {/* ── Actions ── */}
      <div className={cls.actions}>
        <Button
          type="button"
          theme={ThemeButton.ORANGE}
          onClick={handleAccept}
          disabled={isDisabled}
          aria-busy={isCLALoading}
        >
          {isCLALoading ? (
            <>
              <span className={cls.spinner} aria-hidden="true" />
              Signing...
            </>
          ) : (
            'I Agree & Sign DUNA-CLA'
          )}
        </Button>
      </div>

      {/* ── Legal Notice ── */}
      <div className={cls.legalNotice} role="note">
        <p>
          By clicking <strong>"I Agree & Sign DUNA-CLA"</strong>, you provide your
          electronic signature under the ESIGN Act (15 USC § 7001). Your wallet
          signature will be recorded as legally binding evidence of acceptance.
          This agreement is perpetual and irrevocable (DUNA-CLA § 10).
        </p>
      </div>
    </div>
  );
};
