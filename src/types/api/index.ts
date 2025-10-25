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
};
// type Inference = components['schemas']['Inference'];
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

// type InferenceModelDict = Record<InferenceTypes, string[]>; // TODO: this should come from the OpenAPI!

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
// type GetProcessingConfigurationResponse =
//   | {
//       status: 'ok';
//       detail: ProcessingConfiguration;
//     }
//   | FetchError
//   | LoadingState;

type ResponseType<T> = { status: 'ok'; detail: T } | FetchError | LoadingState;

type GetPciScoreResponse =
  | { status: 'ok'; detail: ProcessingConfiguration }
  | FetchError
  | LoadingState;

// type GetAnalysisResultResponse =
//   // TODO: update with OpenApi spec
//   { status: 'ok'; detail: DummyAnalysisResult[] } | FetchError | LoadingState;

// type Network = {
//   // TODO: update with OpenApi spec
//   network_name: string;
// } & Inference;

// type DummyAnalysisResult = {
//   // TODO: update with OpenApi spec
//   setting_id: string;
//   setting_label: string;
//   setting_details: Array<Network>;
//   frame_rate: {
//     fps?: number;
//     distance?: number;
//   };
//   analysed_video_list: {
//     video_url: string;
//     frames: {
//       index: number;
//       pci_score_value: number | null;
//       pci_score_state: 'ok' | 'error';
//     };
//   };
// };

export type {
  CameraData,
  // DummyAnalysisResult, // TODO: update with OpenApi spec
  FetchError,
  FileInfo,
  FileOrigin,
  FileType,
  GetFilesListResponse,
  // GetProcessingConfigurationResponse,
  GetPciScoreResponse,
  GetProjectResponse,
  GetProjectStatusResponse,
  GetInferenceModelResponse,
  GpsData,
  // Inference,
  // InferenceModelDict,
  InferenceTypes,
  InferenceModel,
  LoadingState,
  MediaData,
  // Network, // TODO: update with OpenApi spec
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
