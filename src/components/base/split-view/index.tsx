'use client';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import { Flex, Box } from '@radix-ui/themes';
import styles from './styles.module.css';
import { forwardRef, useEffect, useState } from 'react';

type SplitViewProps = React.HTMLAttributes<HTMLDivElement> & {
  left: React.ReactNode;
  right: React.ReactNode;
  leftMinSize?: number;
  rightMinSize?: number;
};

const SplitView = forwardRef<HTMLDivElement, SplitViewProps>(
  ({ left, right, leftMinSize = 200, rightMinSize = 200, ...rest }, ref) => {
    const [leftPreferredSize, setLeftPreferredSize] = useState(leftMinSize);

    useEffect(() => {
      const lsData =
        window.localStorage.getItem('leftPreferredSize') ||
        leftMinSize.toString();

      if (lsData) {
        setLeftPreferredSize(parseInt(lsData, 10));
      }
    }, [leftMinSize]);

    return (
      <Flex
        ref={ref}
        gap="4"
        height="100%"
        className={styles.splitViewRoot}
        {...rest}
      >
        <Allotment
          key={leftPreferredSize}
          defaultSizes={[leftPreferredSize, 100 - leftPreferredSize]}
          separator={false}
          proportionalLayout={false}
          onDragEnd={(sizes) => {
            window.localStorage.setItem(
              'leftPreferredSize',
              sizes[0].toString(),
            );
          }}
        >
          <Allotment.Pane
            minSize={leftMinSize}
            preferredSize={leftPreferredSize}
          >
            <Box className={styles.leftView}>{left}</Box>
          </Allotment.Pane>
          <Allotment.Pane minSize={rightMinSize}>
            <Box className={styles.rightView}>{right}</Box>
          </Allotment.Pane>
        </Allotment>
      </Flex>
    );
  },
);

SplitView.displayName = 'SplitView';

export { SplitView };
