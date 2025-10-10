import { PlusCircledIcon } from '@radix-ui/react-icons';
import styles from './style.module.css';

const AddNetworkButton = () => {
  return (
    <button type="button" className={styles.root}>
      <PlusCircledIcon width={32} height={32} /> Add Network
    </button>
  );
};

export { AddNetworkButton };
