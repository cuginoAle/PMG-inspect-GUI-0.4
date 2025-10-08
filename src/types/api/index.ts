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
type ProcessingConfiguration = Record<
  // TODO: this should come from the OpenAPI!
  string,
  components['schemas']['ProcessingConfiguration']
>;
type InferenceTypes = components['schemas']['InferenceType'];
type Inference = components['schemas']['InferenceConfiguration'];

type ProjectParsingState = Project['project_items'][number]['parsing_status'];

type GpsData = components['schemas']['GpsPoint'];

type InferenceModelDict = Record<InferenceTypes, string[]>; // TODO: this should come from the OpenAPI!

type GetFilesListResponse =
  | { status: 'ok'; detail: Array<FileInfo> }
  | FetchError
  | LoadingState;
type GetProjectResponse =
  | { status: 'ok'; detail: Project }
  | FetchError
  | LoadingState;
type GetProcessingConfigurationResponse = {
  processing_configurations: ProcessingConfiguration;
  inference_model_ids: InferenceModelDict; // Maybe this prop could be renamed to inference_model_dictionary
};
type ResponseType<T> = { status: 'ok'; detail: T } | FetchError | LoadingState;

export type {
  CameraData,
  FetchError,
  FileInfo,
  FileOrigin,
  FileType,
  Inference,
  InferenceTypes,
  InferenceModelDict,
  GetFilesListResponse,
  GetProcessingConfigurationResponse,
  GetProjectResponse,
  GpsData,
  LoadingState,
  MediaData,
  ProcessingConfiguration,
  Project,
  ProjectItem,
  ProjectParsingState,
  ResponseType,
  RoadData,
};
