import { PlusCircledIcon } from '@radix-ui/react-icons';
import styles from './style.module.css';

const AddNetworkButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button type="button" className={styles.root} onClick={onClick}>
      <PlusCircledIcon width={32} height={32} /> Add neural network
    </button>
  );
};

export { AddNetworkButton };
