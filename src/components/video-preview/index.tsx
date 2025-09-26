'use client';
import { ProjectItem } from '@/src/types';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { Flex, Heading, Text } from '@radix-ui/themes';
import React from 'react';
import { useEffect, useState } from 'react';

const MemoVideo = React.memo(function Video({
  src,
  aspectRatio,
}: {
  src: string | undefined;
  aspectRatio: number;
}) {
  return (
    src && (
      <video
        width="100%"
        height="auto"
        controls
        src={src}
        style={{
          aspectRatio,
        }}
      ></video>
    )
  );
});

const VideoPreview = ({ projectItem }: { projectItem?: ProjectItem }) => {
  const [src, setSrc] = useState<string | undefined>();

  useEffect(() => {
    setSrc(projectItem?.video_url);
  }, [projectItem?.video_url]);

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
      <MemoVideo
        src={src}
        aspectRatio={
          (projectItem?.media_data?.frame_width || 16) /
          (projectItem?.media_data?.frame_heigth || 9)
        }
      />
    </>
  );
};

export { VideoPreview };
