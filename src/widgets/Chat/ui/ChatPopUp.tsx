'use client'
import React, { useState } from 'react';
import styles from './ChatPopup.module.scss';
import SendIcon from '@/shared/ui/SvgIcons/SendIcon/Send'; // Assume you have SVG or use inline icon
import BackIcon from '@/shared/ui/SvgIcons/BackIcon/Back';
import { PopupWrapper } from '@/shared/ui/PopupWrapper/PopupWrapper';
import { Logo } from '@/shared/ui/Logo/Logo';
interface ChatProps {
    isOpen: boolean;
    onClose: () => void;
}
export const ChatPopup: React.FC<ChatProps> = (props: ChatProps) => {
    const { isOpen, onClose } = props;
    const [newComment, setNewComment] = useState('');
    const [messages, setMessages] = useState<any[]>([]); // Replace with actual type
    const user = { username: 'me', avatar: '/me.png' }; // Mock
    const friend = { username: 'friend', avatar: '/friend.png' };

    const handleCommentSubmit = () => {

        if (!newComment.trim()) return;
        setMessages([...messages, { author: user.username, text: newComment, timestamp: Date.now() }]);
        setNewComment('');
    };

    return (
        <PopupWrapper isOpen onClose={onClose}>

            <div className={styles.chatPopup}>
                <div className={styles.header}>
                    <button className={styles.backButton}>
                        <Logo />
                    </button>
                    <span>Philosophos</span>
                </div>

                <div className={styles.messages}>
                    {messages.map((msg, idx) => {
                        const isUser = msg.author === user.username;
                        const avatar = isUser ? user.avatar : friend.avatar;
                        return (
                            <div key={idx} className={`${styles.messageItem} ${isUser ? styles.user : styles.friend}`}>
                                {!isUser && <Logo />}
                                <div className={styles.bubble}>{msg.text}</div>
                                <span className={styles.time}>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                            </div>
                        );
                    })}
                </div>

                <div className={styles.inputArea}>
                    <textarea
                        id={"chat_send_form"}
                        className={styles.input}
                        placeholder="Write a message..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={1}
                    />
                    <button className={styles.sendButton} onClick={handleCommentSubmit}>
                        <SendIcon />
                    </button>
                </div>
            </div>
        </PopupWrapper >
    );
};
