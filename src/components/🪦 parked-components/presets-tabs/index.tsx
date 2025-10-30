import { PlusCircledIcon } from '@radix-ui/react-icons';
import { Flex, IconButton, Tabs, DropdownMenu } from '@radix-ui/themes';
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

const tabContextMenu = [
  {
    id: 'rename',
    label: 'Rename',
  },

  {
    id: 'delete',
    label: 'Delete',
  },
];

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

            <DropdownMenu.Root>
              <DropdownMenu.Trigger className={styles.tabMenuButton}>
                <IconButton variant="ghost">
                  <ThreeVertDots size={1.4} />
                </IconButton>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                {tabContextMenu.map((menu) => (
                  <DropdownMenu.Item
                    key={menu.id}
                    onSelect={() => onMenuClick?.(tab.id)}
                  >
                    {menu.label}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        );
      })}

      <Tabs.Trigger onClick={onAddClick} value="new">
        <Flex align="center" gap="2">
          <PlusCircledIcon /> New setting
        </Flex>
      </Tabs.Trigger>
    </Tabs.List>
  );
};

export { PresetsTabs };
export type { Tab };
