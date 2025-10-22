import { FileLogoTitle } from '@/src/components';
import { Flex } from '@radix-ui/themes';
import { ProjectTableViewContainer } from '@/src/containers/project-table-view-container';
import { useSearchParams } from 'next/navigation';
import { getFileIconType } from '@/src/helpers/get-file-icon-type';
import { removeFileExtension } from '@/src/helpers/remove-file-extension';
import { useMemo } from 'react';

const FileLogoContainer = () => {
  const sp = useSearchParams();
  const projectPath = sp.get('path') || '';

  const fileType = useMemo(() => getFileIconType(projectPath), [projectPath]);
  const label = useMemo(() => removeFileExtension(projectPath), [projectPath]);

  return projectPath ? (
    <FileLogoTitle
      as="div"
      fileType={fileType}
      label={label}
      size="medium"
      componentId="project-analysis-dashboard-file-title"
    />
  ) : null;
};

const ProjectContentViewContainer = () => {
  return (
    <Flex direction={'column'} gap={'6'} height={'100%'}>
      <FileLogoContainer />
      <ProjectTableViewContainer />
    </Flex>
  );
};

export { ProjectContentViewContainer };
