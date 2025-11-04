import { ProcessingConfiguration, Project } from '@/src/types';
import { useEffect, useState } from 'react';
import { fetchPciScore } from '@/src/lib/data/fetch-pci-scores';

// TODO: refactor this to send just ONE request for ALL videos in the project

const useFetchProjectPciScores = ({
  project,
  processingConfiguration,
}: {
  project?: Project | null;
  processingConfiguration?: ProcessingConfiguration[] | null;
}) => {
  const [pciScores, setPciScores] = useState<
    Record<string, Record<string, number | null>>
  >({});

  useEffect(() => {
    let cancelled = false;
    const videoUrls = Object.values(project?.items || {}).map(
      (item) => item.video_url,
    );

    if (!processingConfiguration || videoUrls.length === 0) {
      setPciScores({});
      return;
    }
    const scoresObj: Record<string, Record<string, number | null>> = {};

    try {
      videoUrls.forEach(async (url) => {
        await fetchPciScore({
          videoUrl: url,
          processingConfiguration: processingConfiguration?.[0],
        })
          .then((scores) => {
            if (cancelled) return;
            scoresObj[url] = scores || {};
          })
          .catch(() => {
            if (cancelled) return;
            scoresObj[url] = {};
          });
      });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch PCI scores');
    }

    setPciScores(scoresObj);

    return () => {
      cancelled = true;
    };
  }, [project, processingConfiguration]);

  return pciScores;
};

export { useFetchProjectPciScores };
