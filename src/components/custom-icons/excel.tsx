const ExcelIcon = ({
  className,
  size,
}: {
  className?: string;
  size?: number;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    className={className}
    width={`${size || 1}em`}
  >
    <path fill="#4caf50" d="M41 10H25v28h16a1 1 0 0 0 1-1V11a1 1 0 0 0-1-1" />
    <path
      fill="#fff"
      d="M32 15h7v3h-7zm0 10h7v3h-7zm0 5h7v3h-7zm0-10h7v3h-7zm-7-5h5v3h-5zm0 10h5v3h-5zm0 5h5v3h-5zm0-10h5v3h-5z"
    />
    <path fill="#2e7d32" d="M27 42 6 38V10l21-4z" />
    <path
      fill="#fff"
      d="m19.129 31-2.411-4.561q-.137-.256-.284-.938h-.037q-.069.322-.324.979L13.652 31H9.895l4.462-7.001L10.274 17h3.837l2.001 4.196q.234.497.42 1.179h.04q.117-.408.439-1.22L19.237 17h3.515l-4.199 6.939 4.316 7.059h-3.74z"
    />
  </svg>
);

export { ExcelIcon };
