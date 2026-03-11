import type { ChangeEvent } from 'react';
import { useCallback, memo } from 'react';
import { Button } from '../../../Button';
import { Flex } from '../../../Flex';
import { Input } from '../../../Input';
import { Select } from '../../../Select';
import { Typography } from '../../../Typography';
import type { TableFiltersProps } from '../../model/types';

/** Компонент для отображения фильтров */
export const TableFilters = memo(
  ({
    isSearchable,
    searchTerm,
    setSearchTerm,
    filterState,
    filters,
    toggleIsMe,
    handleFilterChange,
    handleClearAll,
    handleApplyFilters,
    theme,
  }: TableFiltersProps): JSX.Element => {
    // Обработчик изменения поискового запроса
    const handleSearchInputChange = useCallback(
      (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSearchTerm(e.target.value);
      },
      [setSearchTerm]
    );

    return (
      <Flex
        flexDirection="column"
        gap="12px"
      >
        <Flex
          justifyContent="space-between"
          alignItems="center"
        >
          <Flex gap="12px">
            {isSearchable && (
              <Flex w="324px">
                <Input
                  placeholder="Поиск"
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                />
              </Flex>
            )}
            <Flex
              gap="10px"
              alignItems="center"
              flexWrap="wrap"
            >
              {toggleIsMe && (
                <Button
                  variant={filterState.isMe ? 'primaryMain' : 'primaryDarker'}
                  onClick={toggleIsMe}
                >
                  <Typography
                    color={filterState.isMe ? theme.primary.darker : theme.primary.main}
                    variant="menu_body1"
                  >
                    Me
                  </Typography>
                </Button>
              )}
              {filters?.map(filter => (
                <Flex
                  key={filter.id}
                  flexDirection="column"
                  position="relative"
                >
                  <Select
                    placeholder={filter.label}
                    value={filterState.pendingFilters[filter.id] || ''}
                    onChange={(value: string) => handleFilterChange(filter.id, value)}
                    options={filter.options}
                  />
                </Flex>
              ))}
            </Flex>
          </Flex>
          <Flex gap="10px">
            <Button
              variant="blueDark"
              onClick={handleClearAll}
            >
              <Typography variant="menu_body1">Clear</Typography>
            </Button>
            <Button
              variant="primaryMain"
              onClick={handleApplyFilters}
            >
              <Typography
                color={theme.primary.darker}
                variant="menu_body1"
              >
                Apply
              </Typography>
            </Button>
          </Flex>
        </Flex>
      </Flex>
    );
  }
);
