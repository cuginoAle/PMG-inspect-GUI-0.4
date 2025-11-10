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

const getTreatmentScores = (scores: PciScore[]) => {
  const scoresMap = scores
    ? scores.reduce(
        (sum, v) => {
          if (!!v?.treatment) {
            if (sum.get(v.treatment)) {
              sum.set(v.treatment, (sum.get(v.treatment) || 0) + 1);
            } else {
              sum.set(v.treatment, 1);
            }
          }
          return sum;
        },
        new Map([
          // Initialize with all treatments set to 0
          [0, 0],
          [1, 0],
          [2, 0],
          [3, 0],
          [4, 0],
        ]),
      )
    : new Map();

  return Array.from(scoresMap.entries() || []) as [number, number][];
};

const getAvgPciScoreTreatment = ({
  scores,
  mapping,
}: AvgPciScoreTreatment): string => {
  const scoresMap = getTreatmentScores(scores);
  const treatmentKey = scoresMap
    .toSorted((a, b) => a[1] - b[1])?.[0]?.[0]
    ?.toString();

  if (!treatmentKey) return 'N/A';

  return mapping?.treatment?.[treatmentKey] || 'N/A';
};

export { getAvgPciScoreTreatment, getTreatmentScores, getAvgPciScore };
