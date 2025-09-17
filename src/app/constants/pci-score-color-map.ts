type PciScoreKeys = 'failed' | 'poor' | 'fair' | 'good' | 'excellent';

const PciScoreColorMap: Record<PciScoreKeys, string> = {
  failed: '#a80000',
  poor: '#ffaa01',
  fair: '#e6e600',
  good: '#87b52b',
  excellent: '#004da8',
};

export { PciScoreColorMap };
export type { PciScoreKeys };
