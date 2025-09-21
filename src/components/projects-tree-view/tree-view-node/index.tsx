import { NodeApi } from 'react-arborist';
import styles from './style.module.css';
import { FileInfo } from '@/src/types';
import { FileItem } from './treeview-items/file-item';
import { FolderItem } from './treeview-items/folder-item';

const TreeViewNode = ({ node }: { node: NodeApi }) => {
  const rootCn = `${styles.root} ${node.isSelected ? styles.selected : ''}`;
  const itemInfo: FileInfo = node.data;

  return node.isLeaf ? (
    <FileItem itemInfo={itemInfo} className={rootCn} />
  ) : (
    <FolderItem node={node} itemInfo={itemInfo} className={rootCn} />
  );
};

export { TreeViewNode };
