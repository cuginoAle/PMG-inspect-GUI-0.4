import { PCIScoreColourLabels } from './pci-score-colour-codes';

const getPciScoreLabelFromValue = (value?: number): PCIScoreColourLabels => {
  if (!value) return 'undefined';
  if (value < 40) {
    return 'failed';
  } else if (value < 55) {
    return 'poor';
  } else if (value < 70) {
    return 'fair';
  } else if (value < 90) {
    return 'good';
  } else {
    return 'excellent';
  }
};

export { getPciScoreLabelFromValue };
