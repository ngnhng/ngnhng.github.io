interface LinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export function Link({ href, className, children }: LinkProps) {
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
