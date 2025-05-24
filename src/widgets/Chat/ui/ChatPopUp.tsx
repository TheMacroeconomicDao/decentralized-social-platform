'use client'
import React, { useRef, useEffect, useState } from 'react';
import styles from './Chatpopup.module.scss';
import { AiIcon, AgentIcon } from "@/shared/ui/SvgIcons";
import { Button, ThemeButton } from "@/shared/ui/Button/Button";
import { SendIcon } from "@/shared/ui/SvgIcons";
import { useChatPopup } from '../model/useChatPopUp';
import { MarkdownRenderer } from '@/shared/ui/MarkdownRenderer/MarkdownRenderer';
import { DraggablePopup } from './DraggablePopup';

interface ChatProps {
    isOpen: boolean;
    onClose: () => void;
    isMobile?: boolean;
}

export const ChatPopup: React.FC<ChatProps> = ({ isOpen, onClose, isMobile = false }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const prevMessagesLengthRef = useRef(0);

    const {
        messages,
        addMessage,
        clearMessages,
        retryLastMessage,
        isLoading,
        error
    } = useChatPopup();

    // Auto-scroll to bottom only when new messages are added (not when cleared)
    useEffect(() => {
        const currentLength = messages.length;
        const prevLength = prevMessagesLengthRef.current;
        
        // Scroll only if messages were added (length increased) or loading
        if (currentLength > prevLength || isLoading) {
            if (messagesContainerRef.current) {
                messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
            }
        }
        
        prevMessagesLengthRef.current = currentLength;
    }, [messages, isLoading]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [newMessage]);

    const handleSubmit = async () => {
        if (newMessage.trim() && !isLoading) {
            await addMessage(newMessage);
            setNewMessage('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <DraggablePopup isOpen={isOpen} onClose={onClose}>
            {/* Индикатор перетаскивания для десктопа */}
            {!isMobile && <div className={styles.dragIndicator} />}
            
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <AiIcon />
                    <div className={styles.headerInfo}>
                        <span className={styles.botName}>Gybernaty AI</span>
                        <span className={styles.status}>
                            {isLoading ? 'Думаю...' : 'Онлайн'}
                        </span>
                    </div>
                </div>
                <div className={styles.headerActions}>
                    <button 
                        className={styles.clearButton}
                        onClick={clearMessages}
                        title="Очистить чат"
                    >
                        🗑️
                    </button>
                    <button 
                        className={styles.closeButton}
                        onClick={onClose}
                        title="Закрыть чат"
                    >
                        ✕
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div ref={messagesContainerRef} className={styles.messages}>
                {messages.length === 0 ? (
                    <div className={styles.welcomeMessage}>
                        <AgentIcon />
                        <h3>Добро пожаловать в Gybernaty AI!</h3>
                        <p>Я ваш AI помощник, специализирующийся на blockchain, Web3 и децентрализованных технологиях. Как я могу помочь вам сегодня?</p>
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
                                        <AgentIcon />
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
                {isLoading && (
                    <div className={`${styles.messageItem} ${styles.assistant}`}>
                        <div className={styles.avatar}>
                            <AgentIcon />
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
                        <button 
                            className={styles.retryButton}
                            onClick={retryLastMessage}
                        >
                            Попробовать снова
                        </button>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className={styles.inputArea}>
                <textarea
                    ref={textareaRef}
                    className={styles.input}
                    placeholder="Спросите у Gybernaty AI что угодно..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    rows={1}
                    maxLength={4000}
                />
                <Button 
                    className={styles.sendButton} 
                    onClick={handleSubmit}
                    disabled={!newMessage.trim() || isLoading}
                    title="Отправить сообщение (Enter)"
                >
                    {isLoading ? (
                        <div className={styles.loadingSpinner} />
                    ) : (
                        <SendIcon />
                    )}
                </Button>
            </div>

            {/* Character counter */}
            <div className={styles.charCounter}>
                {newMessage.length}/4000
            </div>
        </DraggablePopup>
    );
};
