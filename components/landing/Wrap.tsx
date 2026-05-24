export function Wrap({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`w-full max-w-[1240px] mx-auto px-6 md:px-10 ${className}`}>
      {children}
    </div>
  );
}
