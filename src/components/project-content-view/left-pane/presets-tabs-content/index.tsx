import { Tab } from '@/src/components/presets-tabs';
import { ProjectAnalysisDashboard } from '@/src/components/project-analysis-dashboard';
import { ProjectTableViewContainer } from '@/src/containers/project-table-view-container';
import { Button, Flex, IconButton, Separator, Tabs } from '@radix-ui/themes';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import styles from './style.module.css';
import { PinBottomIcon, PinTopIcon, RocketIcon } from '@radix-ui/react-icons';
import { useGlobalState } from '@/src/app/global-state';

type PresetsTabsContentProps = {
  tabs: Tab[];
  onChange?: (tabId: string) => void;
  onSave?: (data: FormData) => void;
  onReset?: (tabId: string) => void;
};
const PresetsTabsContent = ({
  tabs,
  onChange,
  onSave,
  onReset,
}: PresetsTabsContentProps) => {
  const sp = useSearchParams();
  const projectPath = sp.get('path') || '';
  const { selectedVideoUrlList, selectedInferenceSettingId } = useGlobalState();
  const selectedVideoUrlListValue = selectedVideoUrlList.get();
  const selectedInferenceSettingIdValue =
    selectedInferenceSettingId.get() || '';

  const selectedVideos =
    selectedVideoUrlListValue?.[selectedInferenceSettingIdValue] || [];

  const [tableExpanded, setTableExpanded] = React.useState(false);

  return (
    <>
      {tabs.map((tab) => {
        return (
          <Tabs.Content key={tab.id} value={tab.id} forceMount>
            <Flex direction={'column'} gap={'6'} height={'100%'}>
              {!tableExpanded && (
                <ProjectAnalysisDashboard
                  settingId={tab.id}
                  onChange={onChange}
                  onSave={onSave}
                  onReset={onReset}
                  hasUnsavedChanges={tab.hasUnsavedChanges}
                />
              )}

              {!tableExpanded && projectPath && (
                <Separator
                  className={styles.mainContentSeparator}
                  size={'4'}
                  orientation="horizontal"
                  color="amber"
                />
              )}

              <div className={styles.projectTableWrapper}>
                {projectPath && (
                  <IconButton
                    onClick={() => setTableExpanded(!tableExpanded)}
                    variant="soft"
                    className={styles.pinButton}
                    title="Toggle Table Expansion"
                  >
                    {tableExpanded ? <PinBottomIcon /> : <PinTopIcon />}
                  </IconButton>
                )}
                <ProjectTableViewContainer />

                <Flex justify={'center'}>
                  <Button
                    className={styles.runAnalysisButton}
                    type="button"
                    size={'3'}
                    color="blue"
                    variant="soft"
                    disabled={selectedVideos.length === 0}
                  >
                    <RocketIcon /> Run analysis
                  </Button>
                </Flex>
              </div>
            </Flex>
          </Tabs.Content>
        );
      })}
    </>
  );
};

export { PresetsTabsContent };
