import { Text } from '@radix-ui/themes';

import { ProjectTableView } from 'components/project-table-view';
import { SplitView } from 'components/base/split-view';
import React, { useEffect } from 'react';
import styles from './style.module.css';
import { Project, ProjectItem } from '@/src/types';
import { ProjectItemDetailsView } from 'components/project-item-details-view';

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
  const [selectedProjectItem, setSelectedProjectItem] = React.useState<
    ProjectItem | undefined
  >(project?.project_items[0]);

  useEffect(() => {
    setSelectedProjectItem(project?.project_items[0]);
  }, [project]);

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
              onRowSelect={(projectItem) => setSelectedProjectItem(projectItem)}
              onRowDoubleClick={(index) => console.log('double click', index)}
              defaultSelectedRowIndex={0}
            />
          </div>
        }
        right={
          <div className={styles.rightPane}>
            {selectedProjectItem && (
              <ProjectItemDetailsView projectItem={selectedProjectItem} />
            )}
          </div>
        }
      />
    </div>
  ) : (
    <NoProjectSelected />
  );
};

export { ProjectContentView };
