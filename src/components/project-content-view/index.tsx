import { FileInfo } from '@/src/app/protected/api/projects/type';
import { Text } from '@radix-ui/themes';

type ProjectContentViewProps = {
  selectedFile?: FileInfo;
};

const ProjectContentView = ({ selectedFile }: ProjectContentViewProps) => {
  return selectedFile ? (
    <div>Project Content View: {selectedFile?.name}</div>
  ) : (
    <div className="center">
      <Text size="6" weight="light">
        <Text size="8">🤷</Text> no project selected...
      </Text>
    </div>
  );
};

export { ProjectContentView };
