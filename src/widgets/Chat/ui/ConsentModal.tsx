'use client'
import React from 'react';
import styles from './ConsentModal.module.scss';
import { Logo } from '@/shared/ui/Logo/Logo';

interface ConsentModalProps {
    isOpen: boolean;
    onAccept: () => void;
    onDecline: () => void;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({ isOpen, onAccept, onDecline }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <Logo />
                    <h3>Gybernaty AI Assistant</h3>
                </div>
                
                <div className={styles.content}>
                    <p>
                        Welcome to <strong>Gybernaty AI</strong> - your intelligent assistant for 
                        blockchain, Web3, and decentralized technologies.
                    </p>
                    
                    <div className={styles.features}>
                        <div className={styles.feature}>
                            <span className={styles.icon}>🔒</span>
                            <span>Secure & Private</span>
                        </div>
                        <div className={styles.feature}>
                            <span className={styles.icon}>🆓</span>
                            <span>Completely Free</span>
                        </div>
                        <div className={styles.feature}>
                            <span className={styles.icon}>🧠</span>
                            <span>Advanced AI Technology</span>
                        </div>
                        <div className={styles.feature}>
                            <span className={styles.icon}>🌐</span>
                            <span>Web3 & Blockchain Expert</span>
                        </div>
                    </div>
                    
                    <p className={styles.disclaimer}>
                        By using Gybernaty AI, you agree to our{' '}
                        <a 
                            href="#" 
                            onClick={(e) => e.preventDefault()}
                            className={styles.link}
                        >
                            Terms of Service
                        </a>{' '}
                        and{' '}
                        <a 
                            href="#" 
                            onClick={(e) => e.preventDefault()}
                            className={styles.link}
                        >
                            Privacy Policy
                        </a>.
                        <br />
                        <span className={styles.technicalNote}>
                            Powered by advanced AI infrastructure.
                        </span>
                    </p>
                </div>
                
                <div className={styles.actions}>
                    <button 
                        className={styles.declineButton}
                        onClick={onDecline}
                    >
                        Cancel
                    </button>
                    <button 
                        className={styles.acceptButton}
                        onClick={onAccept}
                    >
                        Start Chatting with AI
                    </button>
                </div>
            </div>
        </div>
    );
}; 