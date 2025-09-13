const API_BASE_URL = 'http://localhost:8088';
const GET_FILE_LIST_ENDPOINT = 'api/v1/get_files_list';
const GET_FILE_DETAILS_ENDPOINT = 'api/v1/parse_project';
const GET_VIDEO_METADATA_ENDPOINT = 'api/v1/parse_video';

const GET_FILES_ENDPOINT = {
  LIST: `${API_BASE_URL}/${GET_FILE_LIST_ENDPOINT}`,
  DETAILS: `${API_BASE_URL}/${GET_FILE_DETAILS_ENDPOINT}`,
  VIDEOS: `${API_BASE_URL}/${GET_VIDEO_METADATA_ENDPOINT}`,
};

export { GET_FILES_ENDPOINT };
