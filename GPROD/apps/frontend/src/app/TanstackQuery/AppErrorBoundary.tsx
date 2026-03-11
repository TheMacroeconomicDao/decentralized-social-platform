import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { type FC, type ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import TokenExpiredError from '../Error/classes/TokenExpiredError';
import useTokenExpiredHandler from './hooks/useTokenExpiredHandler';

type AppErrorBoundaryProps = {
  children?: ReactNode;
};

const AppErrorBoundary: FC<AppErrorBoundaryProps> = ({ children }) => {
  const { tokenExpiredHandler } = useTokenExpiredHandler();

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary, error }) => {
            const isTokenExpiredError = error instanceof TokenExpiredError;

            return (
              <>
                {isTokenExpiredError ? (
                  <div>
                    Вы не авторизованы.
                    <button
                      onClick={() => {
                        resetErrorBoundary();
                        tokenExpiredHandler();
                      }}
                    >
                      Ок
                    </button>
                  </div>
                ) : (
                  <div>
                    Unknown server error! Tray again later.
                    <button onClick={() => resetErrorBoundary()}>Try again</button>
                  </div>
                )}
              </>
            );
          }}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

export default AppErrorBoundary;
