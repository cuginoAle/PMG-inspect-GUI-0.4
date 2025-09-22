import type { Route } from '@playwright/test';

export interface ApiHandlerContext {
  route: Route;
  url: URL;
  pathname: string;
  // Track usage bump
  bump: (key: string) => void;
}

export interface ApiHandler {
  /** Simple id key for usage metrics */
  key: string;
  /** Returns true if this handler claims the request */
  matches: (pathname: string, url: URL) => boolean;
  /** Fulfill the route. Should return true if handled */
  handle: (ctx: ApiHandlerContext) => Promise<boolean>;
}
