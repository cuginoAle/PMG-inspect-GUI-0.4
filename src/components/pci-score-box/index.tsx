import { getPciScoreLabelFromValue } from '@/src/helpers/get-pci-score-label-from-value';
import styles from './style.module.css';
import classNames from 'classnames';
import { sizeType } from '@/src/types';

type PciScoreBoxProps = {
  value?: number;
  size?: sizeType;
  className?: string;
};

const PciScoreBox = ({
  value,
  size = 'small',
  className,
}: PciScoreBoxProps) => {
  const scoreLabel = getPciScoreLabelFromValue(value);
  const cn = classNames(
    styles.root,
    styles[size as keyof typeof styles],
    className,
    {
      [styles.na]: value === undefined,
    },
  );
  return (
    <span
      className={cn}
      style={{
        color: `var(--pci-label-${scoreLabel})`,
        backgroundColor: `var(--pci-${scoreLabel})`,
      }}
    >
      <span>{value}</span>
    </span>
  );
};

export { PciScoreBox };
