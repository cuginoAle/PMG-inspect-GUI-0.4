'use client';
import { SplitView } from '@/src/components';

const ProjectFinder = ({
  left,
  right,
}: {
  left?: React.ReactNode;
  right?: React.ReactNode;
}) => {
  return (
    <SplitView name="project-finder-split-view" left={left} right={right} />
  );
};

export { ProjectFinder };
export * from './views';
