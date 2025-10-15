'use client';
import { Flex, Tabs } from '@radix-ui/themes';
import { FileLogoTitle } from '@/src/components';

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { getFileIconType } from '@/src/helpers/get-file-icon-type';
import { removeFileExtension } from '@/src/helpers/remove-file-extension';
import { useGlobalState } from '@/src/app/global-state';
import {
  DummyAnalysisResult,
  InferenceModelDict,
  ProcessingConfiguration,
} from '@/src/types';
import { ImmutableObject } from '@hookstate/core';
import { ProjectTableViewContainer } from '@/src/containers/project-table-view-container';

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

  const { selectedInferenceSettingId } = useGlobalState();

  const selectedInferenceSettingIdValue = selectedInferenceSettingId.get();

  const sp = useSearchParams();
  const projectPath = sp.get('path') || '';

  const fileType = useMemo(() => getFileIconType(projectPath), [projectPath]);
  const label = useMemo(() => removeFileExtension(projectPath), [projectPath]);

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

        <ProjectTableViewContainer />
      </Flex>
    </Tabs.Root>
  );
};

export { ProjectTabbedView };
