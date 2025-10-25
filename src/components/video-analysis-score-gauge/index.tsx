import { getPciScoreLabelFromValue } from '@/src/helpers/get-pci-score-label-from-value';
import styles from './style.module.css';
import { CSSProperties } from 'react';

const VideoAnalysisScoreGauge = ({
  min,
  max,
}: {
  min?: number;
  max?: number;
}) => {
  const customStyle = {
    '--colour-min': min
      ? `var(--pci-${getPciScoreLabelFromValue(min)})`
      : 'var(--gray-a4)',
    '--colour-max': max
      ? `var(--pci-${getPciScoreLabelFromValue(max)})`
      : 'var(--gray-a4)',

    '--label-colour-max': max
      ? `var(--pci-label-${getPciScoreLabelFromValue(max)})`
      : 'var(--gray-a8)',
    '--label-colour-min': min
      ? `var(--pci-label-${getPciScoreLabelFromValue(min)})`
      : 'var(--gray-a8)',
  } as CSSProperties;

  return (
    <div className={styles.root} style={customStyle}>
      <div className={styles.wrapper}>
        <span className={styles.min}>{min || '-'}</span>
        <span className={styles.max}>{max || '-'}</span>
      </div>
    </div>
  );
};

export { VideoAnalysisScoreGauge };
