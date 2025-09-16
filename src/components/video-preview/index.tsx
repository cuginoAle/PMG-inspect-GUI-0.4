import { ProjectItem } from '@/src/types';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { Flex, Heading, Text } from '@radix-ui/themes';

const VideoPreview = ({ projectItem }: { projectItem?: ProjectItem }) => {
  return !projectItem ? null : (
    <>
      <Flex gap={'2'} direction={'column'}>
        <Heading weight={'light'}>{projectItem.road_data.road_name}</Heading>
        <Text color="orange" size={'2'}>
          <Flex gap={'2'} align={'center'}>
            {projectItem.road_data.road_from}{' '}
            <ArrowRightIcon height="24" width="24" />{' '}
            {projectItem.road_data.road_to}
          </Flex>
        </Text>
      </Flex>
      <video
        width="100%"
        height="auto"
        controls
        src={projectItem.video_url}
      ></video>
    </>
  );
};

export { VideoPreview };
