import type { components } from './api.d.ts';
import { FetchError } from './bffApi.js';

type FileInfo = components['schemas']['FileInfo'];
type FileType = components['schemas']['FileType'];
type Project = components['schemas']['ParseProjectResponse'];
type ProjectItem = Project['project_items'][number];
type RoadData = ProjectItem['road_data'];
type CameraData = components['schemas']['CameraData'];
type MediaData = components['schemas']['MediaData'];
type VideoData = components['schemas']['ParseVideoResponse'];

type GetFilesListResponse = Array<FileInfo> | FetchError;
type GetProjectResponse = Project | FetchError;

export type {
  FileInfo,
  FileType,
  GetFilesListResponse,
  GetProjectResponse,
  Project,
  RoadData,
  ProjectItem,
  CameraData,
  VideoData,
  MediaData,
};
