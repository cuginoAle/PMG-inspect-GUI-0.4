import { GetAnalysisResultResponse } from '@/src/types';

const analysisResultsDummy = {
  status: 'ok',
  detail: [
    {
      setting_id: 'default_setting_1',
      setting_label: 'Default Configuration',
      setting_details: [
        {
          network_name: 'Road Detection Network',
          inference_model_id: 'road_model_v1',
          inference_model_parameters: {
            confidence: 0.75,
            iou: 0.45,
          },
        },
        {
          network_name: 'Distress Detection Network',
          inference_model_id: 'distress_model_v1',
          inference_model_parameters: {
            confidence: 0.8,
            iou: 0.5,
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
          network_name: 'Advanced Road Detection',
          inference_model_id: 'road_model_v2',
          inference_model_parameters: {
            confidence: 0.9,
            iou: 0.6,
          },
        },
        {
          network_name: 'Advanced Distress Detection',
          inference_model_id: 'distress_model_v2',
          inference_model_parameters: {
            confidence: 0.92,
            iou: 0.65,
          },
        },
        {
          network_name: 'Pothole Detection',
          inference_model_id: 'pothole_model_v1',
          inference_model_parameters: {
            confidence: 0.85,
            iou: 0.55,
          },
        },
        {
          network_name: 'Crack Detection',
          inference_model_id: 'crack_model_v1',
          inference_model_parameters: {
            confidence: 0.88,
            iou: 0.58,
          },
        },
        {
          network_name: 'Debris Detection',
          inference_model_id: 'debris_model_v1',
          inference_model_parameters: {
            confidence: 0.8,
            iou: 0.5,
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
