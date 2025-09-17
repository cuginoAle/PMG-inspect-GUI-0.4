import type { FetchError, LoadingState, ResponseType } from '@/src/types/api';

function isFetchError(val: unknown): val is FetchError {
  if (typeof val !== 'object' || val === null) return false;
  const anyVal = val as any;
  return (
    typeof anyVal.status === 'number' &&
    typeof anyVal.detail === 'object' &&
    anyVal.detail !== null &&
    typeof anyVal.detail.message === 'string'
  );
}

function isLoadingState(val: unknown): val is LoadingState {
  return (
    typeof val === 'object' && val !== null && (val as any).status === 'loading'
  );
}

function getResponseIfSuccesful<T>(response: ResponseType<T>): T | undefined {
  if (isFetchError(response) || isLoadingState(response)) return undefined;
  return response as T;
}

export { getResponseIfSuccesful };
