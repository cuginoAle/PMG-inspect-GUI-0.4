import { GetAnalysisResultResponse } from '@/src/types';

const analysisResultsDummy = {
  status: 'ok',
  detail: [
    {
      setting_id: 'default_setting_1',
      setting_label: 'Default Configuration',
      setting_details: [
        {
          network_name: 'road',
          inference_model_id: 'road_model',
          inference_model_parameters: {
            confidence: 0.75,
            iou: 0.45,
          },
        },
        {
          network_name: 'distress',
          inference_model_id: 'distress_severity_ver1',
          inference_model_parameters: {
            confidence: 0.8,
            iou: 0.5,
          },
        },
        {
          network_name: 'weathering',
          inference_model_id: 'weathering_old_model',
          inference_model_parameters: {
            confidence: 0.85,
            iou: 0.55,
          },
        },
        {
          network_name: 'treatment',
          inference_model_id: 'treatment_model',
          inference_model_parameters: {
            confidence: 0.88,
            iou: 0.58,
          },
        },
      ],
      frame_rate: {
        fps: 30,
        distance: 5.5,
      },
      analysed_video_list: {
        video_url: '/dummy/video/path.mp4',
        frames: {
          index: 0,
          pci_score_value: 85.5,
          pci_score_state: 'ok',
        },
      },
    },
    {
      setting_id: 'high_accuracy_setting',
      setting_label: 'High Accuracy Configuration',
      setting_details: [
        {
          network_name: 'road',
          inference_model_id: 'road_model',
          inference_model_parameters: {
            confidence: 0.9,
            iou: 0.6,
          },
        },
        {
          network_name: 'distress',
          inference_model_id: 'distress_severity_ver3',
          inference_model_parameters: {
            confidence: 0.92,
            iou: 0.65,
          },
        },
        {
          network_name: 'weathering',
          inference_model_id: 'weathering_old_model',
          inference_model_parameters: {
            confidence: 0.85,
            iou: 0.55,
          },
        },
        {
          network_name: 'treatment',
          inference_model_id: 'treatment_model',
          inference_model_parameters: {
            confidence: 0.88,
            iou: 0.58,
          },
        },
      ],
      frame_rate: {
        fps: 25,
        distance: 3.0,
      },
      analysed_video_list: {
        video_url: '/dummy/video/path2.mp4',
        frames: {
          index: 0,
          pci_score_value: 92.3,
          pci_score_state: 'ok',
        },
      },
    },
  ],
} as GetAnalysisResultResponse;
export { analysisResultsDummy };
