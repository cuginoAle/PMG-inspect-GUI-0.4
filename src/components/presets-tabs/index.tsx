import { PlusCircledIcon } from '@radix-ui/react-icons';
import { IconButton, Tabs } from '@radix-ui/themes';
import styles from './style.module.css';
import { ThreeVertDots } from '@/src/components/custom-icons';
import classNames from 'classnames';
import { DummyAnalysisResult } from '@/src/types';

type Tab = {
  id: string;
  label: string;
  inferences: DummyAnalysisResult['setting_details'];
};
type PresetsTabsProps = {
  data?: DummyAnalysisResult[];
  onMenuClick?: (tabId: string) => void;
  onTabClick?: (tabId: string) => void;
  unsavedTabIds?: string[];
  onAddClick?: () => void;
};

const PresetsTabs = ({
  data,
  onMenuClick,
  onTabClick,
  unsavedTabIds,
  onAddClick,
}: PresetsTabsProps) => {
  const tabs: Tab[] =
    data?.map((item) => ({
      id: item.setting_id,
      label: item.setting_label,
      hasUnsavedChanges: false,
      inferences: item.setting_details,
    })) || [];
  if (!tabs) return null;

  return (
    <Tabs.List size="2">
      {tabs.map((tab) => {
        const tabCn = classNames(styles.tabWrapper, {
          [styles.unsavedChanges]: unsavedTabIds?.includes(tab.id),
        });

        return (
          <div key={tab.id} className={tabCn}>
            <Tabs.Trigger value={tab.id} onClick={() => onTabClick?.(tab.id)}>
              {tab.label}
            </Tabs.Trigger>
            <IconButton
              variant="ghost"
              className={styles.tabMenuButton}
              onClick={() => {
                onMenuClick?.(tab.id);
              }}
            >
              <ThreeVertDots size={1.4} />
            </IconButton>
          </div>
        );
      })}

      {/* Hardcoded tabs for demo purposes; replace with dynamic rendering as needed */}
      <Tabs.Trigger
        onClick={() => {
          onAddClick?.();
        }}
        value="new"
      >
        <PlusCircledIcon />
      </Tabs.Trigger>
    </Tabs.List>
  );
};

export { PresetsTabs };
export type { Tab };
