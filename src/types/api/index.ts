import type { components } from './api.d.ts';

type FileInfo = components['schemas']['FileInfo'];
type FileType = components['schemas']['FileType'];
type Project = components['schemas']['ParseProjectResponse'];
type ProjectItem = Project['project_items'][number];
type RoadData = ProjectItem['road_data'];

//TODO: remove this when backend returns proper error interface
type ErrorMessage = {
  detail: {
    message: string;
    relative_path?: string;
  };
};

type GetFilesListResponse = Array<FileInfo> | ErrorMessage;
type GetProjectResponse = Project | ErrorMessage;

export type {
  FileInfo,
  FileType,
  GetFilesListResponse,
  ErrorMessage,
  GetProjectResponse,
  Project,
  RoadData,
  ProjectItem,
};
