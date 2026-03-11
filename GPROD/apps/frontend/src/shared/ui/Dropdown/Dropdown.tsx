import { useRef, useState, useEffect, useCallback } from 'react';
import { DropdownContainer, DropdownContent, DropdownItem } from './Dropdown.styled';
import type { DropdownProps, DropdownItemProps } from './model/types';

export const Dropdown = ({ trigger, items }: DropdownProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Функция для расчета позиции выпадающего меню
  const updatePosition = useCallback(() => {
    if (!isOpen || !triggerRef.current || !dropdownRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownRect = dropdownRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const showBelow = spaceBelow >= dropdownRect.height || spaceBelow > rect.top;

    dropdownRef.current.style.top = showBelow
      ? `${rect.bottom + 4}px`
      : `${rect.top - dropdownRect.height - 4}px`;

    dropdownRef.current.style.left = `${Math.max(
      0,
      Math.min(window.innerWidth - dropdownRect.width, rect.right - dropdownRect.width)
    )}px`;
  }, [isOpen]);

  // Обработчик клика вне дропдауна
  const handleClickOutside = useCallback((e: MouseEvent): void => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  // Обработчик нажатия Escape
  const handleEscapeKey = useCallback((e: KeyboardEvent): void => {
    if (e.key === 'Escape') setIsOpen(false);
  }, []);

  // Обработчик клика по элементу меню
  const handleItemClick = useCallback((item: DropdownItemProps): void => {
    item.onClick();
    setIsOpen(false);
  }, []);

  // Эффект для позиционирования меню при открытии
  useEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen, updatePosition]);

  // Эффект для добавления обработчиков событий
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);

      return (): void => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [isOpen, handleClickOutside, handleEscapeKey]);

  return (
    <DropdownContainer ref={containerRef}>
      <div
        ref={triggerRef}
        onClick={() => setIsOpen(prev => !prev)}
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {trigger}
      </div>

      {isOpen && (
        <DropdownContent
          ref={dropdownRef}
          role="menu"
        >
          {items.map((item, index) => (
            <DropdownItem
              key={index}
              onClick={() => handleItemClick(item)}
              role="menuitem"
            >
              {item.icon}
              {item.label}
            </DropdownItem>
          ))}
        </DropdownContent>
      )}
    </DropdownContainer>
  );
};
