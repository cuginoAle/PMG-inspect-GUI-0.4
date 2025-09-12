import type { components } from './api.d.ts';

type FileInfo = components['schemas']['FileInfo'];
type FileType = components['schemas']['FileType'];

//TODO: remove this when backend returns proper error interface
type ErrorMessage = {
  detail: {
    message: string;
    relative_path: string;
  };
};

type GetFilesListResponse = Array<FileInfo> | ErrorMessage;

export type { FileInfo, FileType, GetFilesListResponse, ErrorMessage };
