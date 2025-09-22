import parseProject from './parse-project';
import getFilesList from './get-files-list';
import getVideoMetadata from './get-video-metadata';
import { ApiHandler } from './types';

export const apiHandlers: ApiHandler[] = [
  parseProject,
  getFilesList,
  getVideoMetadata,
];

export * from './types';
