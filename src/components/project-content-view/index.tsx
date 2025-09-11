import { Text } from '@radix-ui/themes';
import { Project } from '@/src/app/protected/api/project/types/project';
import { ProjectTableView } from './project-table-view';

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
  return project ? (
    <ProjectTableView
      project={project}
      onRowClick={(road) => console.log(road)}
    />
  ) : (
    <NoProjectSelected />
  );
};

export { ProjectContentView };
