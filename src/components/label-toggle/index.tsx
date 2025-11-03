import styles from './style.module.css';

type LabelToggleProps = React.HTMLProps<HTMLInputElement> & {
  name: string;
  label_1: string;
  label_2: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const LabelToggle = ({
  name,
  label_1,
  label_2,
  defaultValue = label_1,
  onChange,
}: LabelToggleProps) => {
  return (
    <div className={styles.root}>
      <label className={styles.label}>
        <input
          onChange={onChange}
          type="radio"
          name={name}
          value={label_1}
          defaultChecked={defaultValue === label_1}
        />
        <span className={styles.labelTextWrapper}>
          <span className={styles.labelText}>{label_1}</span>
        </span>
      </label>
      <label className={styles.label}>
        <input
          onChange={onChange}
          type="radio"
          name={name}
          value={label_2}
          defaultChecked={defaultValue === label_2}
        />
        <span className={styles.labelTextWrapper}>
          <span className={styles.labelText}>{label_2}</span>
        </span>
      </label>
    </div>
  );
};

export { LabelToggle };
