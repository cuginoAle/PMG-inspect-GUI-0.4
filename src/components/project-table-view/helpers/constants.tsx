import type { ProjectParsingState } from '@/src/types';
import { TextProps } from '@radix-ui/themes';
import { CheckCircledIcon, UpdateIcon } from '@radix-ui/react-icons';
import { DownloadIcon } from '@/src/components';

const parsingMap: Record<ProjectParsingState, React.ReactNode> = {
  downloading: <DownloadIcon size={1.8} className="downloading" />,
  download_ready: <DownloadIcon size={1.8} className="downloading" />,
  enqueued: <UpdateIcon width={18} height={18} className="spinning" />,
  ready: <CheckCircledIcon width={18} height={18} />,
  download_error: <DownloadIcon size={1.8} />,
  road_data_error: <UpdateIcon width={18} height={18} />,
  media_data_error: <UpdateIcon width={18} height={18} />,
  camera_data_error: <UpdateIcon width={18} height={18} />,
  gps_points_error: <UpdateIcon width={18} height={18} />,
};

const statusColorsMap: Record<ProjectParsingState, TextProps['color']> = {
  download_error: 'red',
  downloading: 'blue',
  download_ready: 'blue',
  enqueued: 'blue',
  road_data_error: 'red',
  media_data_error: 'red',
  camera_data_error: 'red',
  gps_points_error: 'red',
  ready: 'green',
};

const statusTitleMap: Record<ProjectParsingState, string> = {
  download_error: 'Download error',
  downloading: 'Dowloading...',
  download_ready: 'Download ready',
  enqueued: 'Enqueued for processing',
  road_data_error: 'Error processing road data',
  media_data_error: 'Error processing media data',
  camera_data_error: 'Error processing camera data',
  gps_points_error: 'Error processing GPS data',
  ready: 'Ready',
};
export { parsingMap, statusColorsMap, statusTitleMap };
