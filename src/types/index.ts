export * from './api';

type SearchParams = Record<string, string | string[] | undefined>;
type PageSearchParams = Promise<SearchParams>;
type sizeType = 'small' | 'medium' | 'large';

export type { SearchParams, PageSearchParams, sizeType };
