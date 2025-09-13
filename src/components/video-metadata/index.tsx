import { fetchVideoMetadata } from '@/src/lib/data/fetch-video-metadata';
import { VideoData } from '@/src/types';
import { Flex, Table, Text } from '@radix-ui/themes';
import { useEffect, useState } from 'react';
import { LoadingToast } from 'components/loading-toast';
import { Warning } from 'components/warning';

const VideoMetaData = ({ videoUrl }: { videoUrl: string }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [videoData, setVideoData] = useState<VideoData | null | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!videoUrl) return;
    setVideoData(undefined); // Reset before fetching new data

    fetchVideoMetadata(videoUrl)
      .then((data) => setVideoData(data))
      .catch((error) => {
        const err = error as Error;
        setVideoData(null);
        setErrorMessage(err.message);
      });
  }, [videoUrl]);

  const cameraDataKeys = Object.keys(videoData?.camera_data || {});

  return videoData ? (
    <Flex direction="column" gap={'2'}>
      <Text size={'2'}>Video Metadata:</Text>

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
                <Text size={'1'}>
                  {String((videoData?.camera_data as any)[key])}
                </Text>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Flex>
  ) : videoData === undefined ? (
    <LoadingToast message="Loading video metadata..." />
  ) : (
    <Flex gap={'2'} align="center" justify={'center'}>
      <Warning
        title="Something went wrong"
        message={errorMessage || 'Unknown error'}
      />
    </Flex>
  );
};

export { VideoMetaData };
