import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
// import '../i18n.config';
import type {
  ApiErrorType,
  KnownErrorApiType,
  PageErrorsType,
} from '@/shared/api/ApiService/model/types';
import App from '../App';
import AppErrorBoundary from './AppErrorBoundary';

const handleThrowOnError = (error: KnownErrorApiType | ApiErrorType<PageErrorsType>): boolean => {
  if (!(error instanceof Error) && (error?.errors?.fields || error?.errors?.message)) {
    return false;
  }

  return true;
};

const QUERY_DEFAULT_OPTIONS = {
  queries: { retry: 1 },
  mutations: {
    retry: 1,
    throwOnError: handleThrowOnError,
    // onError: (error: Error) => {
    //   console.error('QUERY_DEFAULT_OPTIONS error', error);
    //   // if(error instanceof TokenExpiredError) throw error
    // },
  },
};

export const QueryClientApp = () => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: QUERY_DEFAULT_OPTIONS,
        queryCache: new QueryCache({
          // onError(error) {
          //   // ADD ERROR BOUNDARY
          //   console.error('QueryClient QueryCache error', error);
          // },
        }),
        mutationCache: new MutationCache({
          // onError(error) {
          //   console.error('888 QueryClient MutationCache error', error);
          //   // if(error instanceof TokenExpiredError) throw error
          // },
        }),
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AppErrorBoundary>
        <App />
        {/* <SnackBar /> */}
      </AppErrorBoundary>
    </QueryClientProvider>
  );
};
