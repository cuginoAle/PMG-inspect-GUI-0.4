import { FileLogoTitle } from '@/src/components';
import { getFileIconType } from '@/src/helpers/get-file-icon-type';
import { removeFileExtension } from '@/src/helpers/remove-file-extension';
import { Flex } from '@radix-ui/themes';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { ProjectTableViewContainer } from '../project-table-view-container';

const ProjectContentViewContainer = () => {
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

export { ProjectContentViewContainer };
