'use client';
import { Slider, NeuralNetworkIcon } from '@/src/components';
import { Card, Flex, Heading, Select } from '@radix-ui/themes';
import styles from './style.module.css';

import React from 'react';
import classNames from 'classnames';
import { Inference } from '@/src/types';

type NetworkSettingsProps = {
  className?: string;
  name: string;
  inference: Inference;

  values?: any[]; // replace it with actual type when available
  models: string[]; // list of models available for this inference
};

const formatValueLabel = (value: number) => value.toFixed(2);

const NetworkSettings = ({
  className,
  name,
  inference,
  models = [],
}: NetworkSettingsProps) => {
  // const [isEnabled, setIsEnabled] = React.useState(isDefaultEnabled);

  const rootCn = classNames(styles.root);
  const cn = classNames(className, styles.container);

  const params = inference.inference_model_parameters;

  return (
    <Card size={'3'} className={rootCn}>
      <div className={cn}>
        <Flex align="center" gap="2" justify={'between'}>
          <div className={styles.title}>
            <NeuralNetworkIcon className={styles.aiIcon} />
            <Heading
              size="4"
              as="h4"
              className="ellipsis"
              style={{ textTransform: 'capitalize' }}
            >
              {name}
            </Heading>
          </div>
          {/* <Toggle
            size={1}
            onChange={setIsEnabled}
            defaultChecked={isDefaultEnabled}
          /> */}
        </Flex>
        <Select.Root
          size="2"
          defaultValue={inference.inference_model_id}
          onValueChange={(value) => {
            console.log('preset', value);
          }}
          name={`${name}-model`}
        >
          <Select.Trigger variant="soft" />
          <Select.Content position="popper">
            {models.map((preset) => (
              <Select.Item key={preset} value={preset}>
                {preset.replaceAll('_', ' ')}
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
          defaultValue={params.confidence}
          valueLabel={formatValueLabel}
        />
        <Slider
          min={0}
          max={1}
          step={0.05}
          name={`${name}-iou`}
          title="Intersection over Union"
          defaultValue={params.iou}
          valueLabel={formatValueLabel}
        />
      </div>
    </Card>
  );
};

export { NetworkSettings };
