import type { components } from './api.d.ts';

type FetchError = {
  status: number;
  detail: {
    message: string;
  };
};

type LoadingState = {
  status: 'loading';
};

type FileInfo = components['schemas']['FileInfo'];
type FileType = components['schemas']['FileType'];
type Project = components['schemas']['ParseProjectResponse'];
type ProjectItem = Project['project_items'][number];
type RoadData = ProjectItem['road_data'];
type CameraData = components['schemas']['CameraData'];
type MediaData = components['schemas']['MediaData'];
type VideoData = components['schemas']['ParseVideoResponse'];
type GpsData = VideoData['gps_data'];

type GetFilesListResponse = Array<FileInfo> | FetchError;
type GetProjectResponse = Project | FetchError | LoadingState;
type GetVideoMetadataResponse = VideoData | FetchError | LoadingState;

type ResponseType<T> = T | FetchError | LoadingState;

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
};
