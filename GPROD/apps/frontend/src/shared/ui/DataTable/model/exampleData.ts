import type { ExtendedColumnDefType, Filter, IMyData } from './types';

/** Пример конфигурации колонок */
export const columns: ExtendedColumnDefType<IMyData, string>[] = [
  {
    header: 'Name',
    accessorKey: 'name',
    textAlign: 'left',
    width: '150px',
  },
  {
    header: 'Age',
    accessorKey: 'age',
    textAlign: 'center',
    width: '100px',
  },
];

/** Пример данных */
export const data: IMyData[] = [
  { id: 1, name: 'Иван Петров', age: 25 },
  { id: 2, name: 'Мария Иванова', age: 30 },
  { id: 3, name: 'Алексей Смирнов', age: 35 },
  { id: 4, name: 'Елена Козлова', age: 28 },
  { id: 5, name: 'Дмитрий Соколов', age: 32 },
  { id: 6, name: 'Анна Морозова', age: 25 },
  { id: 7, name: 'Сергей Волков', age: 40 },
  { id: 8, name: 'Ольга Попова', age: 25 },
  { id: 9, name: 'Павел Новиков', age: 30 },
  { id: 10, name: 'Татьяна Быкова', age: 30 },
  { id: 11, name: 'Максим Жуков', age: 30 },
  { id: 12, name: 'Наталья Орлова', age: 25 },
  { id: 13, name: 'Андрей Соловьев', age: 32 },
  { id: 14, name: 'Екатерина Лебедева', age: 32 },
  { id: 15, name: 'Владимир Козлов', age: 25 },
];

/** Пример фильтров */
export const filters: Filter[] = [
  {
    id: 'name',
    label: 'Name',
    options: [
      { value: 'Иван Петров', label: 'Иван Петров' },
      { value: 'Мария Иванова', label: 'Мария Иванова' },
      { value: 'Алексей Смирнов', label: 'Алексей Смирнов' },
      { value: 'Елена Козлова', label: 'Елена Козлова' },
      { value: 'Дмитрий Соколов', label: 'Дмитрий Соколов' },
    ],
  },
  {
    id: 'age',
    label: 'Age',
    options: [
      { value: '25', label: '25' },
      { value: '30', label: '30' },
      { value: '35', label: '35' },
      { value: '28', label: '28' },
      { value: '32', label: '32' },
    ],
  },
];
