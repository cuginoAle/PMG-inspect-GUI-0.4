import { FileInfo } from '@/src/app/protected/api/projects/type';
import { getFileType } from '@/src/helpers/get-file-type';
import { Text } from '@radix-ui/themes';

type ProjectContentViewProps = {
  selectedFile?: FileInfo;
};

// Placeholder for actual content viewer
const fileTypeDict = {
  image: '🖼️',
  video: '🎥',
  other: '📄',
};

const ContentPlaceholder = ({ fileName }: { fileName?: string }) => (
  <div className="center">
    <Text size="6" weight="light">
      <Text size="8">{fileTypeDict[getFileType(fileName || '')]}</Text>{' '}
      {fileName}
    </Text>
  </div>
);
const ProjectContentView = ({ selectedFile }: ProjectContentViewProps) => {
  return selectedFile ? (
    <ContentPlaceholder fileName={selectedFile.name} />
  ) : (
    <div className="center">
      <Text size="6" weight="light">
        <Text size="8">🤷</Text> no project selected...
      </Text>
    </div>
  );
};

export { ProjectContentView };
