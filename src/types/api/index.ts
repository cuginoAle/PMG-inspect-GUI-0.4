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
  aiPciScores?: PciScore[string][string];
  avgPciScore?: number | null;
  avgTreatment?: string | null; // TODO: I would like to receive an enum here from the backend (processing_configuration.mappings))
  progress?: number | null;
};
type AugmentedProject = Project & {
  items: Record<string, AugmentedProjectItemData>;
  processing_configurations?: Record<
    string,
    components['schemas']['ProcessingConfiguration-Output']
  >;
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
  components['schemas']['ProcessingConfiguration-Output']; // the mappings prop should be an enum of strings representing treatment types

type ProjectParsingState = components['schemas']['VideoStatus'];

type PciScore = Record<
  string,
  Record<
    string,
    Record<string, components['schemas']['InferenceDerivedResult'] | null>
  >
>;

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

type GetBaseConfigurationsResponse =
  | { status: 'ok'; detail: ProcessingConfiguration[] }
  | FetchError
  | LoadingState;

type ResponseType<T> = { status: 'ok'; detail: T } | FetchError | LoadingState;

type GetAiPciScoreResponse =
  | { status: 'ok'; detail: PciScore }
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
  GetAiPciScoreResponse,
  GetProjectResponse,
  GetProjectStatusResponse,
  GetInferenceModelResponse,
  GetBaseConfigurationsResponse,
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
