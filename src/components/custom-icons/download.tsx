const DownloadIcon = ({
  className,
  size,
}: {
  className?: string;
  size?: number;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 18"
    className={className}
    stroke="currentColor"
    width={`${size || 1}em`}
    strokeWidth="1.5"
    strokeLinejoin="round"
    strokeLinecap="round"
    fill="none"
  >
    <polyline className="downloading_arrow" points="8 10 12 14" />
    <polyline className="downloading_arrow" points="16 10 12 14" />
    <polyline className="downloading_arrow" points="12 13 12 5" />

    <polyline className="base" points="5 14 5 17 19 17 19 14" />
  </svg>
);
export { DownloadIcon };
