import { FileInfo } from '@/src/types';
import { use } from 'react';

function Projects({ fetchFn }: { fetchFn: Promise<FileInfo[]> }) {
  const projects = use(fetchFn);

  return (
    <div>
      <h2>Projects</h2>
      {projects.map((project) => project.name).join(', ') ||
        'No Projects Found'}
    </div>
  );
}

export { Projects };
