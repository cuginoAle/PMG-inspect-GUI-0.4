import { PmgInspectLogo } from '@/src/components/pmg-inspect-logo';
import { ProjectFinder } from '@/src/components/project-finder';
import { Settings } from '@/src/components/settings';
import { Flex } from '@radix-ui/themes';

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { path: pathSP } = await searchParams;
  const path = Array.isArray(pathSP) ? pathSP[0] : pathSP || undefined;

  return (
    <Flex p="4" height="100%" gap={'2'} direction="column">
      <Flex justify={'between'} align="center">
        <PmgInspectLogo />
        <Settings />
      </Flex>

      <ProjectFinder projectPath={path} />
    </Flex>
  );
};

export default Page;
