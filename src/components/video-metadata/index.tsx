'use client';

import { Flex, Table, Text, Theme } from '@radix-ui/themes';
import { transformMetadata } from './transform-metadata';
import { CameraData } from '@/src/types';
import { Immutable } from '@hookstate/core';

const VideoMetaData = ({
  cameraData,
}: {
  cameraData?: Immutable<CameraData> | null;
}) => {
  if (!cameraData) {
    return null;
  }

  const transformedMetadata = transformMetadata(cameraData);
  const cameraDataKeys = Object.keys(transformedMetadata || {});

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
