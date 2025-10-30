const CalculatorIcon = ({
  className,
  size,
}: {
  className?: string;
  size?: number;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    className={className}
    width={`${size || 1}em`}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 7h6M15 17v-3M15 11h.01M12 11h.01M9 11h.01M9 14h.01M12 14h.01M12 17h.01M9 17h.01"
    />
    <path
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 7c0-1.886 0-2.828.586-3.414S7.114 3 9 3h6c1.886 0 2.828 0 3.414.586S19 5.114 19 7v10c0 1.886 0 2.828-.586 3.414S16.886 21 15 21H9c-1.886 0-2.828 0-3.414-.586S5 18.886 5 17V7Z"
    />
  </svg>
);

export { CalculatorIcon };
