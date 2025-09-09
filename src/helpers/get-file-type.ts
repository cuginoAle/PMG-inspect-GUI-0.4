type FileType = 'image' | 'video' | 'other';

const imageFileExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'];

const videoFileExtensions = ['.mp4', '.mov', '.avi', '.mkv'];

const getFileType = (fileName: string): FileType => {
  if (imageFileExtensions.some((ext) => fileName.endsWith(ext))) {
    return 'image';
  } else if (videoFileExtensions.some((ext) => fileName.endsWith(ext))) {
    return 'video';
  } else {
    return 'other';
  }
};

export { getFileType };
export type { FileType };
