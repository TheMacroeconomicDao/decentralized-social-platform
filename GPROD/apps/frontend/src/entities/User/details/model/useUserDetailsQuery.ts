import { useQuery } from '@tanstack/react-query';
import { getUserDetailsApi } from '../api/getUserDetailsApi';

export const useUserDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: ['UserDetails'],
    queryFn: () => getUserDetailsApi(id),
  });
};
