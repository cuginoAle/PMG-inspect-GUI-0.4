import { Slider, NeuralNetworkIcon } from '@/src/components';
import { Card, Flex, Heading, Select, Switch } from '@radix-ui/themes';
import styles from './style.module.css';

import React from 'react';

type NetworkSettingsProps = {
  className?: string;
  name: string;
  isDefaultEnabled?: boolean; // this can be removed. Use `values` instead
  values?: any[]; // replace it with actual type when available
};

const dummy_model = [
  { id: 'model_1', name: 'Model 1' },
  { id: 'model_2', name: 'Model 2' },
  { id: 'model_3', name: 'Model 3' },
];

const NetworkSettings = ({
  className,
  name,
  isDefaultEnabled = false,
}: NetworkSettingsProps) => {
  const [isEnabled, setIsEnabled] = React.useState(isDefaultEnabled);

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
            color="amber"
            onClick={() => {
              setIsEnabled((en) => !en);
            }}
            radius="full"
            name={`${name}-enabled`}
            defaultChecked={isDefaultEnabled}
            // checked={!!selectedSetting?.enabled}
          />
        </Flex>
        <Select.Root
          size="2"
          defaultValue={dummy_model[0]!.id}
          onValueChange={(value) => {
            console.log('preset', value);
          }}
          disabled={!isEnabled}
        >
          <Select.Trigger variant="soft" />
          <Select.Content position="popper">
            {dummy_model.map((preset) => (
              <Select.Item key={preset.id} value={preset.id}>
                {`${name} ${preset.name}`}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
        <Slider
          min={0}
          max={1}
          step={0.05}
          name={`${name}-confidence`}
          title="Confidence"
          defaultValue={0.5}
          disabled={!isEnabled}
          valueLabel={(value) => value.toFixed(2)}
        />
        <Slider
          min={0}
          max={1}
          step={0.05}
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
