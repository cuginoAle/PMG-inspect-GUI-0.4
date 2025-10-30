import {
  PmgInspectLogo,
  ProjectFinder,
  AppSettings,
  DataLoader,
  DataTransformer,
} from '@/src/components';

import { Flex } from '@radix-ui/themes';
import { Suspense } from 'react';

const Page = async () => {
  return (
    <Flex p="4" height="100%" gap={'2'} direction="column">
      {/* this Suspense is needed just because of the useSearchParams inside the data loader */}
      <Suspense fallback={<div>Loading data...</div>}>
        <DataLoader />
        <DataTransformer />
      </Suspense>

      <Flex justify={'between'} align="center">
        <PmgInspectLogo />
        <AppSettings />
      </Flex>

      <ProjectFinder />
    </Flex>
  );
};

export default Page;
