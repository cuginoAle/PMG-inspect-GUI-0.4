'use client';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import { Flex } from '@radix-ui/themes';
import styles from './styles.module.css';
import { forwardRef, useEffect, useState } from 'react';

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

const SplitView = forwardRef<HTMLDivElement, SplitViewProps>(
  (
    {
      left,
      right,
      leftMinSize = 200,
      rightMinSize = 200,
      name,
      leftVisible = true,
      rightVisible = true,
      proportionalLayout = false,
      ...rest
    },
    ref,
  ) => {
    const [leftPreferredSize, setLeftPreferredSize] = useState(leftMinSize);

    useEffect(() => {
      const lsData =
        window.localStorage.getItem(name) || leftMinSize.toString();
      if (lsData) {
        setLeftPreferredSize(parseInt(lsData, 10));
      }
    }, [leftMinSize, name]);

    return (
      <Flex
        ref={ref}
        gap="4"
        height="100%"
        className={styles.splitViewRoot}
        {...rest}
      >
        <Allotment
          key={leftPreferredSize} // force re-mount when preferred size changes
          defaultSizes={[leftPreferredSize]}
          separator={false}
          proportionalLayout={proportionalLayout}
          onDragEnd={(sizes) => {
            window.localStorage.setItem(name, (sizes[0] || 0).toString());
          }}
        >
          <Allotment.Pane
            minSize={leftMinSize}
            preferredSize={leftPreferredSize}
            visible={leftVisible}
          >
            {left}
          </Allotment.Pane>
          <Allotment.Pane minSize={rightMinSize} visible={rightVisible}>
            {right}
          </Allotment.Pane>
        </Allotment>
      </Flex>
    );
  },
);

SplitView.displayName = 'SplitView';

export { SplitView };
