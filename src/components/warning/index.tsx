'use client';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Flex, Text, Box } from '@radix-ui/themes';
import styles from './style.module.css';

interface Props {
  title?: string;
  message: string;
}

function Warning({ title = 'Something went wrong', message }: Props) {
  return (
    <div className="center" style={{ padding: '2rem' }}>
      <Flex direction="column" gap="3" align="center">
        <Text size="5" color="red">
          <Flex align="baseline" gap="2">
            <Box flexShrink="0" as="span" className={styles.icon}>
              <ExclamationTriangleIcon color="orange" />
            </Box>
            <Box flexShrink="0" as="span" maxWidth={'100%'}>
              {title}
            </Box>
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
