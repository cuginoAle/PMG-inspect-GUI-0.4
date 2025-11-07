import { components } from '@/src/types/api/api';

type PciScore = {
  pci_score?: number | null;
  treatment?: number | null;
  result_source: components['schemas']['ResultSource'];
} | null;

type AvgPciScoreTreatment = {
  scores: PciScore[];
  mapping: { treatment?: Record<string, string> } | undefined; // TODO: this type should come from API types
};

const getAvgPciScore = (scores: PciScore[]): number | null => {
  return scores.length > 0
    ? Math.round(
        scores.reduce((sum, v) => sum + (v?.pci_score || 0), 0) / scores.length,
      )
    : null;
};

const getSortedTreatmentScores = (scores: PciScore[]) => {
  const scoresMap = scores
    ? scores.reduce((sum, v) => {
        if (sum.get(v?.treatment)) {
          sum.set(v?.treatment, (sum.get(v?.treatment) || 0) + 1);
        } else {
          sum.set(v?.treatment, 1);
        }
        return sum;
      }, new Map())
    : new Map();

  // Sort treatments by their scores in descending order
  const sortedScores = Array.from(scoresMap.entries() || []);
  sortedScores.sort((a, b) => -a[1] + b[1]);

  return sortedScores as [number, number][];
};

const getAvgPciScoreTreatment = ({
  scores,
  mapping,
}: AvgPciScoreTreatment): string => {
  const scoresMap = getSortedTreatmentScores(scores);
  const treatmentKey = scoresMap[0]?.[0].toString();

  if (!treatmentKey) return 'N/A';

  return mapping?.treatment?.[treatmentKey] || 'N/A';
};

export { getAvgPciScoreTreatment, getSortedTreatmentScores, getAvgPciScore };
