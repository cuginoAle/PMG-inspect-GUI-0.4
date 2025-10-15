const CircleIcon = ({
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
    stroke="currentColor"
    width={`${size || 1}em`}
    strokeWidth="3"
    strokeLinejoin="round"
    strokeLinecap="round"
    fill="none"
  >
    <circle
      className="circle-track"
      cx="12"
      cy="12"
      r="10"
      stroke="rgba(255,255,255,0.3)"
    />
    <circle
      stroke="rgba(255, 106, 0, 1)"
      strokeDasharray={10 * 6.28}
      strokeDashoffset="2"
      className="circle-progress"
      cx="12"
      cy="12"
      r="10"
    />
  </svg>
);
export { CircleIcon };
