'use client';

import { useEffect } from 'react';
import styles from './error.module.scss';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className={styles.error}>
      <h2 className={styles.title}>Something went wrong</h2>
      <p className={styles.message}>{error.message || 'An unexpected error occurred'}</p>
      <button className={styles.button} onClick={reset}>
        Try again
      </button>
    </div>
  );
}
