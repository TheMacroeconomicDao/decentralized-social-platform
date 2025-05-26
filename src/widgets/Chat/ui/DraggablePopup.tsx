'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './DraggablePopup.module.scss';

interface DraggablePopupProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

interface Position {
    x: number;
    y: number;
}

// Убираю Size и ResizeDirection - только позиция
interface PopupState {
    position: Position;
}

// добавим длительность анимации закрытия
const TRANSITION_MS = 250; // должен совпадать с transition в SCSS

export const DraggablePopup: React.FC<DraggablePopupProps> = ({
    isOpen,
    onClose,
    children,
}) => {
    const popupRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    
    // Упрощенное состояние - только позиция
    const [popupState, setPopupState] = useState<PopupState>(() => {
        const centerX = typeof window !== 'undefined' ? Math.max(0, (window.innerWidth - 420) / 2) : 100;
        const centerY = typeof window !== 'undefined' ? Math.max(50, (window.innerHeight - 650) / 2) : 100;
        
        return {
            position: { x: centerX, y: centerY }
        };
    });
    
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [initialState, setInitialState] = useState<PopupState>({
        position: { x: 0, y: 0 }
    });

    // Фиксированные размеры чата
    const CHAT_WIDTH = 420;
    const CHAT_HEIGHT = 650;

    // Состояния управления анимацией появления/скрытия
    const [renderPopup, setRenderPopup] = useState(isOpen);
    const [animationClass, setAnimationClass] = useState<string>('');

    // Оптимизированная проверка мобильного устройства
    const checkMobile = useCallback(() => {
        setIsMobile(window.innerWidth < 768);
    }, []);

    useEffect(() => {
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [checkMobile]);

    // Центрирование только при изменении размера окна
    useEffect(() => {
        if (!isMobile) {
            const handleResize = () => {
                const centerX = Math.max(0, (window.innerWidth - CHAT_WIDTH) / 2);
                const centerY = Math.max(50, (window.innerHeight - CHAT_HEIGHT) / 2);
                
                setPopupState({
                    position: { x: centerX, y: centerY }
                });
            };
            
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [isMobile]);

    // Обработка начала перетаскивания
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (isMobile) return;
        
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
        setInitialState(popupState);
        
        e.preventDefault();
    }, [isMobile, popupState]);

    // Упрощенная логика движения мыши - только драг
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isMobile || !isDragging) return;

        requestAnimationFrame(() => {
            const deltaX = e.clientX - dragStart.x;
            const deltaY = e.clientY - dragStart.y;

            const newX = Math.max(0, Math.min(window.innerWidth - CHAT_WIDTH, initialState.position.x + deltaX));
            const newY = Math.max(0, Math.min(window.innerHeight - CHAT_HEIGHT, initialState.position.y + deltaY));
            
            setPopupState({
                position: { x: newX, y: newY }
            });
        });
    }, [isMobile, isDragging, dragStart, initialState]);

    // Завершение операций
    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Оптимизированный useEffect с правильными зависимостями
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    // Обработка overlay клика
    const handleOverlayClick = useCallback((e: React.MouseEvent) => {
        if (isMobile && e.target === e.currentTarget) {
            onClose();
        }
    }, [isMobile, onClose]);

    // Управление отображением с анимацией
    useEffect(() => {
        if (isOpen) {
            setRenderPopup(true);
            // старт анимации появления
            setAnimationClass(styles.popupEnter);
            // переключаем во второй кадр, чтобы сработал transition
            requestAnimationFrame(() => {
                setAnimationClass(`${styles.popupEnter} ${styles.popupEnterActive}`);
            });
        } else if (renderPopup) {
            // старт анимации скрытия
            setAnimationClass(`${styles.popupExit}`);
            requestAnimationFrame(() => {
                setAnimationClass(`${styles.popupExit} ${styles.popupExitActive}`);
            });
            const timer = setTimeout(() => {
                setRenderPopup(false);
                setAnimationClass('');
            }, TRANSITION_MS);
            return () => clearTimeout(timer);
        }
    }, [isOpen, renderPopup]);

    if (!renderPopup) return null;

    const popupStyle = isMobile ? {} : {
        transform: `translate(${popupState.position.x}px, ${popupState.position.y}px)`,
        width: `${CHAT_WIDTH}px`,
        height: `${CHAT_HEIGHT}px`,
        cursor: isDragging ? 'grabbing' : 'default'
    };

    return (
        <div 
            className={`${styles.overlay} ${isMobile ? styles.mobile : styles.desktop}`}
            onClick={handleOverlayClick}
        >
            <div
                ref={popupRef}
                className={`${styles.popup} ${isMobile ? styles.mobilePopup : styles.desktopPopup} ${animationClass}`}
                style={popupStyle}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Drag handle для перетаскивания */}
                <div 
                    ref={headerRef}
                    className={styles.dragHandle}
                    onMouseDown={handleMouseDown}
                    style={{ cursor: isMobile ? 'default' : (isDragging ? 'grabbing' : 'grab') }}
                />
                
                {/* Передаем isMobile в children через React.cloneElement */}
                {React.isValidElement(children) 
                    ? React.cloneElement(children, { isMobile } as any)
                    : children
                }
            </div>
        </div>
    );
}; 