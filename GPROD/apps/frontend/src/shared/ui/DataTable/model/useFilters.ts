import type { ColumnFiltersState, OnChangeFn } from '@tanstack/react-table';
import { useState } from 'react';
import type { FilterState, UseFilters } from './types';

export const useFilters = ({ showIsMe }: { showIsMe?: boolean }): UseFilters => {
  const [filterState, setFilterState] = useState<FilterState>({
    selectedFilters: {},
    pendingFilters: {},
    globalFilter: '',
    columnFilters: [],
    isMe: showIsMe ? false : undefined,
  });

  const handleFilterChange = (filterId: string, value: string): void => {
    setFilterState(prev => ({
      ...prev,
      pendingFilters: {
        ...prev.pendingFilters,
        [filterId]: value,
      },
    }));
  };

  const handleApplyFilters = (): void => {
    setFilterState(prev => ({
      ...prev,
      selectedFilters: prev.pendingFilters,
    }));
  };

  const handleRemoveFilter = (filterId: string): void => {
    setFilterState(prev => ({
      ...prev,
      selectedFilters: {
        ...prev.selectedFilters,
        [filterId]: '',
      },
      pendingFilters: {
        ...prev.pendingFilters,
        [filterId]: '',
      },
    }));
  };

  const handleClearFilters = (): void => {
    setFilterState(prev => ({
      ...prev,
      selectedFilters: {},
      pendingFilters: {},
      globalFilter: '',
      columnFilters: [],
      isMe: showIsMe ? false : undefined,
    }));
  };

  const toggleIsMe = (): void => {
    setFilterState(prev => ({
      ...prev,
      isMe: prev.isMe === undefined ? true : !prev.isMe,
    }));
  };

  const setGlobalFilter = (value: string): void => {
    setFilterState(prev => ({
      ...prev,
      globalFilter: value,
    }));
  };

  const setColumnFilters: OnChangeFn<ColumnFiltersState> = updaterOrValue => {
    setFilterState(prev => ({
      ...prev,
      columnFilters:
        typeof updaterOrValue === 'function' ? updaterOrValue(prev.columnFilters) : updaterOrValue,
    }));
  };

  return {
    filterState,
    handleFilterChange,
    handleApplyFilters,
    handleRemoveFilter,
    handleClearFilters,
    toggleIsMe,
    setGlobalFilter,
    setColumnFilters,
  };
};
