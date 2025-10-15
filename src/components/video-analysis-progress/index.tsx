import { CircleIcon } from 'src/components';
import styles from './style.module.css';
import { CSSProperties } from 'react';
import { getPciScoreLabelFromValue } from '@/src/helpers/get-pci-score-label-from-value';
import classNames from 'classnames';

const VideoAnalysisProgress = ({
  pciScore,
  progress = 0,
  hasErrors,
}: {
  pciScore?: number;
  progress?: number;
  hasErrors?: boolean;
}) => {
  const fullCircumference = 10 * 6.28; // 10 is the radius of the circle and 2π is the circumference of a circle
  const roundedProgress = progress > 90 && progress < 100 ? 90 : progress; // Cap the progress at 90% if it's between 90 and 100 to avoid full circle overlap
  const cn = classNames(styles.root, {
    [styles.complete]: roundedProgress === 100,
  });
  const customStyle = {
    '--progress': roundedProgress
      ? `${fullCircumference - fullCircumference * (roundedProgress / 100)}`
      : fullCircumference,
    '--colour': `var(--pci-${getPciScoreLabelFromValue(pciScore)})`,
    '--label-colour': `var(--pci-label-${getPciScoreLabelFromValue(pciScore)})`,
  } as CSSProperties;

  return (
    <div className={cn} style={customStyle}>
      <CircleIcon className={styles.icon} />
      <span className={styles.score}>{pciScore}</span>
      {hasErrors && <span className={styles.errorIcon}>!</span>}
    </div>
  );
};

export { VideoAnalysisProgress };
