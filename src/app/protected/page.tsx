import {
  PmgInspectLogo,
  ProjectFinder,
  AppSettings,
  DataLoader,
} from '@/src/components';

import { Flex } from '@radix-ui/themes';

import { PageSearchParams } from '@/src/types';

const Page = async ({ searchParams }: { searchParams: PageSearchParams }) => {
  const { path: pathSP } = await searchParams;
  const path = Array.isArray(pathSP) ? pathSP[0] : pathSP || undefined;

  return (
    <Flex p="4" height="100%" gap={'2'} direction="column">
      <DataLoader />
      <Flex justify={'between'} align="center">
        <PmgInspectLogo />
        <AppSettings />
      </Flex>

      <ProjectFinder projectPath={path} />
    </Flex>
  );
};

export default Page;
