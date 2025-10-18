import { ProjectAnalysisDashboard } from '@/src/components/project-analysis-dashboard';
import { ProjectTableViewContainer } from '@/src/containers/project-table-view-container';
import { Button, Flex, IconButton, Separator, Tabs } from '@radix-ui/themes';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import styles from './style.module.css';
import { PinBottomIcon, PinTopIcon, RocketIcon } from '@radix-ui/react-icons';
import { useGlobalState } from '@/src/app/global-state';
import { getResponseIfSuccesful } from '@/src/helpers/get-response-if-successful';
import { DummyAnalysisResult } from '@/src/types';
type PresetsTabsContentProps = {
  data: DummyAnalysisResult[];
  onChange?: (data: FormData) => void;
  onSave?: (data: FormData) => void;
  onReset?: (tabId: string) => void;
  unsavedTabIds?: string[];
};
const PresetsTabsContent = ({
  data,
  onChange,
  onSave,
  onReset,
  unsavedTabIds,
}: PresetsTabsContentProps) => {
  const sp = useSearchParams();
  const projectPath = sp.get('path') || '';
  const selectedVideoUrlList = useGlobalState(
    (state) => state.selectedVideoUrlList,
  );
  const selectedInferenceSettingIdValue = useGlobalState(
    (state) => state.selectedInferenceSettingId,
  );
  const selectedProjectData = useGlobalState((state) => state.selectedProject);

  const selectedProjectValue = getResponseIfSuccesful(selectedProjectData);

  const selectedVideos =
    selectedVideoUrlList?.[selectedInferenceSettingIdValue || ''] || [];

  const [tableExpanded, setTableExpanded] = React.useState(true);

  return (
    <>
      {data.map((setting) => {
        return (
          <Tabs.Content
            key={setting.setting_id}
            value={setting.setting_id}
            forceMount
          >
            <Flex direction={'column'} gap={'6'} height={'100%'}>
              {!tableExpanded && (
                <ProjectAnalysisDashboard
                  setting={setting as DummyAnalysisResult}
                  onChange={onChange}
                  onSave={onSave}
                  onReset={onReset}
                  hasUnsavedChanges={unsavedTabIds?.includes(
                    setting.setting_id,
                  )}
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

                {selectedProjectValue?.project_items.length && (
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
                )}
              </div>
            </Flex>
          </Tabs.Content>
        );
      })}
    </>
  );
};

export { PresetsTabsContent };
