import { Flex, Tabs } from '@radix-ui/themes';
import { FileLogoTitle, PresetsTabs, Tab, Warning } from '@/src/components';

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { getFileIconType } from '@/src/helpers/get-file-icon-type';
import { removeFileExtension } from '@/src/helpers/remove-file-extension';
import { PresetsTabsContent } from './presets-tabs-content';
import { useGlobalState } from '@/src/app/global-state';

const LeftPane = () => {
  const inferenceSettings = useGlobalState().inferenceSettings.get();

  const [tabs, setTabs] = React.useState<Tab[]>(
    Object.keys(inferenceSettings || {}).map((key: string) => ({
      id: key,
      label: (inferenceSettings as any)?.[key].label,
      hasUnsavedChanges: false,
      values: (inferenceSettings as any)[key].parameters,
    })),
  );

  const sp = useSearchParams();
  const projectPath = sp.get('path') || '';

  const fileType = useMemo(() => getFileIconType(projectPath), [projectPath]);
  const label = useMemo(() => removeFileExtension(projectPath), [projectPath]);

  const handleOnChange = (tabId: string) => {
    const tab = tabs.find((t) => t.id === tabId);
    if (!tab) return;
    if (tab.hasUnsavedChanges) return;

    setTabs((prevTabs) =>
      prevTabs.map((tab) => ({
        ...tab,
        hasUnsavedChanges: tab.id === tabId ? true : tab.hasUnsavedChanges,
      })),
    );
  };

  const handleOnReset = (tabId: string) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => ({
        ...tab,
        hasUnsavedChanges: tab.id === tabId ? false : tab.hasUnsavedChanges,
      })),
    );
  };

  return tabs?.length === 0 ? (
    <Warning message="No inference settings found." />
  ) : (
    <Tabs.Root defaultValue={tabs[0]?.id} orientation="horizontal">
      <Flex direction={'column'} gap={'6'} height={'100%'}>
        {projectPath && (
          <FileLogoTitle
            as="div"
            fileType={fileType}
            label={label}
            size="medium"
            componentId="project-analysis-dashboard-file-title"
          />
        )}

        <PresetsTabs tabs={tabs} />
        <PresetsTabsContent
          tabs={tabs}
          onChange={handleOnChange}
          onReset={handleOnReset}
          onSave={(data) => {
            console.log(
              'save the current tab!',
              Object.fromEntries(data.entries()),
            );
          }}
        />
      </Flex>
    </Tabs.Root>
  );
};

export { LeftPane };
