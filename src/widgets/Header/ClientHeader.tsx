'use client';

import { useEffect, useState } from 'react';
import { HeaderEnhanced } from './Header-Enhanced';
import cls from './Header-Enhanced.module.scss';

export const ClientHeader = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a responsive placeholder header during SSR
    return (
      <div className={cls.Header}>
        <div>
          <span style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', fontWeight: '600' }}>
            Gyber
          </span>
        </div>
        <div className={cls.btnGroup}>
          <button 
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: 'rgba(66, 184, 243, 0.1)',
              color: '#42b8f3',
              fontSize: 'clamp(0.875rem, 2vw, 1rem)',
              minWidth: '80px',
              maxWidth: '135px',
              cursor: 'not-allowed',
              opacity: 0.7
            }}
            disabled
          >
            Loading...
          </button>
        </div>
      </div>
    );
  }

  return <HeaderEnhanced />;
}; 