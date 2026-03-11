import { memo } from 'react';
import { Button } from '../../../Button';
import { Flex } from '../../../Flex';
import { XMarkIcon } from '../../../icons';
import { Typography } from '../../../Typography';
import type { ActiveFiltersProps } from '../../model/types';

/** Компонент для отображения активных фильтров */
export const ActiveFilters = memo((props: ActiveFiltersProps): JSX.Element | null => {
  const { filterState, handleRemoveFilter, theme } = props;
  const activeFilters = Object.entries(filterState.selectedFilters).filter(([_, value]) => !!value);

  if (activeFilters.length === 0) return null;

  return (
    <Flex
      alignItems="center"
      gap="15px"
      mb="10px"
      mt="10px"
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
  );
});
