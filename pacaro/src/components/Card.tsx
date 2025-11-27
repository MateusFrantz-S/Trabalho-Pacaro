type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-white p-4 rounded-xl shadow-2xl ${className}`}>
      {children}
    </div>
  );
}