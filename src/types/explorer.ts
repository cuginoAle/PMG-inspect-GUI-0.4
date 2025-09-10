/**
 * Represents a file in the directory structure
 */
export interface FileInfo {
  relative_path: string;
  name: string;
  size: number | null;
  pciScore?: number;
  /** Last modified timestamp in ISO 8601 format */
  last_modified: string | null;
}

/**
 * Represents a directory in the directory structure
 */
export interface DirectoryInfo {
  relative_path: string;
  name: string;
  content: (FileInfo | DirectoryInfo)[] | null;
}

/**
 * Successful response from the directory API
 */
export type DirectoryResponse = (FileInfo | DirectoryInfo)[];

/**
 * Error response from the directory API
 */
export interface ErrorResponse {
  /** The base path that was attempted to be listed */
  relative_path: string;
  error: string;
}

export type ApiResponse = DirectoryResponse | ErrorResponse;
