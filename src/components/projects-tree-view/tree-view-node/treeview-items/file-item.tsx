import { FileInfo } from '@/src/types';
import Link from 'next/link';
import { FileLogoTitle } from '@/src/components/file-logo-title';

const FileItem = ({
  itemInfo,
  className,
}: {
  itemInfo: FileInfo;
  className?: string;
}) => {
  const fileType = itemInfo.file_type as 'project' | 'video' | 'image';

  return (
    <Link
      href={{
        query: { path: itemInfo.relative_path! },
      }}
    >
      <FileLogoTitle
        className={className}
        fileType={fileType}
        label={itemInfo.name}
      />
    </Link>
  );
};

export { FileItem };
