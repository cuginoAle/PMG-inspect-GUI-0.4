import { ProjectFinder } from 'containers/project-finder';
import { Flex, Heading } from '@radix-ui/themes';

const Page = () => {
  return (
    <Flex p="4" height="100%" gap={'2'} direction="column">
      <Heading size="6" weight={'light'} as="h2">
        Project finder:
      </Heading>

      <ProjectFinder />
    </Flex>
  );
};

export default Page;
