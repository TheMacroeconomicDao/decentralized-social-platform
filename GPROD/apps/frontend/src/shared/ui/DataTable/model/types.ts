import type { Theme } from '@emotion/react';
import type {
  ColumnDef,
  Row,
  VisibilityState,
  ColumnFiltersState,
  OnChangeFn,
} from '@tanstack/react-table';
import type { ReactNode } from 'react';

/** Элемент фильтра */
export interface IFilterItem {
  id: string; // Уникальный идентификатор фильтра
  label: string; // Отображаемый текст фильтра
  value: string; // Значение фильтра
  options?: Array<{ value: string; label: string }>; // Опции для выбора в фильтре
}

/** Элемент таблицы данных */
export interface IDataTableItem<TValue> {
  id: string; // Уникальный идентификатор элемента
  label: string; // Отображаемый текст элемента
  value: (value: TValue[], row: Row<TValue>) => ReactNode; // Функция для отображения значения
  enableSorting?: boolean; // Включить сортировку для элемента
}

/** Опция фильтра */
export interface FilterOption {
  readonly value: string;
  readonly label: string;
}

/** Фильтр таблицы */
export interface Filter {
  id: string;
  label: string;
  options: readonly FilterOption[];
}

/** Интерфейс для использования фильтров */
export interface UseFilters {
  filterState: FilterState;
  handleFilterChange: (filterId: string, value: string) => void;
  handleApplyFilters: () => void;
  handleRemoveFilter: (filterId: string) => void;
  handleClearFilters: () => void;
  toggleIsMe: () => void;
  setGlobalFilter: (value: string) => void;
  setColumnFilters: OnChangeFn<ColumnFiltersState>;
}

/** Состояние фильтров */
export interface FilterState {
  selectedFilters: Record<string, string>;
  pendingFilters: Record<string, string>;
  globalFilter: string;
  columnFilters: ColumnFiltersState;
  isMe?: boolean;
}

/** Расширенный тип определения колонки */
export type ExtendedColumnDefType<TData, TValue> = ColumnDef<TData, TValue> & {
  textAlign?: 'left' | 'center' | 'right'; // Выравнивание текста
  width?: string; // Ширина колонки
  isSortable?: boolean; // Возможность сортировки
};

/** Пропсы компонента DataTable */
export interface IDataTableProps<TData, TValue> {
  columns: ExtendedColumnDefType<TData, TValue>[]; // Конфигурация колонок
  data: TData[]; // Данные для отображения
  isSearchable?: boolean; // Включить поиск
  fallback?: React.ReactNode | string; // Резервный контент
  onRowClick?: (row: TData) => void; // Обработчик клика по строке
  defaultColumnVisibility?: VisibilityState; // Видимость колонок по умолчанию
  enableColumnToggling?: boolean; // Включить переключение колонок
  enablePagination?: boolean; // Включить пагинацию
  initialPageSize?: number; // Начальный размер страницы
  filters?: Filter[]; // Фильтры для таблицы
  showIsMe?: boolean; // Показывать ли фильтр "Me"
}

/** Интерфейс данных для примера */
export interface IMyData {
  id: number; // Идентификатор
  name: string; // Имя
  age: number; // Возраст
}

/** Интерфейс пропсов для компонента TableFilters */
export interface TableFiltersProps {
  isSearchable: boolean; // Включить поиск
  searchTerm: string; // Терм поиска
  setSearchTerm: (value: string) => void; // Установить терм поиска
  filterState: FilterState; // Состояние фильтров
  filters?: Filter[]; // Фильтры
  toggleIsMe?: () => void; // Переключить isMe
  handleFilterChange: (filterId: string, value: string) => void; // Изменить фильтр
  handleClearAll: () => void; // Очистить все фильтры
  handleApplyFilters: () => void; // Применить фильтры
  theme: Theme; // Тема
}

/** Интерфейс пропсов для компонента ActiveFilters */
export interface ActiveFiltersProps {
  filterState: FilterState; // Состояние фильтров
  handleRemoveFilter: (filterId: string) => void; // Удалить фильтр
  theme: Theme; // Тема
}
