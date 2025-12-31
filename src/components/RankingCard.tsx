import { Worker } from '@/types';

interface RankingCardProps {
  rank: number;
  worker: Worker;
  points: number;
  salary: number;
}

export function RankingCard({ rank, worker, points, salary }: RankingCardProps) {
  const isTopThree = rank <= 3;

  return (
    <div 
      className={`border border-border p-5 flex items-center gap-4 animate-fade-in transition-all ${
        isTopThree ? 'py-6' : ''
      }`}
      style={{ animationDelay: `${rank * 50}ms` }}
    >
      <div className={`flex items-center justify-center ${isTopThree ? 'w-12 h-12' : 'w-10 h-10'} border border-foreground`}>
        <span className={`font-extralight ${isTopThree ? 'text-2xl' : 'text-lg'}`}>{rank}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-light truncate ${isTopThree ? 'text-lg' : 'text-base'}`}>
          {worker.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {points} points
        </p>
      </div>
      <div className="text-right">
        <p className={`font-extralight ${isTopThree ? 'text-xl' : 'text-lg'}`}>
          {salary.toLocaleString()} DA
        </p>
      </div>
    </div>
  );
}
