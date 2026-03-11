import type { ReactNode } from 'react';

export interface DropdownItemProps {
  icon?: ReactNode; // Icon для кнопки
  label: string; // Текст для кнопки
  onClick: () => void; // Функция для вызова при клике
}

export interface DropdownProps {
  trigger: ReactNode; // Триггер для открытия дропдауна
  items: DropdownItemProps[]; // Элементы дропдауна
}
