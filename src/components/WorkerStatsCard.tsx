import { ChevronRight } from 'lucide-react';

interface WorkerStatsCardProps {
  name: string;
  points: number;
  entries: number;
  onClick: () => void;
  index: number;
}

export function WorkerStatsCard({ name, points, entries, onClick, index }: WorkerStatsCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full border border-border p-5 flex items-center justify-between hover:border-foreground transition-all duration-200 animate-fade-in active:scale-[0.98]"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="text-left">
        <p className="font-light text-base mb-1">{name}</p>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>{points} pts</span>
          <span>{entries} entries</span>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground" strokeWidth={1} />
    </button>
  );
}
