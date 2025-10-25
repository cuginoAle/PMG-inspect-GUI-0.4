import { GoProIcon } from '@/src/components';
import { Flex, Text } from '@radix-ui/themes';
import React from 'react';
import styles from './style.module.css';

const GoProModel = ({ model }: { model: string }) => {
  return model?.indexOf('HERO') > -1 ? (
    <Flex gap={'2'} align="center">
      <GoProIcon size={2.5} />
      <span className={styles.goproModel}>{model}</span>
    </Flex>
  ) : (
    <Text size={'1'}>{model}</Text>
  );
};

export { GoProModel };
