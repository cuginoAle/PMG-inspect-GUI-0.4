import { Heading } from '@radix-ui/themes';
import { Responsive } from '@radix-ui/themes/props';
import { FileIcon, FileIconType } from 'components/file-icon';
import styles from './style.module.css';

type sizeType = 'small' | 'medium' | 'large';

const sizeMap: Record<sizeType, Responsive<'2' | '6' | '7'>> = {
  small: '2',
  medium: '6',
  large: '7',
};

const FileLogoTitle = ({
  fileType,
  label,
  size = 'small',
  className,
}: {
  fileType: FileIconType;
  label: string;
  size?: sizeType;
  className?: string;
}) => {
  return (
    <Heading size={sizeMap[size]} weight="light" as="h2" className={className}>
      <div className={styles.wrapper}>
        <FileIcon type={fileType} />
        <span className="ellipsis">{label}</span>
      </div>
    </Heading>
  );
};

export { FileLogoTitle };
