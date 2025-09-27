import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { IconButton, Select } from '@radix-ui/themes';
import styles from './style.module.css';

const ProjectPresets = () => {
  return (
    <div className={styles.root}>
      <Select.Root size={'3'} defaultValue="setting-01">
        <Select.Trigger
          color="amber"
          variant="soft"
          className={styles.trigger}
        />

        <Select.Content position="popper" align="start">
          <Select.Group>
            <Select.Item value="setting-01">Setting 01</Select.Item>
            <Select.Item value="setting-02">Setting 02</Select.Item>
            <Select.Item value="setting-03">Setting 03</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>

      <IconButton variant="soft" color="amber" size="3" aria-label="Add preset">
        <DotsVerticalIcon />
      </IconButton>
    </div>
  );
};

export { ProjectPresets };
