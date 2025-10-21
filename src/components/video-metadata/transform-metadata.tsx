import React from 'react';
import { GoProModel } from '@/src/components';
import { Text } from '@radix-ui/themes';
const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'medium',
});

const transformMetadata = (
  metadata: Record<string, string | number | null | boolean> | null | undefined,
): Record<string, React.ReactNode> | null | undefined => {
  if (!metadata) return metadata;
  const transformed: Record<string, React.ReactNode> = {
    ...metadata,
  };

  transformed['model'] = <GoProModel model={metadata['model'] as string} />;
  const createDate = dateTimeFormat
    .format(new Date(metadata['create_date'] as number))
    .split(', ');
  transformed['create_date'] = (
    <span>
      <Text color="amber" weight="bold">
        {createDate[0]}{' '}
      </Text>
      {createDate[1]}
    </span>
  );

  const modifyDate = metadata['modify_date']
    ? dateTimeFormat
        .format(new Date(metadata['modify_date'] as number))
        .split(', ')
    : ['N/A', '-'];

  transformed['modify_date'] = (
    <span>
      <Text color="amber" weight="bold">
        {modifyDate[0]}{' '}
      </Text>
      {modifyDate[1]}
    </span>
  );

  return transformed;
};

export { transformMetadata };
