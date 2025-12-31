interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  large?: boolean;
}

export function StatCard({ label, value, sublabel, large }: StatCardProps) {
  return (
    <div className="border border-border p-6 animate-fade-in">
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">{label}</p>
      <p className={`font-extralight ${large ? 'text-4xl' : 'text-2xl'}`}>{value}</p>
      {sublabel && (
        <p className="text-xs text-muted-foreground mt-1">{sublabel}</p>
      )}
    </div>
  );
}
