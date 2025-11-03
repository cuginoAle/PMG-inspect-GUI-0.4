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
type Project = components['schemas']['ProjectInventory'];
type AugmentedProjectItemData = ProjectItem & {
  selected_configuration?: components['schemas']['ProcessingConfiguration-Input']['processing_configuration_name'];
};
type AugmentedProject = Project & {
  items: Record<string, AugmentedProjectItemData>;
  processing_configurations?: Record<
    string,
    components['schemas']['ProcessingConfiguration-Output']
  >;
  aiPciScores?: Record<string, number | null>;
};

type ProjectStatus = components['schemas']['ProjectStatus'];
type ProjectItem = components['schemas']['VideoCaptureData'];
type RoadData = components['schemas']['RoadData'];
type CameraData = components['schemas']['CameraData'];
type MediaData = components['schemas']['MediaData'];
type GpsData = components['schemas']['GpsPoint'];

type InferenceModel = components['schemas']['InferenceModel'];
type InferenceTypes = components['schemas']['InferenceType'];
type ProcessingConfiguration =
  components['schemas']['ProcessingConfiguration-Output'];

type ProjectParsingState = components['schemas']['VideoStatus'];

type PciScore = Record<string, number | null>; // TODO: update with OpenApi spec once available

type GetInferenceModelResponse =
  | {
      status: 'ok';
      detail: InferenceModel[];
    }
  | FetchError
  | LoadingState;

type GetProjectStatusResponse =
  | { status: 'ok'; detail: ProjectStatus }
  | FetchError
  | LoadingState;
type GetFilesListResponse =
  | { status: 'ok'; detail: Array<FileInfo> }
  | FetchError
  | LoadingState;
type GetProjectResponse =
  | { status: 'ok'; detail: Project }
  | FetchError
  | LoadingState;

type GetAugmentedProjectResponse =
  | { status: 'ok'; detail: AugmentedProject }
  | FetchError
  | LoadingState;

type ResponseType<T> = { status: 'ok'; detail: T } | FetchError | LoadingState;

type GetPciScoreResponse =
  | { status: 'ok'; detail: ProcessingConfiguration }
  | FetchError
  | LoadingState;

export type {
  CameraData,
  FetchError,
  FileInfo,
  FileOrigin,
  FileType,
  GetFilesListResponse,
  GetAugmentedProjectResponse,
  GetPciScoreResponse,
  GetProjectResponse,
  GetProjectStatusResponse,
  GetInferenceModelResponse,
  GpsData,
  InferenceTypes,
  InferenceModel,
  LoadingState,
  MediaData,
  PciScore,
  ProcessingConfiguration,
  Project,
  AugmentedProject,
  ProjectStatus,
  AugmentedProjectItemData,
  ProjectItem,
  ProjectParsingState,
  ResponseType,
  RoadData,
};
