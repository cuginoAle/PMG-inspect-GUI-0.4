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
type GetProcessingConfigurationResponse =
  | {
      status: 'ok';
      detail: {
        processing_configurations: ProcessingConfiguration;
        inference_model_ids: InferenceModelDict; // Maybe this prop could be renamed to inference_model_dictionary
      };
    }
  | FetchError
  | LoadingState;

type ResponseType<T> = { status: 'ok'; detail: T } | FetchError | LoadingState;

type GetAnalysisResultResponse =
  // TODO: update with OpenApi spec
  { status: 'ok'; detail: DummyAnalysisResult[] } | FetchError | LoadingState;

type Network = {
  // TODO: update with OpenApi spec
  network_name: string;
} & Inference;

type DummyAnalysisResult = {
  // TODO: update with OpenApi spec
  setting_id: string;
  setting_label: string;
  setting_details: Array<Network>;
  frame_rate: {
    fps?: number;
    distance?: number;
  };
  analysed_video_list: {
    video_url: string;
    frames: {
      index: number;
      pci_score_value: number | null;
      pci_score_state: 'ok' | 'error';
    };
  };
};

export type {
  CameraData,
  DummyAnalysisResult, // TODO: update with OpenApi spec
  FetchError,
  FileInfo,
  FileOrigin,
  FileType,
  GetAnalysisResultResponse,
  GetFilesListResponse,
  GetProcessingConfigurationResponse,
  GetProjectResponse,
  GpsData,
  Inference,
  InferenceModelDict,
  InferenceTypes,
  LoadingState,
  MediaData,
  Network, // TODO: update with OpenApi spec
  ProcessingConfiguration,
  Project,
  ProjectItem,
  ProjectParsingState,
  ResponseType,
  RoadData,
};
