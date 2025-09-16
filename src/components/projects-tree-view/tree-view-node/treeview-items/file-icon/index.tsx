import {
  ImageIcon,
  LayersIcon,
  VideoIcon,
  FileIcon as RadixFileIcon,
} from '@radix-ui/react-icons';
import styles from './style.module.css';

const fileIconMap = {
  project: LayersIcon,
  image: ImageIcon,
  video: VideoIcon,
};

type FileType = keyof typeof fileIconMap;

const FileIcon = ({ type }: { type: FileType }) => {
  const Icon = fileIconMap[type] || RadixFileIcon;
  return (
    <div className={`${styles.root} ${styles[type]}`}>
      <Icon />
    </div>
  );
};

export { FileIcon };
