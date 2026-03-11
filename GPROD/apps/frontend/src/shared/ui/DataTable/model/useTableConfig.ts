import type {
  ColumnFiltersState,
  OnChangeFn,
  SortingState,
  Table,
  VisibilityState,
} from '@tanstack/react-table';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo } from 'react';
import { type ExtendedColumnDefType } from './types';
import type { FilterState } from './types';

interface UseTableConfigProps<TData, TValue> {
  data: TData[];
  columns: ExtendedColumnDefType<TData, TValue>[];
  filterState: FilterState;
  sorting: SortingState;
  columnVisibility: VisibilityState;
  enableColumnToggling: boolean;
  setSorting: OnChangeFn<SortingState>;
  setGlobalFilter: (value: string) => void;
  setColumnFilters: OnChangeFn<ColumnFiltersState>;
  setColumnVisibility: OnChangeFn<VisibilityState>;
}

export const useTableConfig = <TData, TValue>({
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
}: UseTableConfigProps<TData, TValue>): {
  table: Table<TData>;
  hasData: boolean;
} => {
  const filteredData = useMemo(() => {
    return data.filter(row => {
      const matchesGlobalFilter = filterState.globalFilter
        ? Object.values(row as Record<string, string>).some(value =>
            String(value).toLowerCase().includes(filterState.globalFilter.toLowerCase())
          )
        : true;

      const matchesColumnFilters = Object.entries(filterState.selectedFilters).every(
        ([filterId, filterValue]) =>
          filterValue ? String((row as Record<string, string>)[filterId]) === filterValue : true
      );

      return matchesGlobalFilter && matchesColumnFilters;
    });
  }, [data, filterState.globalFilter, filterState.selectedFilters]);

  const processedColumns = useMemo(() => {
    return columns.map(column => ({
      ...column,
      enableSorting: column.isSortable !== undefined ? column.isSortable : true,
    }));
  }, [columns]);

  const table = useReactTable({
    data: filteredData,
    columns: processedColumns,
    state: {
      sorting,
      globalFilter: filterState.globalFilter,
      columnFilters: filterState.columnFilters,
      columnVisibility,
    },
    enableHiding: enableColumnToggling,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return {
    table,
    hasData: table.getRowModel().rows.length > 0,
  };
};
