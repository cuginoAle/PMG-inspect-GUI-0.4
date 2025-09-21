'use client';
import { VideoData } from '@/src/types';
import { Flex, Table, Text, Theme } from '@radix-ui/themes';
import { transformMetadata } from './transform-metadata';

const VideoMetaData = ({ video }: { video?: VideoData }) => {
  if (!video) {
    return null;
  }

  const transformedMetadata = transformMetadata(video.camera_data);
  const cameraDataKeys = Object.keys(video.camera_data || {});

  return transformedMetadata ? (
    <Flex direction="column" gap={'2'}>
      <Text size={'2'}>Video Metadata:</Text>

      <Theme panelBackground="translucent">
        <Table.Root size={'1'} variant="surface">
          <Table.Body>
            {cameraDataKeys.map((key) => (
              <Table.Row key={key}>
                <Table.Cell>
                  <Text weight={'bold'} size={'1'}>
                    {key}
                  </Text>
                </Table.Cell>
                <Table.Cell width={'100%'}>
                  <Text size={'1'}>{transformedMetadata[key]}</Text>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Theme>
    </Flex>
  ) : null;
};

export { VideoMetaData };
