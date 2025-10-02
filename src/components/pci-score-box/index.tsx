import { getPciScoreLabelFromValue } from '@/src/helpers/get-pci-score-label-from-value';
import styles from './style.module.css';
import classNames from 'classnames';

type PciScoreBoxProps = {
  value: number;
  size?: 'small' | 'medium' | 'large';
  className?: string;
};

const PciScoreBox = ({
  value,
  size = 'small',
  className,
}: PciScoreBoxProps) => {
  const scoreLabel = getPciScoreLabelFromValue(value);
  const cn = classNames(styles.root, styles[size], className);
  return (
    <span
      className={cn}
      style={{
        color: `var(--pci-label-${scoreLabel})`,
        backgroundColor: `var(--pci-${scoreLabel})`,
      }}
    >
      {value}
    </span>
  );
};

export { PciScoreBox };
