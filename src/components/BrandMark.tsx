interface BrandMarkProps {
  className?: string;
}

export function BrandMark({ className = '' }: BrandMarkProps) {
  return (
    <svg
      className={`brand-mark ${className}`.trim()}
      width="28"
      height="28"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="9" fill="#1C1917" />
      <path
        d="M7.5 24V8h3.4l4.6 11.2L20.1 8H23.5v16h-2.9V13.1L16.4 24h-1.3L10.4 13.1V24H7.5z"
        fill="#F4F1EA"
      />
      <circle cx="24.2" cy="9" r="2.4" fill="#C2410C" />
    </svg>
  );
}
