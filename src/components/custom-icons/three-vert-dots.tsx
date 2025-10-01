const ThreeVertDots = ({
  className,
  size,
}: {
  className?: string;
  size?: number;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    width={`${size || 1}em`}
    fill="currentColor"
  >
    <path d="M12 7a2 2 0 1 0-2-2 2 2 0 0 0 2 2Zm0 10a2 2 0 1 0 2 2 2 2 0 0 0-2-2Zm0-7a2 2 0 1 0 2 2 2 2 0 0 0-2-2Z" />
  </svg>
);

export { ThreeVertDots };
