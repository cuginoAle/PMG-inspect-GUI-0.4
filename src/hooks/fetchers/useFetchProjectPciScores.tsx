import {
  GetAiPciScoreResponse,
  ProcessingConfiguration,
  Project,
} from '@/src/types';
import { useEffect, useState } from 'react';
import { fetchPciScore } from '@/src/lib/data/fetch-pci-scores';

const useFetchProjectPciScores = ({
  project,
  processingConfigurations,
}: {
  project?: Project | null;
  processingConfigurations?: ProcessingConfiguration[] | null;
}) => {
  const [pciScores, setPciScores] = useState<
    GetAiPciScoreResponse | undefined
  >();

  useEffect(() => {
    if (!project || !processingConfigurations) {
      setPciScores({ status: 'loading' });
      return;
    }
    let cancelled = false;
    const videoUrls = Object.values(project?.items || {}).map(
      (item) => item.video_url,
    );

    if (!processingConfigurations || videoUrls.length === 0) {
      setPciScores({ status: 'loading' });
      return;
    }

    fetchPciScore({
      videosUrl: videoUrls,
      processingConfigurations,
    })
      .then((scores) => {
        if (cancelled) return;
        setPciScores(scores);
      })
      .catch((error) => {
        if (cancelled) return;
        setPciScores(error);
      });

    return () => {
      cancelled = true;
    };
  }, [project, processingConfigurations]);

  return pciScores;
};

export { useFetchProjectPciScores };
