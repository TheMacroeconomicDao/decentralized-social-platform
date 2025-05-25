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

interface Size {
    width: number;
    height: number;
}

// Объединяю position и size в одно состояние для batch updates
interface PopupState {
    position: Position;
    size: Size;
}

type ResizeDirection = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw' | null;

export const DraggablePopup: React.FC<DraggablePopupProps> = ({
    isOpen,
    onClose,
    children,
}) => {
    const popupRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    
    // Объединенное состояние для избежания множественных ре-рендеров
    const [popupState, setPopupState] = useState<PopupState>(() => {
        // Сразу вычисляем центрированную позицию при инициализации
        const defaultWidth = 420;
        const defaultHeight = 650;
        const centerX = typeof window !== 'undefined' ? Math.max(0, (window.innerWidth - defaultWidth) / 2) : 100;
        const centerY = typeof window !== 'undefined' ? Math.max(50, (window.innerHeight - defaultHeight) / 2) : 100;
        
        return {
            position: { x: centerX, y: centerY },
            size: { width: defaultWidth, height: defaultHeight }
        };
    });
    
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeDirection, setResizeDirection] = useState<ResizeDirection>(null);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [initialState, setInitialState] = useState<PopupState>({
        position: { x: 0, y: 0 },
        size: { width: 0, height: 0 }
    });

    const MIN_WIDTH = 320;
    const MAX_WIDTH = 600;
    const MIN_HEIGHT = 400;
    const MAX_HEIGHT = 900;

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
                const centerX = Math.max(0, (window.innerWidth - popupState.size.width) / 2);
                const centerY = Math.max(50, (window.innerHeight - popupState.size.height) / 2);
                
                setPopupState(prev => ({
                    ...prev,
                    position: { x: centerX, y: centerY }
                }));
            };
            
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [isMobile, popupState.size]);

    // Обработка начала перетаскивания
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (isMobile) return;
        
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
        setInitialState(popupState);
        
        e.preventDefault();
    }, [isMobile, popupState]);

    // Обработка начала изменения размера
    const handleResizeStart = useCallback((e: React.MouseEvent, direction: ResizeDirection) => {
        if (isMobile) return;
        
        setIsResizing(true);
        setResizeDirection(direction);
        setDragStart({ x: e.clientX, y: e.clientY });
        setInitialState(popupState);
        
        e.preventDefault();
        e.stopPropagation();
    }, [isMobile, popupState]);

    // Упрощенная и оптимизированная логика движения мыши с requestAnimationFrame
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isMobile) return;

        // Используем requestAnimationFrame для плавности
        requestAnimationFrame(() => {
            const deltaX = e.clientX - dragStart.x;
            const deltaY = e.clientY - dragStart.y;

            if (isDragging) {
                // Простая логика перетаскивания
                const newX = Math.max(0, Math.min(window.innerWidth - popupState.size.width, initialState.position.x + deltaX));
                const newY = Math.max(0, Math.min(window.innerHeight - popupState.size.height, initialState.position.y + deltaY));
                
                setPopupState(prev => ({
                    ...prev,
                    position: { x: newX, y: newY }
                }));
            } else if (isResizing && resizeDirection) {
                // Упрощенная логика resize без сложных пересчетов
                let newWidth = initialState.size.width;
                let newHeight = initialState.size.height;
                let newX = initialState.position.x;
                let newY = initialState.position.y;

                // Простая логика изменения размера
                if (resizeDirection.includes('e')) {
                    newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, initialState.size.width + deltaX));
                }
                if (resizeDirection.includes('w')) {
                    const proposedWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, initialState.size.width - deltaX));
                    const widthDelta = proposedWidth - newWidth;
                    newWidth = proposedWidth;
                    newX = initialState.position.x - widthDelta;
                }
                if (resizeDirection.includes('s')) {
                    newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, initialState.size.height + deltaY));
                }
                if (resizeDirection.includes('n')) {
                    const proposedHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, initialState.size.height - deltaY));
                    const heightDelta = proposedHeight - newHeight;
                    newHeight = proposedHeight;
                    newY = initialState.position.y - heightDelta;
                }

                // Простая проверка границ без сложной логики
                const finalX = Math.max(0, Math.min(window.innerWidth - newWidth, newX));
                const finalY = Math.max(0, Math.min(window.innerHeight - newHeight, newY));

                // Одно обновление состояния вместо двух
                setPopupState({
                    position: { x: finalX, y: finalY },
                    size: { width: newWidth, height: newHeight }
                });
            }
        });
    }, [isMobile, isDragging, isResizing, resizeDirection, dragStart, initialState, popupState.size]);

    // Завершение операций
    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setIsResizing(false);
        setResizeDirection(null);
    }, []);

    // Оптимизированный useEffect с правильными зависимостями
    useEffect(() => {
        if (isDragging || isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

    // Обработка overlay клика
    const handleOverlayClick = useCallback((e: React.MouseEvent) => {
        if (isMobile && e.target === e.currentTarget) {
            onClose();
        }
    }, [isMobile, onClose]);

    if (!isOpen) return null;

    const popupStyle = isMobile ? {} : {
        transform: `translate(${popupState.position.x}px, ${popupState.position.y}px)`,
        width: `${popupState.size.width}px`,
        height: `${popupState.size.height}px`,
        cursor: isDragging ? 'grabbing' : 'default'
    };

    return (
        <div 
            className={`${styles.overlay} ${isMobile ? styles.mobile : styles.desktop}`}
            onClick={handleOverlayClick}
        >
            <div
                ref={popupRef}
                className={`${styles.popup} ${isMobile ? styles.mobilePopup : styles.desktopPopup}`}
                style={popupStyle}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Resize handles - только для десктопа */}
                {!isMobile && (
                    <>
                        {/* Corner handles */}
                        <div 
                            className={`${styles.resizeHandle} ${styles.nw}`}
                            onMouseDown={(e) => handleResizeStart(e, 'nw')}
                        />
                        <div 
                            className={`${styles.resizeHandle} ${styles.ne}`}
                            onMouseDown={(e) => handleResizeStart(e, 'ne')}
                        />
                        <div 
                            className={`${styles.resizeHandle} ${styles.sw}`}
                            onMouseDown={(e) => handleResizeStart(e, 'sw')}
                        />
                        <div 
                            className={`${styles.resizeHandle} ${styles.se}`}
                            onMouseDown={(e) => handleResizeStart(e, 'se')}
                        />
                        
                        {/* Edge handles */}
                        <div 
                            className={`${styles.resizeHandle} ${styles.n}`}
                            onMouseDown={(e) => handleResizeStart(e, 'n')}
                        />
                        <div 
                            className={`${styles.resizeHandle} ${styles.e}`}
                            onMouseDown={(e) => handleResizeStart(e, 'e')}
                        />
                        <div 
                            className={`${styles.resizeHandle} ${styles.s}`}
                            onMouseDown={(e) => handleResizeStart(e, 's')}
                        />
                        <div 
                            className={`${styles.resizeHandle} ${styles.w}`}
                            onMouseDown={(e) => handleResizeStart(e, 'w')}
                        />
                    </>
                )}
                
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