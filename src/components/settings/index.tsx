import { GearIcon } from '@radix-ui/react-icons';
import { IconButton } from '@radix-ui/themes';
import styles from './style.module.css';

const Settings = () => {
  return (
    <IconButton
      variant="soft"
      size="3"
      title="Settings"
      className={styles.root}
    >
      <GearIcon width={24} height={24} />
    </IconButton>
  );
};

export { Settings };
