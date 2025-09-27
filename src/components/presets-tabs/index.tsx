import { PlusCircledIcon } from '@radix-ui/react-icons';
import { Tabs } from '@radix-ui/themes';
import styles from './style.module.css';

const PresetsTabs = () => {
  return (
    <Tabs.Root
      defaultValue="PCI_01"
      orientation="horizontal"
      className={styles.root}
    >
      <Tabs.List size="2">
        <Tabs.Trigger value="PCI_01">PCI 01</Tabs.Trigger>
        <Tabs.Trigger value="PCI_02">Test A</Tabs.Trigger>
        <Tabs.Trigger value="PCI_03">Test B</Tabs.Trigger>
        <Tabs.Trigger
          onClick={() => {
            alert('create a new tab!');
          }}
          value="new"
        >
          <PlusCircledIcon />
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  );
};

export { PresetsTabs };
