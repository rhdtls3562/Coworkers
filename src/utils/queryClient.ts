import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: (failureCount, error) => {
        const status =
          typeof error === 'object' &&
          error !== null &&
          'status' in error &&
          typeof error.status === 'number'
            ? error.status
            : undefined;

        if (status === 401) {
          return false;
        }

        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
    },
  },
});
