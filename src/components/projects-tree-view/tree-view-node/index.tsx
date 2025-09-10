import { Flex } from '@radix-ui/themes';
import { NodeApi } from 'react-arborist';
import styles from './style.module.css';
import { Text } from '@radix-ui/themes';
import { DirectoryInfo, FileInfo } from '@/src/types';
import { Extension, FileIcon } from './file-icon';
import { FolderIcon } from './folder-icon';

const TreeViewNode = ({ node }: { node: NodeApi }) => {
  const rootCn = `${styles.root} ${node.isSelected ? styles.selected : ''}`;

  const itemInfo: FileInfo | DirectoryInfo = node.data;
  const extension = (itemInfo.name.split('.').pop() || '') as Extension;

  return (
    <Flex gap={'2'} align="center" className={rootCn}>
      <span className={styles.iconWrapper}>
        {node.isLeaf ? (
          <FileIcon ext={extension} />
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
        <Text size="2">{itemInfo.name}</Text>
      </button>
    </Flex>
  );
};

export { TreeViewNode };
