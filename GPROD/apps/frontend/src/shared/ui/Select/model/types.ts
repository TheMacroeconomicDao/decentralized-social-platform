/** Опция для селекта */
export interface ISelectOption {
  readonly value: string;
  readonly label: string;
}

/** Пропсы компонента Select */
export interface ISelectProps {
  value?: string; // Выбранное значение
  onChange?: (value: string) => void; // Обработчик изменения значения
  placeholder?: string; // Текст плейсхолдера
  options?: readonly ISelectOption[]; // Массив опций для выбора
  ariaLabel?: string; // ARIA метка для доступности
}
