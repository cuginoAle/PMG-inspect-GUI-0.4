import { ApiHandler } from './handlers';

/**
 * Generic factory for creating an error override for a given endpoint path ending.
 * The handler matches by checking pathname.endsWith(endpointSuffix).
 */
function makeErrorOverride(opts: {
  endpointSuffix: string; // e.g. '/get_files_list'
  key?: string; // identifier for usage metrics (defaults to endpointSuffix without leading slash)
  status?: number; // HTTP status (default 500)
  message?: string; // Error message (used inside detail.message)
  rawBody?: any; // Provide a full body instead of generated one (takes precedence)
}): ApiHandler {
  const {
    endpointSuffix,
    key = `override_${opts.endpointSuffix.replace(/\//g, '_')}`,
    status = 500,
    message = 'Internal Server Error',
    rawBody,
  } = opts;
  return {
    key,
    matches: (pathname) => pathname.endsWith(endpointSuffix),
    handle: async ({ route, bump }) => {
      bump(key);
      const body =
        rawBody !== undefined ? rawBody : { detail: { message, code: status } };
      await route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
      return true;
    },
  };
}

/**
 * Convenience helper specifically for forcing get_files_list error responses.
 */
function overrideGetFilesListError(options?: {
  status?: number;
  message?: string;
  rawBody?: any;
}): ApiHandler {
  return makeErrorOverride({
    endpointSuffix: '/get_files_list',
    key: 'get_files_list_error',
    ...options,
  });
}

/**
 * Convenience helper specifically for forcing parse-project error responses.
 */
function overrideParseProjectError(options?: {
  status?: number;
  message?: string;
  rawBody?: any;
}): ApiHandler {
  return makeErrorOverride({
    endpointSuffix: '/parse_project',
    key: 'parse_project_error',
    ...options,
  });
}
/**
 * Convenience helper specifically for forcing get-video-metadata error responses.
 */
function overrideGetVideoMetadataError(options?: {
  status?: number;
  message?: string;
  rawBody?: any;
}): ApiHandler {
  return makeErrorOverride({
    endpointSuffix: '/parse_video',
    key: 'get_video_metadata_error',
    ...options,
  });
}

export {
  makeErrorOverride,
  overrideGetFilesListError,
  overrideParseProjectError,
  overrideGetVideoMetadataError,
};
