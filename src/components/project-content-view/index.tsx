import { Project } from '@/src/app/types';
import { Text } from '@radix-ui/themes';

type ProjectContentViewProps = {
  selectedProject?: Project;
};

const ProjectContentView = ({ selectedProject }: ProjectContentViewProps) => {
  return selectedProject ? (
    <div>Project Content View: {selectedProject?.name}</div>
  ) : (
    <div className="center">
      <Text size="6" weight="light">
        <Text size="8">🤷</Text> no project selected...
      </Text>
    </div>
  );
};

export { ProjectContentView };
