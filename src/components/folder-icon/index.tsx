import { MinusIcon } from '@radix-ui/react-icons';
import styles from './style.module.css';

const FolderIcon = ({ isOpen }: { isOpen: boolean }) => (
  <div className={`${styles.iconStack} ${isOpen ? styles.open : ''}`}>
    <MinusIcon />
    <MinusIcon />
  </div>
);

export { FolderIcon };
