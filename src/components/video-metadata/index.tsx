'use client';
import { GetVideoMetadataResponse } from '@/src/types';
import { Flex, Table, Text, Theme } from '@radix-ui/themes';
import { Warning } from 'components/warning';
import { transformMetadata } from './transform-metadata';
import { LoadingToast } from 'components/loading-toast';

const VideoMetaData = ({ video }: { video?: GetVideoMetadataResponse }) => {
  if (!video) {
    return null;
  }

  if ('status' in video! && video.status === 'loading') {
    return (
      <div className="center">
        <LoadingToast message="Loading video metadata..." />
      </div>
    );
  }

  if ('status' in video!) {
    return (
      <div className="center">
        <Warning message={video.detail.message} />
      </div>
    );
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
