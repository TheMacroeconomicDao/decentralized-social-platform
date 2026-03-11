import type { FilterFn } from '@tanstack/react-table';

/** Получает индикатор сортировки */
export const getSortingIndicator = (sort: string | false): string | null => {
  switch (sort) {
    case 'asc':
      return '↑';
    case 'desc':
      return '↓';
    default:
      return null;
  }
};

/** Дебаунс */
export const debounce = (
  func: (...args: any[]) => void,
  delay: number
): ((...args: any[]) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: any[]) => {
    const later = (): void => {
      timeout = null;
      func(...args);
    };

    if (timeout !== null) clearTimeout(timeout);
    timeout = setTimeout(later, delay);
  };
};

export const fuzzyFilter: FilterFn<any> = (row, columnId, value) => {
  const item = row.getValue(columnId);
  return String(item ?? '')
    .toLowerCase()
    .includes(String(value).toLowerCase());
};
