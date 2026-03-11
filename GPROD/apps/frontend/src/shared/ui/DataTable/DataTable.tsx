import { useTheme } from '@emotion/react';
import type { SortingState, VisibilityState } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { memo, useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { getSortingIndicator } from '../../lib/utils';
import { Typography } from '../Typography';
import {
  EmptyState,
  SortButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableWrapper,
} from './DataTable.styled';
import type { ExtendedColumnDefType, IDataTableProps } from './model/types';
import { useFilters } from './model/useFilters';
import { useTableConfig } from './model/useTableConfig';
import { ActiveFilters, TableFilters } from './ui/Filters';

/**
 * Компонент DataTable для отображения данных в табличном формате с возможностью фильтрации,
 * сортировки и поиска
 */
export const DataTable = memo(
  <TData, TValue>({
    columns,
    data,
    isSearchable = true,
    onRowClick,
    fallback = 'Ничего не найдено',
    defaultColumnVisibility,
    enableColumnToggling = false,
    filters,
    showIsMe,
  }: IDataTableProps<TData, TValue>): JSX.Element => {
    const theme = useTheme();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
      defaultColumnVisibility || {}
    );
    const [searchTerm, setSearchTerm] = useState('');
    const searchTimeoutRef = useRef<number>();

    const {
      filterState,
      handleFilterChange,
      handleApplyFilters,
      toggleIsMe,
      handleRemoveFilter,
      handleClearFilters,
      setGlobalFilter,
      setColumnFilters,
    } = useFilters({
      showIsMe,
    });

    const { table, hasData } = useTableConfig({
      data,
      columns,
      filterState,
      sorting,
      columnVisibility,
      enableColumnToggling,
      setSorting,
      setGlobalFilter,
      setColumnFilters,
      setColumnVisibility,
    });

    // Оптимизированная обработка ввода поиска с дебаунсом
    useEffect(() => {
      if (searchTimeoutRef.current) {
        window.clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = window.setTimeout(() => {
        setGlobalFilter(searchTerm);
      }, 300);

      return (): void => clearTimeout(searchTimeoutRef.current);
    }, [searchTerm, setGlobalFilter]);

    // Очистка всех фильтров и поиска
    const handleClearAll = useCallback((): void => {
      handleClearFilters();
      setSearchTerm('');
    }, [handleClearFilters]);

    // Создаем группы заголовков для таблицы
    const headerGroups = useMemo(() => table.getHeaderGroups(), [table]);

    // Отображение пустого состояния, если нет данных
    const renderEmptyState = useMemo(
      () => (
        <TableRow>
          <EmptyState colSpan={columns.length}>
            <Typography variant="body1">
              {filterState.globalFilter || Object.keys(filterState.selectedFilters).length > 0
                ? fallback
                : 'Ничего не найдено'}
            </Typography>
          </EmptyState>
        </TableRow>
      ),
      [filterState.globalFilter, filterState.selectedFilters, fallback, columns.length]
    );

    // Получаем актуальные строки таблицы
    const rows = table.getRowModel().rows;

    return (
      <TableWrapper>
        <TableFilters
          isSearchable={isSearchable}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterState={filterState}
          filters={filters}
          {...(showIsMe ? { toggleIsMe } : {})}
          handleFilterChange={handleFilterChange}
          handleClearAll={handleClearAll}
          handleApplyFilters={handleApplyFilters}
          theme={theme}
        />
        <ActiveFilters
          filterState={filterState}
          handleRemoveFilter={handleRemoveFilter}
          theme={theme}
        />
        <TableContainer>
          <Table>
            <TableHeader>
              {headerGroups.map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    const columnDef = header.column.columnDef as ExtendedColumnDefType<
                      TData,
                      TValue
                    >;
                    return (
                      <TableHead
                        key={header.id}
                        textAlign={columnDef.textAlign}
                        width={columnDef.width}
                      >
                        {!columnDef.isSortable ? (
                          <SortButton onClick={header.column.getToggleSortingHandler()}>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {getSortingIndicator(header.column.getIsSorted())}
                          </SortButton>
                        ) : (
                          flexRender(header.column.columnDef.header, header.getContext())
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {hasData
                ? rows.map(row => (
                    <TableRow
                      key={row.id}
                      onClick={() => onRowClick?.(row.original as TData)}
                      cursor={onRowClick ? 'pointer' : 'default'}
                    >
                      {row.getVisibleCells().map(cell => {
                        const columnDef = cell.column.columnDef as ExtendedColumnDefType<
                          TData,
                          TValue
                        >;
                        return (
                          <TableCell
                            key={cell.id}
                            textAlign={columnDef.textAlign}
                            width={columnDef.width}
                          >
                            {flexRender(columnDef.cell, cell.getContext())}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                : renderEmptyState}
            </TableBody>
          </Table>
        </TableContainer>
      </TableWrapper>
    );
  }
) as <TData, TValue>(props: IDataTableProps<TData, TValue>) => JSX.Element;
