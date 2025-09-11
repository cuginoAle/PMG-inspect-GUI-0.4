import { Flex } from '@radix-ui/themes';
import { NodeApi } from 'react-arborist';
import styles from './style.module.css';
import { Text } from '@radix-ui/themes';
import { FileInfo } from '@/src/types';
import { FileIcon } from './file-icon';
import { FolderIcon } from './folder-icon';

const TreeViewNode = ({ node }: { node: NodeApi }) => {
  const rootCn = `${styles.root} ${node.isSelected ? styles.selected : ''}`;

  const itemInfo: FileInfo = node.data;
  const subItemCount = 'content' in itemInfo ? itemInfo.content?.length : 0;

  return (
    <Flex gap={'2'} align="center" className={rootCn}>
      <span className={styles.iconWrapper}>
        {node.isLeaf ? (
          <FileIcon type={node.data.file_type} />
        ) : (
          <FolderIcon
            isOpen={node.isOpen}
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              node.toggle();
            }}
          />
        )}
      </span>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (node.isInternal) node.toggle();
          if (node.isLeaf) node.select();
        }}
        className={styles.name}
      >
        <Flex gap={'2'} align="center">
          <Text size="2">{itemInfo.name}</Text>
          <Text size="1" color="gray">
            {node.isLeaf ? null : `(${subItemCount})`}
          </Text>
        </Flex>
      </button>
    </Flex>
  );
};

export { TreeViewNode };
