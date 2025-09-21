import { FileIconType } from 'components/file-icon';

const images = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp', 'svg'];
const videos = ['mp4', 'mov', 'avi', 'mkv', 'flv', 'wmv', 'webm', 'mpeg'];
const excel = ['xls', 'xlsx', 'csv'];

const getFileIconType = (filePath: string): FileIconType => {
  const parts = filePath.split('.');
  if (!parts || parts.length === 0) return 'other';
  const ext = parts[parts.length - 1];
  if (!ext) return 'other';
  const lowerExt = ext.toLowerCase();
  if (images.includes(lowerExt)) return 'image';
  if (videos.includes(lowerExt)) return 'video';
  if (excel.includes(lowerExt)) return 'project';
  return 'other';
};
export { getFileIconType };
