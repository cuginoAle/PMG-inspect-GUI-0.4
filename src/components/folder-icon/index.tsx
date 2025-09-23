import { MinusIcon } from '@radix-ui/react-icons';
import styles from './style.module.css';

import { Flex } from '@radix-ui/themes';

const FolderIcon = ({ isOpen }: { isOpen: boolean }) => (
  <Flex gap={'2'} align="center">
    <div className={`${styles.iconStack} ${isOpen ? styles.open : ''}`}>
      <MinusIcon />
      <MinusIcon />
    </div>
  </Flex>
);

export { FolderIcon };
