export * from './api';

type SearchParams = Record<string, string | string[] | undefined>;
type PageSearchParams = Promise<SearchParams>;

export type { SearchParams, PageSearchParams };
