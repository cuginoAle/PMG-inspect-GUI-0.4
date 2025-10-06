import {
  PmgInspectLogo,
  ProjectFinder,
  AppSettings,
  ProjectContentView,
} from '@/src/components';

import { Flex } from '@radix-ui/themes';

import { PageSearchParams } from '@/src/types';
import { ProjectsTreeViewContainer } from '@/src/containers/projects-tree-view-container';

const Page = async ({ searchParams }: { searchParams: PageSearchParams }) => {
  // const { path: pathSP } = await searchParams;
  // const path = Array.isArray(pathSP) ? pathSP[0] : pathSP || undefined;

  return (
    <Flex p="4" height="100%" gap={'2'} direction="column">
      <Flex justify={'between'} align="center">
        <PmgInspectLogo />
        <AppSettings />
      </Flex>

      <ProjectFinder
        left={<ProjectsTreeViewContainer searchParams={searchParams} />}
        right={<ProjectContentView />}
      />
    </Flex>
  );
};

export default Page;
