'use client';
import { Flex, Tabs } from '@radix-ui/themes';
import { FileLogoTitle } from '@/src/components';

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { getFileIconType } from '@/src/helpers/get-file-icon-type';
import { removeFileExtension } from '@/src/helpers/remove-file-extension';
import { useGlobalState } from '@/src/app/global-state';
import { ProcessingConfiguration } from '@/src/types';
import { ProjectTableViewContainer } from '@/src/containers/project-table-view-container';

const ProjectTabbedView = ({
  processingData,
  analysisData,
}: {
  processingData: {
    processing_configurations: ProcessingConfiguration;
    inference_model_ids: InferenceModelDict;
  };
  analysisData: DummyAnalysisResult[];
}) => {
  const [currentAnalysisData, setCurrentAnalysisData] =
    React.useState<DummyAnalysisResult[]>(analysisData);

  const selectedInferenceSettingIdValue = useGlobalState(
    (state) => state.selectedInferenceSettingId,
  );

  const sp = useSearchParams();
  const projectPath = sp.get('path') || '';

  const fileType = useMemo(() => getFileIconType(projectPath), [projectPath]);
  const label = useMemo(() => removeFileExtension(projectPath), [projectPath]);

  return (
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
  );
};

export { ProjectTabbedView };
