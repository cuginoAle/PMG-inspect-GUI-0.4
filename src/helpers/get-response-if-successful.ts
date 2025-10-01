import type { ResponseType } from '@/src/types/api';

function getResponseIfSuccesful<T>(response?: ResponseType<T>): T | undefined {
  return response?.status === 'ok' ? response.detail : undefined;
}

export { getResponseIfSuccesful };
