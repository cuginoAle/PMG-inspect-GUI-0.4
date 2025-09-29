import styles from './style.module.css';
type ToggleProps = {
  className?: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  name?: string;
  size?: 1 | 2 | 3;
};

const Toggle = ({
  className,
  defaultChecked,
  onChange,
  name,
  size = 1,
}: ToggleProps) => {
  return (
    <label
      className={`${styles.root} ${styles[`size-${size}`]} ${className ?? ''}`}
    >
      <input
        name={name}
        type="checkbox"
        className={styles.input}
        defaultChecked={defaultChecked}
        onChange={(e) => {
          onChange?.(e.target.checked);
        }}
      />
      <span className={styles.toggle} />
    </label>
  );
};
export { Toggle };
