/**
 * Represents a file in the directory structure
 */
export interface FileInfo {
  /** The name of the file */
  name: string;
  type: 'file';
  size: number;
  /** Last modified timestamp in ISO 8601 format */
  lastModified: string;
}

/**
 * Represents a directory in the directory structure
 */
export interface DirectoryInfo {
  name: string;
  type: 'directory';
  contents: (FileInfo | DirectoryInfo)[];
}

/**
 * Successful response from the directory API
 */
export interface DirectoryResponse {
  /** The base path being listed */
  path: string;
  contents: (FileInfo | DirectoryInfo)[];
}

/**
 * Error response from the directory API
 */
export interface ErrorResponse {
  /** The base path that was attempted to be listed */
  path: string;
  contents: {
    /** Type of error encountered */
    error: 'Directory does not exist' | 'Error reading directory';
  };
}

export type ApiResponse = DirectoryResponse | ErrorResponse;
