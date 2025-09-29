import { Tab } from '@/src/components/presets-tabs';
import { ProjectAnalysisDashboard } from '@/src/components/project-analysis-dashboard';
import { ProjectTableViewContainer } from '@/src/containers/project-table-view-container';
import { Button, Flex, IconButton, Separator } from '@radix-ui/themes';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import styles from './style.module.css';
import { PinBottomIcon, PinTopIcon, RocketIcon } from '@radix-ui/react-icons';

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

  const [tableExpanded, setTableExpanded] = React.useState(false);

  // TODO: uncomment this
  // tabs.map((tab) => tab.id);

  return (
    <>
      {!tableExpanded && (
        <ProjectAnalysisDashboard
          settingId={tabs[0]!.id}
          onChange={onChange}
          onSave={onSave}
          onReset={onReset}
          hasUnsavedChanges={tabs[0]!.hasUnsavedChanges}
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
      </div>

      <Flex justify={'center'}>
        <Button
          className={styles.runAnalysisButton}
          type="button"
          size={'3'}
          color="blue"
          variant="soft"
        >
          <RocketIcon /> Run analysis
        </Button>
      </Flex>
    </>
  );
};

export { PresetsTabsContent };
