'use client';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Flex, Text } from '@radix-ui/themes';

interface Props {
  title?: string;
  message: string;
}

function Warning({ title = 'Something went wrong', message }: Props) {
  return (
    <div className="center" style={{ padding: '2rem' }}>
      <Flex direction="column" gap="3" align="center">
        <Text
          size="5"
          style={{
            border: '1px solid var(--orange-7)',
            borderRadius: '50px',
            padding: '0.5em 1em',
          }}
        >
          <Flex align="center" gap="1">
            <ExclamationTriangleIcon
              width={'20px'}
              height={'20px'}
              color="orange"
            />
            <Text color="orange" weight="bold">
              {title}
            </Text>
          </Flex>
        </Text>
        <Text size="2" color="gray">
          {message}
        </Text>
      </Flex>
    </div>
  );
}

export { Warning };
