'use client'

import Image from 'next/image'
import Link from 'next/link'

interface IconButtonProps {
  onClick?: () => void;
  href?: string;
  src: string;
  alt: string;
  className?: string;
  ariaLabel: string;
}

export default function IconButton({ onClick, href, src, alt, className, ariaLabel }: IconButtonProps) {
  const commonProps = {
    className: `p-2 rounded-full transition-colors flex items-center justify-center ${className}`,
    'aria-label': ariaLabel,
  };

  if (href) {
    return (
      <Link href={href} {...commonProps} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
        <Image src={src} alt={alt} width={24} height={24} />
      </Link>
    );
  }

  return (
    <button onClick={onClick} {...commonProps}>
      <Image src={src} alt={alt} width={24} height={24} />
    </button>
  );
}
