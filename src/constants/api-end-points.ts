// We prefer using a relative proxy path in the browser to avoid CORS issues (notably Safari strictness).
// The Next.js rewrite in next.config.ts maps /api/proxy/* -> backend origin.
// For SSR / Node contexts we can safely call the backend origin directly if desired.

const DIRECT_API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8088';
// Heuristic: if we're in the browser, use the proxy prefix unless explicit opt-out flag present on window.
// (We defensively check typeof window.)
const USING_BROWSER = typeof window !== 'undefined';
const USE_DIRECT =
  USING_BROWSER && (window as any).__API_DIRECT__ === true
    ? true
    : !USING_BROWSER; // server uses direct by default

// Base for constructing endpoints
const BASE = USE_DIRECT ? DIRECT_API_BASE : '/api/proxy';

const GET_FILE_LIST_ENDPOINT = 'api/v1/get_files_list';
const GET_FILE_DETAILS_ENDPOINT = 'api/v1/get_project_inventory';
const GET_VIDEO_METADATA_ENDPOINT = 'api/v1/parse_video';

const GET_PROJECT_STATUS_ENDPOINT = 'api/v1/get_project_status';
const GET_INFERENCE_MODELS = 'api/v1/get_inference_models';
const GET_VIDEOS_PCI_SCORES = 'api/v1/get_video_inference_derived_results';
const GET_PROCESSING_CONFIGURATIONS = 'api/v1/get_processing_configurations';

const ENDPOINT = {
  INFERENCE_MODELS: `${BASE}/${GET_INFERENCE_MODELS}`,
  PROCESSING_CONFIGURATIONS: `${BASE}/${GET_PROCESSING_CONFIGURATIONS}`,
  PROJECT: {
    LIST: `${BASE}/${GET_FILE_LIST_ENDPOINT}`,
    DETAILS: `${BASE}/${GET_FILE_DETAILS_ENDPOINT}`,
    STATUS: `${BASE}/${GET_PROJECT_STATUS_ENDPOINT}`,
  },
  PCI_SCORES: `${BASE}/${GET_VIDEOS_PCI_SCORES}`,
  VIDEOS: `${BASE}/${GET_VIDEO_METADATA_ENDPOINT}`,
  // Expose also the raw direct origin for special cases (e.g., generating openapi types)
  __DIRECT_ORIGIN: DIRECT_API_BASE,
};

export { ENDPOINT };
