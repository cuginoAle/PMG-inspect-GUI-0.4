import { FileInfo } from '@/src/types';
import { Flex, Text } from '@radix-ui/themes';
import { NodeApi } from 'react-arborist';
import { FolderIcon } from 'components/folder-icon';
import styles from './style.module.css';

const FolderItem = ({
  node,
  itemInfo,
  className,
}: {
  node: NodeApi;
  itemInfo: FileInfo;
  className?: string;
}) => {
  const subItemCount = 'content' in itemInfo ? itemInfo.content?.length : 0;

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        node.toggle();
        node.select();
      }}
    >
      <Flex gap={'2'} align="center" className={className}>
        <span className={styles.iconWrapper}>
          <FolderIcon isOpen={node.isOpen} />
        </span>
        <Flex gap={'2'} align="center">
          <Text size="2">{itemInfo.name}</Text>
          <Text size="1" color="gray">
            {`(${subItemCount})`}
          </Text>
        </Flex>
      </Flex>
    </button>
  );
};

export { FolderItem };
