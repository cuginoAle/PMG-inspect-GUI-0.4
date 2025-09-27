import { MixerHorizontalIcon } from '@radix-ui/react-icons';
import { DropdownMenu, Button } from '@radix-ui/themes';
import styles from './style.module.css';

const PresetsDropDown = () => {
  return (
    <div className={styles.root}>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="soft" size={'3'}>
            <MixerHorizontalIcon width={20} height={20} />
            Load a preset
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>PCI 01</DropdownMenu.Item>
          <DropdownMenu.Item>PCI 02</DropdownMenu.Item>
          <DropdownMenu.Item>PCI 03</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
};

export { PresetsDropDown };
