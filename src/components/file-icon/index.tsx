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
  other: RadixFileIcon,
};

type FileIconType = keyof typeof fileIconMap & string;

const FileIcon = ({ type }: { type: FileIconType }) => {
  const Icon = fileIconMap[type] || RadixFileIcon;
  return (
    <span className={`${styles.root} ${styles[type]}`}>
      <Icon />
    </span>
  );
};

export { FileIcon };
export type { FileIconType };
