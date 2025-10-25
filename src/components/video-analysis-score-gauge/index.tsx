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
    '--colour-min': `var(--pci-${getPciScoreLabelFromValue(min || undefined)})`,
    '--colour-max': `var(--pci-${getPciScoreLabelFromValue(max || undefined)})`,

    '--label-colour-max': `var(--pci-label-${getPciScoreLabelFromValue(
      max || undefined,
    )})`,
    '--label-colour-min': `var(--pci-label-${getPciScoreLabelFromValue(
      min || undefined,
    )})`,
  } as CSSProperties;

  return (
    <div className={styles.root} style={customStyle}>
      <div className={styles.wrapper}>
        <span className={styles.min}>{min}</span>
        <span className={styles.max}>{max}</span>
      </div>
    </div>
  );
};

export { VideoAnalysisScoreGauge };
