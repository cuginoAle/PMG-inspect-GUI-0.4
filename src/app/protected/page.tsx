import {
  PmgInspectLogo,
  ProjectFinder,
  AppSettings,
  DataLoader,
} from '@/src/components';

import { Flex } from '@radix-ui/themes';

const Page = async () => {
  return (
    <Flex p="4" height="100%" gap={'2'} direction="column">
      <DataLoader />
      <Flex justify={'between'} align="center">
        <PmgInspectLogo />
        <AppSettings />
      </Flex>

      <ProjectFinder />
    </Flex>
  );
};

export default Page;
