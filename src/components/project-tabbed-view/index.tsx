'use client';
import { Flex, Tabs } from '@radix-ui/themes';
import {
  FileLogoTitle,
  PresetsTabs,
  MySuspense,
  NoProjectSelected,
} from '@/src/components';

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { getFileIconType } from '@/src/helpers/get-file-icon-type';
import { removeFileExtension } from '@/src/helpers/remove-file-extension';
import { PresetsTabsContent } from './presets-tabs-content';
import { useGlobalState } from '@/src/app/global-state';
import { DummyAnalysisResult } from '@/src/types';
import { getResponseIfSuccesful } from '@/src/helpers/get-response-if-successful';

const ProjectTabbedView = () => {
  const { selectedInferenceSettingId, analysisResults } = useGlobalState();

  const [unsavedTabIds, setUnsavedTabIds] = React.useState<string[]>([]);
  const analysisResultsValue = getResponseIfSuccesful(analysisResults.get());

  const selectedInferenceSettingIdSetter = selectedInferenceSettingId.set;
  const selectedInferenceSettingIdValue = selectedInferenceSettingId.get();

  const sp = useSearchParams();
  const projectPath = sp.get('path') || '';

  const fileType = useMemo(() => getFileIconType(projectPath), [projectPath]);
  const label = useMemo(() => removeFileExtension(projectPath), [projectPath]);

  const handleOnChange = (tabId: string) => {
    setUnsavedTabIds((prev) =>
      prev.includes(tabId) ? prev : [...prev, tabId],
    );
  };

  const handleOnReset = (tabId: string) => {
    setUnsavedTabIds((prev) => prev.filter((id) => id !== tabId));
  };

  if (!projectPath) {
    return <NoProjectSelected />;
  }

  return (
    <Tabs.Root
      value={
        selectedInferenceSettingIdValue || analysisResultsValue?.[0]?.setting_id
      }
      orientation="horizontal"
    >
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

        <MySuspense
          data={analysisResults.get()}
          errorTitle="Processing configuration"
          loadingMessage="Loading processing configurations..."
        >
          {(data) => (
            <PresetsTabs
              unsavedTabIds={unsavedTabIds}
              data={data as DummyAnalysisResult[]}
              onTabClick={selectedInferenceSettingIdSetter}
            />
          )}
        </MySuspense>

        <MySuspense
          data={analysisResults.get()}
          errorTitle="Analysis results"
          loadingMessage="Loading analysis results..."
        >
          {(data) => (
            <PresetsTabsContent
              data={data}
              unsavedTabIds={unsavedTabIds}
              onChange={handleOnChange}
              onReset={handleOnReset}
              onSave={(data) => {
                console.log(
                  'save the current tab!',
                  Object.fromEntries(data.entries()),
                );
              }}
            />
          )}
        </MySuspense>
      </Flex>
    </Tabs.Root>
  );
};

export { ProjectTabbedView };
