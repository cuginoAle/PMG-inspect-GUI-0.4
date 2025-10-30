type PCIScoreColourLabels = 'excellent' | 'good' | 'fair' | 'poor' | 'failed';

const pciScoreColourCodes: Record<PCIScoreColourLabels, string> = {
  excellent: '#004da8',
  good: '#87b52b',
  fair: '#e6e600',
  poor: '#ffaa01',
  failed: '#a80000',
};

const pciScoreLabelColour: Record<PCIScoreColourLabels, string> = {
  excellent: '#ffffff',
  good: '#000000ca',
  fair: '#000000ca',
  poor: '#000000ca',
  failed: '#ffffff',
};

export { pciScoreColourCodes, pciScoreLabelColour };
export type { PCIScoreColourLabels };
