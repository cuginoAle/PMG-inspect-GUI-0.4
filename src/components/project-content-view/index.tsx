import { Text } from '@radix-ui/themes';
import { Project } from '@/src/app/protected/api/project/types/project';
import { ProjectTableView } from 'components/project-table-view';
import { SplitView } from 'components/base/split-view';
import React from 'react';
import styles from './style.module.css';

type ProjectContentViewProps = {
  project?: Project;
};

const NoProjectSelected = () => (
  <div className="center">
    <Text size="6" weight="light">
      <Text size="8">🤷</Text> no project selected...
    </Text>
  </div>
);

const ProjectContentView = ({ project }: ProjectContentViewProps) => {
  const [selectedRowIndex, setSelectedRowIndex] = React.useState<number | null>(
    0,
  );
  return project ? (
    <div className={styles.root}>
      <SplitView
        name="project-content-split-view"
        leftMinSize={500}
        rightMinSize={100}
        proportionalLayout={true}
        left={
          <div className={styles.leftPane}>
            <ProjectTableView
              project={project}
              onRowSelect={(index) => setSelectedRowIndex(index)}
              onRowDoubleClick={(index) => console.log('double click', index)}
              defaultSelectedRowIndex={0}
            />
          </div>
        }
        right={
          <div className={styles.rightPane}>
            <div>Details view coming soon... {selectedRowIndex}</div>
          </div>
        }
      />
    </div>
  ) : (
    <NoProjectSelected />
  );
};

export { ProjectContentView };
