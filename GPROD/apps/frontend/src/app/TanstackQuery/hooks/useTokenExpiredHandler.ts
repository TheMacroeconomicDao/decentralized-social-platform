import { localStorageService } from '@/shared/storages/localStorageService';
// import { useNavigate } from 'react-router-dom';

const useTokenExpiredHandler = () => {
  // const navigate = useNavigate();

  const tokenExpiredHandler = (): void => {
    localStorageService.remove('access_token');
    // navigate(getLoginUrl());
  };

  return {
    tokenExpiredHandler,
  };
};

export default useTokenExpiredHandler;
