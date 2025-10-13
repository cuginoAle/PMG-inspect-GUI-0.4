'use client';
import { Flex, Tabs } from '@radix-ui/themes';
import { FileLogoTitle, PresetsTabs } from '@/src/components';

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { getFileIconType } from '@/src/helpers/get-file-icon-type';
import { removeFileExtension } from '@/src/helpers/remove-file-extension';
import { PresetsTabsContent } from './presets-tabs-content';
import { useGlobalState } from '@/src/app/global-state';
import {
  DummyAnalysisResult,
  InferenceModelDict,
  ProcessingConfiguration,
} from '@/src/types';
import { ImmutableObject } from '@hookstate/core';

const ProjectTabbedView = ({
  processingData,
  analysisData,
}: {
  processingData: ImmutableObject<{
    processing_configurations: ProcessingConfiguration;
    inference_model_ids: InferenceModelDict;
  }>;
  analysisData: ImmutableObject<DummyAnalysisResult[]>;
}) => {
  const [currentAnalysisData, setCurrentAnalysisData] = React.useState<
    DummyAnalysisResult[]
  >(analysisData as DummyAnalysisResult[]);

  const [unsavedTabIds, setUnsavedTabIds] = React.useState<string[]>([]);
  const { selectedInferenceSettingId } = useGlobalState();

  const selectedInferenceSettingIdSetter = selectedInferenceSettingId.set;
  const selectedInferenceSettingIdValue = selectedInferenceSettingId.get();

  const sp = useSearchParams();
  const projectPath = sp.get('path') || '';

  const fileType = useMemo(() => getFileIconType(projectPath), [projectPath]);
  const label = useMemo(() => removeFileExtension(projectPath), [projectPath]);

  const handleOnChange = (data: FormData) => {
    console.log('data', Object.fromEntries(data.entries()));
    // setUnsavedTabIds((prev) =>
    //   prev.includes(data.get('tabId') as string) ? prev : [...prev, data.get('tabId') as string],
    // );
  };

  const handleOnReset = (tabId: string) => {
    setUnsavedTabIds((prev) => prev.filter((id) => id !== tabId));
  };

  const createNewSetting = () => {
    const firstDefaultSetting = Object.values(
      processingData.processing_configurations || {},
    )[0];
    if (firstDefaultSetting) {
      const newSetting = [
        {
          setting_id: firstDefaultSetting.label,
          setting_label: firstDefaultSetting.label,
          setting_details: Object.entries(firstDefaultSetting.inferences).map(
            ([network_name, inference]) => ({
              network_name,
              ...inference,
            }),
          ),
          frame_rate: {
            fps: undefined,
            distance: undefined,
          },
          analysed_video_list: {
            video_url: '',
            frames: {
              index: 0,
              pci_score_value: null,
              pci_score_state: 'ok' as const,
            },
          },
        },
      ];
      const newTabId = Date.now().toString();
      setCurrentAnalysisData((prev) => [
        ...prev,
        {
          ...newSetting[0],
          setting_id: newTabId,
        } as DummyAnalysisResult,
      ]);
      selectedInferenceSettingIdSetter(newTabId);
      setUnsavedTabIds((prev) => [...prev, newTabId]);
    }
  };

  return (
    <Tabs.Root
      value={
        selectedInferenceSettingIdValue || currentAnalysisData?.[0]?.setting_id
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

        <PresetsTabs
          unsavedTabIds={unsavedTabIds}
          data={currentAnalysisData}
          onTabClick={selectedInferenceSettingIdSetter}
          onAddClick={createNewSetting}
        />

        <PresetsTabsContent
          data={currentAnalysisData}
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
      </Flex>
    </Tabs.Root>
  );
};

export { ProjectTabbedView };
