import { Flex, Spinner, Text } from '@radix-ui/themes';
import React from 'react';

const LoadingToast = ({ message }: { message: React.ReactNode }) => {
  return (
    <Flex
      gap={'4'}
      align={'center'}
      style={{
        padding: 'var(--space-4) var(--space-6)',
        backgroundColor: 'var(--black-a7)',
        borderRadius: 'var(--space-8)',
      }}
    >
      <Spinner size={'3'} />
      {typeof message === 'string' ? (
        <Text size={'5'}>{message}</Text>
      ) : (
        message
      )}
    </Flex>
  );
};

export { LoadingToast };
