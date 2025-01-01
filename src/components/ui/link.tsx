interface LinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export function Link({ href, className, children }: LinkProps) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
