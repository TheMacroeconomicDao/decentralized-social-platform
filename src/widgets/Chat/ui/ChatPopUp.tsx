'use client'
import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatPopup.module.scss';
import SendIcon from '@/shared/ui/SvgIcons/SendIcon/Send';
import { PopupWrapper } from '@/shared/ui/PopupWrapper/PopupWrapper';
import { Logo } from '@/shared/ui/Logo/Logo';
import { MarkdownRenderer } from '@/shared/ui/MarkdownRenderer';
import { useChatPopup } from '../model/useChatPopUp';
import { ConsentModal } from './ConsentModal';

interface ChatProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ChatPopup: React.FC<ChatProps> = ({ isOpen, onClose }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    const { 
        messages, 
        addMessage, 
        clearMessages,
        retryLastMessage,
        handleConsent,
        resetConsent,
        isLoading, 
        error,
        needsConsent
    } = useChatPopup('User');

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [newMessage]);

    const handleSubmit = async () => {
        if (!newMessage.trim() || isLoading) return;
        
        const messageToSend = newMessage.trim();
        setNewMessage('');
        await addMessage(messageToSend);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    const handleConsentAccept = () => {
        handleConsent(true);
    };

    const handleConsentDecline = () => {
        handleConsent(false);
    };

    return (
        <>
            {/* Consent Modal */}
            <ConsentModal 
                isOpen={needsConsent}
                onAccept={handleConsentAccept}
                onDecline={handleConsentDecline}
            />

            {/* Main Chat Popup */}
            <PopupWrapper isOpen={isOpen} onClose={onClose}>
                <div className={styles.chatPopup}>
                    {/* Header */}
                    <div className={styles.header}>
                        <div className={styles.headerLeft}>
                            <Logo />
                            <div className={styles.headerInfo}>
                                <span className={styles.botName}>Gybernaty AI</span>
                                <span className={styles.status}>
                                    {isLoading ? 'Thinking...' : needsConsent ? 'Consent Required' : 'Online'}
                                </span>
                            </div>
                        </div>
                        <div className={styles.headerActions}>
                            <button 
                                className={styles.clearButton}
                                onClick={clearMessages}
                                title="Clear chat"
                                disabled={needsConsent}
                            >
                                🗑️
                            </button>
                            {/* Debug button for testing consent (remove in production) */}
                            {process.env.NODE_ENV === 'development' && (
                                <button 
                                    className={styles.clearButton}
                                    onClick={resetConsent}
                                    title="Reset consent (dev only)"
                                >
                                    🔄
                                </button>
                            )}
                            <button 
                                className={styles.closeButton}
                                onClick={onClose}
                                title="Close chat"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className={styles.messages}>
                        {needsConsent ? (
                            <div className={styles.consentRequired}>
                                <div className={styles.consentIcon}>🔒</div>
                                <h3>AI Assistant Consent Required</h3>
                                <p>
                                    To use Gybernaty AI assistant, you need to accept our terms of service 
                                    for AI-powered chat functionality.
                                </p>
                                <button 
                                    className={styles.consentButton}
                                    onClick={() => handleConsent(true)}
                                >
                                    Accept Terms & Start Chatting
                                </button>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className={styles.welcomeMessage}>
                                <Logo />
                                <h3>Welcome to Gybernaty AI!</h3>
                                <p>I'm your AI assistant specializing in blockchain, Web3, and decentralized technologies. How can I help you today?</p>
                            </div>
                        ) : (
                            messages.map((msg, idx) => {
                                const isUser = msg.author === 'User';
                                return (
                                    <div 
                                        key={`${msg.timestamp}-${idx}`} 
                                        className={`${styles.messageItem} ${isUser ? styles.user : styles.assistant}`}
                                    >
                                        {!isUser && (
                                            <div className={styles.avatar}>
                                                <Logo />
                                            </div>
                                        )}
                                        <div className={styles.messageContent}>
                                            <div className={styles.bubble}>
                                                {isUser ? (
                                                    msg.text
                                                ) : (
                                                    <MarkdownRenderer>{msg.text}</MarkdownRenderer>
                                                )}
                                            </div>
                                            <span className={styles.time}>
                                                {formatTime(msg.timestamp)}
                                            </span>
                                        </div>
                                        {isUser && (
                                            <div className={styles.userAvatar}>
                                                👤
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}

                        {/* Loading indicator */}
                        {isLoading && !needsConsent && (
                            <div className={`${styles.messageItem} ${styles.assistant}`}>
                                <div className={styles.avatar}>
                                    <Logo />
                                </div>
                                <div className={styles.messageContent}>
                                    <div className={styles.loadingBubble}>
                                        <div className={styles.typingIndicator}>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error message */}
                        {error && (
                            <div className={styles.errorMessage}>
                                <span>⚠️ {error}</span>
                                {!needsConsent && (
                                    <button 
                                        className={styles.retryButton}
                                        onClick={retryLastMessage}
                                    >
                                        Retry
                                    </button>
                                )}
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className={styles.inputArea}>
                        <textarea
                            ref={textareaRef}
                            className={styles.input}
                            placeholder={needsConsent ? "Accept terms to start chatting..." : "Ask Gybernaty AI anything..."}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading || needsConsent}
                            rows={1}
                            maxLength={4000}
                        />
                        <button 
                            className={styles.sendButton} 
                            onClick={handleSubmit}
                            disabled={!newMessage.trim() || isLoading || needsConsent}
                            title={needsConsent ? "Accept terms first" : "Send message (Enter)"}
                        >
                            {isLoading ? (
                                <div className={styles.loadingSpinner} />
                            ) : (
                                <SendIcon />
                            )}
                        </button>
                    </div>

                    {/* Character counter */}
                    <div className={styles.charCounter}>
                        {newMessage.length}/4000
                        {needsConsent && (
                            <span className={styles.consentWarning}> • Consent required</span>
                        )}
                    </div>
                </div>
            </PopupWrapper>
        </>
    );
};
