import React from 'react';
import { GoProModel } from 'components/gopro-model';

const transformMetadata = (
  metadata: Record<string, string | number | null | boolean> | null | undefined,
): Record<string, React.ReactNode> | null | undefined => {
  if (!metadata) return metadata;
  const transformed: Record<string, React.ReactNode> = {
    ...metadata,
  };

  transformed['model'] = <GoProModel model={metadata['model'] as string} />;
  return transformed;
};

export { transformMetadata };
