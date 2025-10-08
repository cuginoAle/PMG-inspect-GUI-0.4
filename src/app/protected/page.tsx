import { PmgInspectLogo, ProjectFinder, AppSettings } from '@/src/components';

import { Flex } from '@radix-ui/themes';

import { PageSearchParams } from '@/src/types';
import { ProjectsTreeViewContainer } from '@/src/containers/projects-tree-view-container';
import { ProjectContentContainer } from '@/src/containers/project-main-content-container';

const Page = async ({ searchParams }: { searchParams: PageSearchParams }) => (
  <Flex p="4" height="100%" gap={'2'} direction="column">
    <Flex justify={'between'} align="center">
      <PmgInspectLogo />
      <AppSettings />
    </Flex>

    <ProjectFinder
      left={<ProjectsTreeViewContainer />}
      right={<ProjectContentContainer searchParams={searchParams} />}
    />
  </Flex>
);

export default Page;
