import { MinusIcon } from '@radix-ui/react-icons';
import styles from './style.module.css';

const FolderIcon = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => (
  <button
    className={`${styles.iconStack} ${isOpen ? styles.open : ''}`}
    onClick={onClick}
  >
    <MinusIcon />
    <MinusIcon />
  </button>
);

export { FolderIcon };
