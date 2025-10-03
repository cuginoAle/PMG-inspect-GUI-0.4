import { Flex, Tabs } from '@radix-ui/themes';
import {
  FileLogoTitle,
  LoadingToast,
  PresetsTabs,
  Tab,
  Warning,
} from '@/src/components';

import React, { useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { getFileIconType } from '@/src/helpers/get-file-icon-type';
import { removeFileExtension } from '@/src/helpers/remove-file-extension';
import { PresetsTabsContent } from './presets-tabs-content';
import { useGlobalState } from '@/src/app/global-state';
import { getResponseIfSuccesful } from '@/src/helpers/get-response-if-successful';

const LeftPane = () => {
  const { processingConfigurations, selectedInferenceSettingId } =
    useGlobalState();
  const processingConfigurationsFetchState = processingConfigurations.get();
  const processingConfigurationsValue = getResponseIfSuccesful(
    processingConfigurationsFetchState,
  )?.processing_configurations;

  const selectedInferenceSettingIdSetter = selectedInferenceSettingId.set;

  const [tabs, setTabs] = React.useState<Tab[]>([]);

  useEffect(() => {
    const firstTabId = processingConfigurationsValue
      ? Object.keys(processingConfigurationsValue)[0]
      : undefined;

    selectedInferenceSettingIdSetter(firstTabId);
  }, [selectedInferenceSettingIdSetter, processingConfigurationsValue]);

  const sp = useSearchParams();
  const projectPath = sp.get('path') || '';

  const fileType = useMemo(() => getFileIconType(projectPath), [projectPath]);
  const label = useMemo(() => removeFileExtension(projectPath), [projectPath]);

  const handleOnChange = (tabId: string) => {
    const prevTab = tabs.find((tab) => tab.id === tabId);
    if (!prevTab) return;
    if (prevTab.hasUnsavedChanges) return; // no need to update if already has unsaved changes
    const newTab = { ...prevTab, hasUnsavedChanges: true };
    setTabs((prevTabs) =>
      prevTabs.map((tab) => (tab.id === tabId ? newTab : tab)),
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

  useEffect(() => {
    if (processingConfigurationsFetchState?.status !== 'ok') return;
    const newTabs: Tab[] = Object.keys(processingConfigurationsValue || {}).map(
      (key) => ({
        id: key,
        label: processingConfigurationsValue![key]!.label,
        hasUnsavedChanges: false,
        inferences: processingConfigurationsValue![key]!
          .inferences as Tab['inferences'], // TODO: fix this!
      }),
    );

    setTabs(newTabs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processingConfigurationsFetchState?.status]);

  if (
    processingConfigurationsFetchState?.status === 'loading' ||
    tabs.length === 0
  ) {
    return (
      <div className="center">
        <LoadingToast message="Loading processing configurations..." />
      </div>
    );
  }

  return processingConfigurationsFetchState?.status === 'error' ? (
    <Warning message="No processing configuration found." />
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

        <PresetsTabs
          tabs={tabs}
          onTabClick={selectedInferenceSettingIdSetter}
        />
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
