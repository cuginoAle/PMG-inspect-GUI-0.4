import { Slider } from 'components/slider';
import { Card, Flex, Heading, Switch } from '@radix-ui/themes';
import styles from './style.module.css';
import { NeuralNetworkIcon } from 'components/custom-icons';
import React from 'react';

type NetworkSettingsProps = {
  className?: string;
  name: string;
  // isEnabled?: boolean;
};

const NetworkSettings = ({
  className,
  name,
}: // isEnabled = false,

NetworkSettingsProps) => {
  const [isEnabled, setIsEnabled] = React.useState(false);

  const rootCn = `${styles.root} ${isEnabled ? '' : styles.disabled}`;
  const cn = `${className ?? ''} ${styles.container} `;
  return (
    <Card size={'3'} className={rootCn}>
      <div className={cn}>
        <Flex align="center" gap="2" justify={'between'}>
          <div className={styles.title}>
            <NeuralNetworkIcon />
            <Heading size="4" as="h4">
              {name}
            </Heading>
          </div>
          <Switch
            size="1"
            color="green"
            onClick={() => {
              setIsEnabled((en) => !en);
            }}
            radius="full"
            name={`${name}-enabled`}
            // checked={!!selectedSetting?.enabled}
          />
        </Flex>
        <Slider
          min={0}
          max={1}
          step={0.1}
          name={`${name}-confidence`}
          title="Confidence"
          defaultValue={0.5}
          disabled={!isEnabled}
        />
        <Slider
          min={0}
          max={1}
          step={0.1}
          name={`${name}-iou`}
          title="Intersection over Union"
          defaultValue={0.25}
          disabled={!isEnabled}
        />
      </div>
    </Card>
  );
};

export { NetworkSettings };
