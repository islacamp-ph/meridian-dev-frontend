import logoUrl from '../assets/meridian-logo.png';

interface BrandMarkProps {
  className?: string;
  size?: number;
}

export function BrandMark({ className = '', size = 28 }: BrandMarkProps) {
  return (
    <img
      className={`brand-mark ${className}`.trim()}
      src={logoUrl}
      alt=""
      width={size}
      height={size}
      decoding="async"
      aria-hidden="true"
    />
  );
}
