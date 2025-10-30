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
  pciScore?: number | null;
  progress?: number | null;
  hasErrors?: boolean;
}) => {
  const unavailable = pciScore === undefined;
  const fullCircumference = 10 * 6.28; // 10 is the radius of the circle and 2π is the circumference of a circle
  const roundedProgress =
    (progress || 0) > 90 && (progress || 0) < 100 ? 90 : progress || 0; // Cap the progress at 90% if it's between 90 and 100 to avoid full circle overlap
  const cn = classNames(styles.root, {
    [styles.complete]: roundedProgress === 100,
    [styles.unavailable]: unavailable,
  });
  const customStyle = {
    '--progress': roundedProgress
      ? `${fullCircumference - fullCircumference * (roundedProgress / 100)}`
      : fullCircumference,
    '--colour': `var(--pci-${getPciScoreLabelFromValue(
      pciScore || undefined,
    )})`,
    '--label-colour': `var(--pci-label-${getPciScoreLabelFromValue(
      pciScore || undefined,
    )})`,
  } as CSSProperties;

  return (
    <div className={cn} style={customStyle}>
      <CircleIcon className={styles.ring} />
      <span className={styles.score}>{pciScore || '-'}</span>
      {hasErrors && <span className={styles.errorIcon}>!</span>}
    </div>
  );
};

export { VideoAnalysisProgress };
