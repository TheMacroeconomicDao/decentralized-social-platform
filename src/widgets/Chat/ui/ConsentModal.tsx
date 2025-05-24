'use client'
import React from 'react';
import styles from './ConsentModal.module.scss';
import { Logo } from '@/shared/ui/Logo/Logo';

interface WelcomeModalProps {
    isOpen: boolean;
    onStart: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onStart }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <Logo />
                    <h3>Добро пожаловать в Gybernaty AI!</h3>
                </div>
                
                <div className={styles.content}>
                    <p className={styles.intro}>
                        Я — ваш интеллектуальный помощник от прогрессивного сообщества 
                        исследователей и разработчиков <strong>Gybernaty</strong>.
                    </p>
                    
                    <div className={styles.features}>
                        <div className={styles.feature}>
                            <span className={styles.icon}>🌐</span>
                            <span>Web3 & Blockchain эксперт</span>
                        </div>
                        <div className={styles.feature}>
                            <span className={styles.icon}>🔗</span>
                            <span>Децентрализованные технологии</span>
                        </div>
                        <div className={styles.feature}>
                            <span className={styles.icon}>🚀</span>
                            <span>Rocket-Science проекты</span>
                        </div>
                        <div className={styles.feature}>
                            <span className={styles.icon}>💎</span>
                            <span>Open Source экосистема</span>
                        </div>
                    </div>

                    <div className={styles.projectsList}>
                        <p className={styles.projectsTitle}>Наши основные проекты:</p>
                        <ul className={styles.projects}>
                            <li><strong>DSP</strong> — децентрализованная социальная платформа</li>
                            <li><strong>LQD</strong> — AI-менеджер криптопортфеля</li>
                            <li><strong>SAPP</strong> — безопасный децентрализованный мессенджер</li>
                            <li><strong>PowerSwapMeta</strong> — метавселенная с реальными активами</li>
                        </ul>
                    </div>
                    
                    <p className={styles.mission}>
                        <strong>Миссия:</strong> Реализация мощной open source экосистемы для 
                        открытого образования и прогрессивных исследований.
                    </p>

                    <div className={styles.links}>
                        <a href="https://t.me/HeadsHub" target="_blank" rel="noopener noreferrer">
                            📱 Telegram Community
                        </a>
                        <a href="https://github.com/GyberExperiment" target="_blank" rel="noopener noreferrer">
                            💻 GitHub
                        </a>
                    </div>
                </div>
                
                <div className={styles.actions}>
                    <button 
                        className={styles.startButton}
                        onClick={onStart}
                    >
                        🚀 Начать общение с Gybernaty AI
                    </button>
                </div>
            </div>
        </div>
    );
}; 