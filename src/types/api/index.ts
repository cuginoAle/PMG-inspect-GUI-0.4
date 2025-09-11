import type { components } from './api.d.ts';

type FileInfo = components['schemas']['FileInfo'];
type FileType = components['schemas']['FileType'];

//TODO: remove this when backend returns proper error interface
type FileInfoError = {
  error: string;
  relative_path: string;
};

type GetFilesListResponse = Array<FileInfo> | FileInfoError;

export type { FileInfo, FileType, GetFilesListResponse, FileInfoError };
