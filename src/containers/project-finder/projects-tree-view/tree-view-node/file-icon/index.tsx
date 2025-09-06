import {
  ImageIcon,
  LayersIcon,
  VideoIcon,
  FileIcon as RadixFileIcon,
} from '@radix-ui/react-icons';
import styles from './style.module.css';

const fileIconMap = {
  json: LayersIcon,
  png: ImageIcon,
  jpg: ImageIcon,
  jpeg: ImageIcon,
  mp4: VideoIcon,
};

type Extension = keyof typeof fileIconMap;

const FileIcon = ({ ext }: { ext: Extension }) => {
  const Icon = fileIconMap[ext] || RadixFileIcon;
  return (
    <div className={`${styles.root} ${styles[ext]}`}>
      <Icon />
    </div>
  );
};

export { FileIcon };
export type { Extension };
