import { GetAnalysisResultResponse } from '@/src/types';
import React from 'react';
import { fetchAnalysisResults } from '@/src/lib/data/fetch-analysis-results';

const useFetchAnalysisResults = (projectPath?: string | null) => {
  const [analysisResults, setAnalysisResults] = React.useState<
    GetAnalysisResultResponse | undefined
  >(undefined);

  React.useEffect(() => {
    if (!projectPath) {
      setAnalysisResults(undefined);
      return;
    }
    let cancelled = false;

    setAnalysisResults({ status: 'loading' });
    fetchAnalysisResults(projectPath)
      .then((response) => {
        if (cancelled) return;

        setAnalysisResults(response);
      })
      .catch((error) => {
        if (!cancelled) setAnalysisResults(error);
      });

    if (cancelled) return;
    return () => {
      cancelled = true;
    };
  }, [projectPath]);

  return analysisResults;
};

export { useFetchAnalysisResults };
