'use client';
import { Allotment } from 'allotment';
// @ts-ignore - allotment has no types for its CSS
import 'allotment/dist/style.css';
import { Flex } from '@radix-ui/themes';
import styles from './styles.module.css';
import { useEffect, useState } from 'react';

type SplitViewProps = React.HTMLAttributes<HTMLDivElement> & {
  left: React.ReactNode;
  right: React.ReactNode;
  leftMinSize?: number;
  rightMinSize?: number;
  name: string;
  leftVisible?: boolean;
  rightVisible?: boolean;
  proportionalLayout?: boolean;
};

const SplitView = ({
  left,
  right,
  leftMinSize = 200,
  rightMinSize = 200,
  name,
  leftVisible = true,
  rightVisible = true,
  proportionalLayout = false,
  ...rest
}: SplitViewProps) => {
  const [preferredSize, setPreferredSize] = useState([
    leftMinSize,
    rightMinSize,
  ]);

  useEffect(() => {
    const lsData = window.localStorage.getItem(name);
    if (lsData) {
      setPreferredSize(lsData.split(',').map(Number));
    } else {
      setPreferredSize([leftMinSize, rightMinSize]); //default to leftMinSize
    }
  }, [leftMinSize, name, rightMinSize]);

  return (
    <Flex gap="4" height="100%" className={styles.splitViewRoot} {...rest}>
      <Allotment
        key={preferredSize.join(',')} // force re-mount when preferred size changes
        defaultSizes={preferredSize}
        separator={false}
        proportionalLayout={proportionalLayout}
        onDragEnd={(sizes) => {
          window.localStorage.setItem(name, sizes.join(',').toString());
        }}
      >
        <Allotment.Pane
          minSize={leftMinSize}
          preferredSize={preferredSize[0]}
          visible={leftVisible}
        >
          {left}
        </Allotment.Pane>
        <Allotment.Pane
          minSize={rightMinSize}
          preferredSize={preferredSize[1]}
          visible={rightVisible}
        >
          {right}
        </Allotment.Pane>
      </Allotment>
    </Flex>
  );
};

SplitView.displayName = 'SplitView';

export { SplitView };
