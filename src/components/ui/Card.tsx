interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Card({ title, children, className = "" }: CardProps) {
  return (
    <div
      className={`border border-[var(--border-light)] bg-[var(--surface)] p-5 ${className}`}
    >
      {title && (
        <h3 className="mb-3 font-mono text-xs font-medium text-[var(--muted)]">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
