import { Flex, Spinner, Text } from '@radix-ui/themes';
import React from 'react';

const sizeMap: Record<
  'small' | 'medium' | 'large',
  { spinner: '1' | '2' | '3'; text: '3' | '4' | '5'; padding: string }
> = {
  small: {
    spinner: '1',
    text: '3',
    padding: 'var(--space-2) var(--space-4)',
  },
  medium: {
    spinner: '2',
    text: '4',
    padding: 'var(--space-3) var(--space-5)',
  },
  large: {
    spinner: '3',
    text: '5',
    padding: 'var(--space-4) var(--space-6)',
  },
};

const LoadingToast = ({
  message,
  size = 'large',
}: {
  message: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}) => {
  return (
    <Flex
      gap={'4'}
      align={'center'}
      style={{
        padding: sizeMap[size].padding,
        backgroundColor: 'var(--black-a7)',
        borderRadius: 'var(--space-8)',
      }}
    >
      <Spinner size={sizeMap[size].spinner} />
      {typeof message === 'string' ? (
        <Text size={sizeMap[size].text}>{message}</Text>
      ) : (
        message
      )}
    </Flex>
  );
};

export { LoadingToast };
