type PCIScoreColourLabels =
  | 'excellent'
  | 'good'
  | 'fair'
  | 'poor'
  | 'failed'
  | 'undefined';

const pciScoreColourCodes: Record<PCIScoreColourLabels, string> = {
  excellent: '#004da8',
  good: '#87b52b',
  fair: '#e6e600',
  poor: '#ffaa01',
  failed: '#a80000',
  undefined: '#808080',
};

const pciScoreToEmoji: Record<PCIScoreColourLabels, string> = {
  excellent: '🟦',
  good: '🟩',
  fair: '🟨',
  poor: '🟧',
  failed: '🟥',
  undefined: '⬜',
};

const pciScoreLabelColour: Record<PCIScoreColourLabels, string> = {
  excellent: '#ffffff',
  good: '#000000ca',
  fair: '#000000ca',
  poor: '#000000ca',
  failed: '#ffffff',
  undefined: '#000000ca',
};

export { pciScoreColourCodes, pciScoreLabelColour, pciScoreToEmoji };
export type { PCIScoreColourLabels };
