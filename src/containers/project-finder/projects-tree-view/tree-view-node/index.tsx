import { LayersIcon, MinusIcon } from '@radix-ui/react-icons';
import { Flex } from '@radix-ui/themes';
import { NodeApi } from 'react-arborist';
import styles from './style.module.css';

const TreeViewNode = ({ node }: { node: NodeApi }) => {
  const iconCn = `${styles.iconWrapper} ${node.isOpen ? styles.open : ''}`;

  return (
    <Flex gap={'2'} align="center" style={{ cursor: 'pointer' }}>
      <span className={iconCn}>
        {node.isLeaf ? (
          <LayersIcon />
        ) : (
          <div className={styles.iconStack}>
            <MinusIcon />
            <MinusIcon />
          </div>
        )}
      </span>

      <span
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {node.data.name}
      </span>
    </Flex>
  );
};

export { TreeViewNode };
