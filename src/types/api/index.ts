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

type ProjectParsingState = Project['project_items'][number]['parsing_status'];

type GpsData = components['schemas']['GpsPoint'];

type GetFilesListResponse =
  | { status: 'ok'; detail: Array<FileInfo> }
  | FetchError
  | LoadingState;
type GetProjectResponse =
  | { status: 'ok'; detail: Project }
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
  LoadingState,
  MediaData,
  Project,
  ProjectItem,
  RoadData,
  ResponseType,
  FileOrigin,
  GpsData,
  ProjectParsingState,
};
