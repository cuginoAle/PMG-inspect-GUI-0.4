'use client';
import { Flex, Heading, Text } from '@radix-ui/themes';
import React, { useCallback, useEffect, useRef } from 'react';
import styles from './styles.module.css';

type SliderProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  title?: string;
  value?: number;
  defaultValue?: number;
  min: number;
  max: number;
  step?: number;
  onChange?: (value: number) => void;
  onPointerUp?: (value: number) => void;
  disabled?: boolean;
  name: string;
  valueLabel?: (value: number) => string;
};

const Slider = ({
  title,
  defaultValue,
  value,
  min,
  max,
  step = 1,
  onChange,
  onPointerUp,
  disabled,
  name,
  valueLabel,
  ...rest
}: SliderProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const sliderTrackRef = useRef<HTMLDivElement>(null);
  const valueLabelRef = useRef<HTMLSpanElement>(null);

  const updateSlider = useCallback(
    (val: number) => {
      sliderTrackRef.current?.style.setProperty(
        '--value-percentage',
        `${((val - min) / (max - min)) * 100}`,
      );

      valueLabelRef.current &&
        (valueLabelRef.current.innerHTML = valueLabel
          ? valueLabel(val)
          : val.toString());
    },
    [max, min, valueLabel],
  );

  useEffect(() => {
    if (value !== undefined) {
      updateSlider(value);
    } else {
      updateSlider(defaultValue || min);
    }
  }, [max, min, updateSlider, value, valueLabel, defaultValue]);

  return (
    <Flex direction="column" asChild style={{ width: '100%' }} {...rest}>
      <section>
        {title && (
          <Heading as="h2" size="1" className={styles.sliderTitle}>
            <span>{title}:</span>
            <Text size="2" as="span" color="amber" ref={valueLabelRef}>
              {valueLabel
                ? valueLabel(value || defaultValue || min)
                : value || defaultValue || min}
            </Text>
          </Heading>
        )}
        <div className={styles.sliderRoot} ref={rootRef}>
          <input
            disabled={disabled}
            name={name}
            type="range"
            min={min}
            max={max}
            step={step}
            defaultValue={defaultValue}
            value={value}
            onPointerDown={() => {
              rootRef.current?.classList.add(styles.dragging);
            }}
            onPointerUp={(e: React.PointerEvent<HTMLInputElement>) => {
              rootRef.current?.classList.remove(styles.dragging);
              if (onPointerUp) {
                const target = e.target as HTMLInputElement;
                onPointerUp(parseFloat(target.value));
              }
            }}
            onChange={(e) => {
              const newValue = parseFloat(e.target.value);
              updateSlider(newValue);

              onChange?.(newValue);
            }}
          />
          <div ref={sliderTrackRef} className={styles.sliderTrack} />
        </div>
      </section>
    </Flex>
  );
};

export { Slider };
