import { FileInfo } from '@/src/types';
import { FileIcon } from 'components/file-icon';
import { Flex, Text } from '@radix-ui/themes';
import Link from 'next/link';
import styles from './style.module.css';

const FileItem = ({
  itemInfo,
  className,
}: {
  itemInfo: FileInfo;
  className?: string;
}) => {
  return (
    <Link
      href={{
        query: { path: itemInfo.relative_path! },
      }}
    >
      <Flex gap={'2'} align="center" className={className}>
        <span className={styles.iconWrapper}>
          <FileIcon
            type={itemInfo.file_type as 'project' | 'video' | 'image'}
          />
        </span>

        <Flex gap={'2'} align="center">
          <Text size="2">{itemInfo.name}</Text>
        </Flex>
      </Flex>
    </Link>
  );
};

export { FileItem };
