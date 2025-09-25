import { Text } from '@radix-ui/themes';
import { Responsive } from '@radix-ui/themes/props';
import { FileIcon, FileIconType } from '@/src/components';
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
  as = 'p',
  componentId = 'file-logo-title',
}: {
  fileType: FileIconType;
  label: string;
  size?: sizeType;
  className?: string;
  as?: 'label' | 'span' | 'div' | 'p';
  componentId?: string;
}) => {
  return (
    <Text
      data-component-id={componentId}
      size={sizeMap[size]}
      weight="light"
      as={as}
      className={className}
    >
      <span className={styles.wrapper}>
        <FileIcon type={fileType} />
        <span className="ellipsis">{label}</span>
      </span>
    </Text>
  );
};

export { FileLogoTitle };
