import { NodeApi } from 'react-arborist';
import styles from './style.module.css';
import { FileInfo } from '@/src/types';
import { FileItem } from './treeview-items/file-item';
import { FolderItem } from './treeview-items/folder-item';
import classNames from 'classnames';

const TreeViewNode = ({ node }: { node: NodeApi }) => {
  const rootCn = classNames(styles.root, {
    [styles.selected]: node.isSelected,
  });
  const itemInfo: FileInfo = node.data;

  return node.isLeaf ? (
    <FileItem itemInfo={itemInfo} className={rootCn} />
  ) : (
    <FolderItem node={node} itemInfo={itemInfo} className={rootCn} />
  );
};

export { TreeViewNode };
