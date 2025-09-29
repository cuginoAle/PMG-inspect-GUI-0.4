import { PlusCircledIcon } from '@radix-ui/react-icons';
import { IconButton, Tabs } from '@radix-ui/themes';
import styles from './style.module.css';
import { ThreeVertDots } from '@/src/components/custom-icons';

type Tab = {
  id: string;
  label: string;
  hasUnsavedChanges?: boolean;
  values: any[]; // replace it with actual type when available
};
type PresetsTabsProps = {
  tabs: Tab[];
  onMenuClick?: (tabId: string) => void;
};

const PresetsTabs = ({ tabs, onMenuClick }: PresetsTabsProps) => {
  if (!tabs || tabs.length === 0) return null;

  return (
    <Tabs.Root
      defaultValue="PCI_01"
      orientation="horizontal"
      className={styles.root}
    >
      <Tabs.List size="2">
        {tabs.map((tab) => {
          const tabCn = `${styles.tabWrapper} ${
            tab.hasUnsavedChanges ? styles.unsavedChanges : ''
          }`;
          return (
            <div key={tab.id} className={tabCn}>
              <Tabs.Trigger value={tab.id}>{tab.label}</Tabs.Trigger>
              <IconButton
                variant="ghost"
                className={styles.tabMenuButton}
                onClick={() => onMenuClick?.(tab.id)}
              >
                <ThreeVertDots size={1.4} />
              </IconButton>
            </div>
          );
        })}

        {/* Hardcoded tabs for demo purposes; replace with dynamic rendering as needed */}
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
export type { Tab };
