import type { components } from './api.d.ts';

type FetchError = {
  status: 'error';
  code: string;
  detail: {
    message: string;
  };
};

type LoadingState = {
  status: 'loading';
};
type FileOrigin = 'local' | 'remote';
type FileType = components['schemas']['FileType'];
type FileInfo = components['schemas']['FileInfo'] & {
  file_origin?: FileOrigin;
};
type Project = components['schemas']['ParseProjectResponse'];
type ProjectItem = Project['project_items'][number];
type RoadData = ProjectItem['road_data'];
type CameraData = components['schemas']['CameraData'];
type MediaData = components['schemas']['MediaData'];
type VideoData = components['schemas']['ParseVideoResponse'];
type GpsData = VideoData['gps_data'];

type GetFilesListResponse =
  | { status: 'ok'; detail: Array<FileInfo> }
  | FetchError
  | LoadingState;
type GetProjectResponse =
  | { status: 'ok'; detail: Project }
  | FetchError
  | LoadingState;
type GetVideoMetadataResponse =
  | { status: 'ok'; detail: VideoData }
  | FetchError
  | LoadingState;

type ResponseType<T> = { status: 'ok'; detail: T } | FetchError | LoadingState;

export type {
  CameraData,
  FetchError,
  FileInfo,
  FileType,
  GetFilesListResponse,
  GetProjectResponse,
  GetVideoMetadataResponse,
  GpsData,
  LoadingState,
  MediaData,
  Project,
  ProjectItem,
  RoadData,
  VideoData,
  ResponseType,
  FileOrigin,
};
