import type { ChangeEvent } from 'react';
import { Button } from '../../../Button';
import { Flex } from '../../../Flex';
import { XMarkIcon } from '../../../icons';
import { Input } from '../../../Input';
import { Select } from '../../../Select';
import { Typography } from '../../../Typography';
import type { ActiveFiltersProps } from '../../model/types';
import type { TableFiltersProps } from '../../model/types';

/** Компонент для отображения активных фильтров */
export const ActiveFilters = ({
  filterState,
  handleRemoveFilter,
  theme,
}: ActiveFiltersProps): JSX.Element | null => {
  const activeFilters = Object.entries(filterState.selectedFilters).filter(([_, value]) =>
    Boolean(value)
  );

  return activeFilters.length > 0 ? (
    <Flex
      alignItems="center"
      gap="15px"
    >
      {activeFilters.map(([id, value]) => (
        <Button
          key={id}
          variant="primaryMain"
        >
          <Typography
            color={theme.primary.dark}
            variant="menu_body1"
          >
            {String(value)}
          </Typography>
          <div onClick={() => handleRemoveFilter(id)}>
            <XMarkIcon fill={theme.primary.dark} />
          </div>
        </Button>
      ))}
    </Flex>
  ) : null;
};

/** Компонент для отображения фильтров */
export const TableFilters = ({
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
}: TableFiltersProps): JSX.Element => (
  <Flex
    justifyContent="space-between"
    alignItems="center"
  >
    <Flex gap="8px">
      {isSearchable && (
        <Flex w="324px">
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
              setSearchTerm(e.target.value)
            }
          />
        </Flex>
      )}
      <Flex
        gap="8px"
        alignItems="center"
      >
        {toggleIsMe && (
          <Button
            variant={filterState.isMe ? 'primaryMain' : 'primaryDarker'}
            onClick={toggleIsMe}
          >
            <Typography
              color={filterState.isMe ? theme.primary.darker : theme.primary.main}
              variant={'menu_body1'}
            >
              Me
            </Typography>
          </Button>
        )}
        {filters?.map(filter => (
          <Select
            key={filter.id}
            placeholder={filter.label}
            value={filterState.pendingFilters[filter.id] || ''}
            onChange={(value: string) => handleFilterChange(filter.id, value)}
            options={filter.options}
          />
        ))}
      </Flex>
    </Flex>
    <Flex gap="8px">
      <Button
        variant="blueDark"
        onClick={handleClearAll}
      >
        <Typography variant={'menu_body1'}>Clear</Typography>
      </Button>
      <Button
        variant="primaryMain"
        onClick={handleApplyFilters}
      >
        <Typography
          color={theme.primary.darker}
          variant={'menu_body1'}
        >
          Apply
        </Typography>
      </Button>
    </Flex>
  </Flex>
);
