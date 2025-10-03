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
  const {
    processingConfigurations,
    selectedInferenceSettingId,
    editedProcessingConfigurations,
  } = useGlobalState();
  const processingConfigurationsFetchState = processingConfigurations.get();
  const processingConfigurationsValue = getResponseIfSuccesful(
    processingConfigurationsFetchState,
  )?.processing_configurations;

  const editedProcessingConfigurationsValue =
    editedProcessingConfigurations.get();

  const selectedInferenceSettingIdSetter = selectedInferenceSettingId.set;

  // const [tabs, setTabs] = React.useState<Tab[]>(
  //   Object.keys(processingConfigurationsValue || {}).map((key: string) => ({
  //     id: key,
  //     label: processingConfigurationsValue![key]!.label,
  //     hasUnsavedChanges: false,
  //     values: processingConfigurationsValue![key]!.inferences,
  //   })),
  // );

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
    if (!editedProcessingConfigurationsValue) return;
    const tab = Object.keys(editedProcessingConfigurationsValue).find(
      (t) => t === tabId,
    );
    if (!tab) return;

    //TODO: handleOnChange shoudl return the whole configuration value
    // and here we just update the editedProcessingConfigurationsValue

    // setTabs((prevTabs) =>
    //   prevTabs.map((tab) => ({
    //     ...tab,
    //     hasUnsavedChanges: tab.id === tabId ? true : tab.hasUnsavedChanges,
    //   })),
    // );
  };

  const handleOnReset = (tabId: string) => {
    // setTabs((prevTabs) =>
    //   prevTabs.map((tab) => ({
    //     ...tab,
    //     hasUnsavedChanges: tab.id === tabId ? false : tab.hasUnsavedChanges,
    //   })),
    // );
  };

  const tabs = Object.keys(processingConfigurationsValue || {}).map((key) => ({
    id: key,
    label: processingConfigurationsValue![key]!.label,
    inferences: processingConfigurationsValue![key]!
      .inferences as Tab['inferences'], // TODO: fix this!
  }));

  if (processingConfigurationsFetchState?.status === 'loading') {
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
