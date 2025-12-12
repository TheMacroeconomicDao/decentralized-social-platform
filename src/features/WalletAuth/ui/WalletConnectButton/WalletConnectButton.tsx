'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button, ThemeButton } from '@/shared/ui/Button/Button';
import cls from './WalletConnectButton.module.scss';
import { classNames } from '@/shared/lib/classNames/classNames';

interface WalletConnectButtonProps {
  className?: string;
  theme?: ThemeButton;
}

export const WalletConnectButton = ({ className, theme = ThemeButton.ORANGE }: WalletConnectButtonProps) => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div
            className={classNames(cls.WalletConnectButton, {}, [className || ''])}
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    theme={theme}
                    className={cls.connectButton}
                  >
                    🔗 Connect Wallet
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    theme={ThemeButton.FIRE}
                    className={cls.errorButton}
                  >
                    ⚠️ Wrong Network
                  </Button>
                );
              }

              return (
                <div className={cls.connectedState}>
                  <Button
                    onClick={openChainModal}
                    theme={ThemeButton.CLEAR}
                    className={cls.chainButton}
                  >
                    {chain.hasIcon && (
                      <div className={cls.chainIcon}>
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            width={16}
                            height={16}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </Button>

                  <Button
                    onClick={openAccountModal}
                    theme={theme}
                    className={cls.accountButton}
                  >
                    <div className={cls.accountInfo}>
                      <span className={cls.accountName}>
                        {account.displayName}
                      </span>
                      <span className={cls.accountBalance}>
                        {account.displayBalance
                          ? ` (${account.displayBalance})`
                          : ''}
                      </span>
                    </div>
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}; 