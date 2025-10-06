import { PmgInspectLogo, AppSettings } from '@/src/components';
import { Left, ProjectFinder } from '@/src/components/project-finder';
import { Flex } from '@radix-ui/themes';

const Page = async () => {
  return (
    <Flex p="4" height="100%" gap={'2'} direction="column">
      {/* <DataLoader /> */}
      <Flex justify={'between'} align="center">
        <PmgInspectLogo />
        <AppSettings />
      </Flex>
      <ProjectFinder left={<Left />} right={null} />
    </Flex>
  );
};

export default Page;
