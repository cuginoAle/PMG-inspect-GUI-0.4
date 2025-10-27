import { Project, ProjectStatus } from '@/src/types';
import { useState } from 'react';

const useFetchProjectPciScores = ({
  project,
  status,
}: {
  project: Project | null;
  status: ProjectStatus | null;
}) => {
  const [pciScores, setPciScores] = useState<
    Record<string, Record<string, number | null>>
  >({});

  return pciScores;
};

export { useFetchProjectPciScores };
