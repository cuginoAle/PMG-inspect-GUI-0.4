'use client';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Flex, Text, Button, Box } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

interface Props {
  message: string;
}

export function ProjectsErrorFallback({ message }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const onRetry = () => startTransition(() => router.refresh());

  return (
    <div className="center" style={{ padding: '2rem' }}>
      <Flex direction="column" gap="3" align="center">
        <Text size="5" color="red">
          <Flex align="baseline" gap="2">
            <Box
              flexShrink="0"
              as="span"
              style={{
                fontSize: '1.4em',
                border: '2px solid var(--red-7)',
                borderRadius: '50%',
                width: '1.2em',
                height: '1.2em',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ExclamationTriangleIcon />
            </Box>
            <Box flexShrink="0" as="span" maxWidth={'100%'}>
              Something went wrong loading projects
            </Box>
          </Flex>
        </Text>
        <Text size="2" color="gray">
          {message}
        </Text>
        <Button onClick={onRetry} disabled={isPending} variant="soft">
          {isPending ? 'Retrying…' : 'Retry'}
        </Button>
      </Flex>
    </div>
  );
}
