import { useNavigate } from 'react-router-dom';
import { MobileContainer } from '@/components/MobileContainer';
import { RankingCard } from '@/components/RankingCard';
import { useStore } from '@/store/useStore';
import { ArrowLeft } from 'lucide-react';

export default function AdminRankings() {
  const navigate = useNavigate();
  
  const isAdmin = useStore(state => state.isAdmin);
  const getMonthlyRankings = useStore(state => state.getMonthlyRankings);

  if (!isAdmin) {
    navigate('/admin/login');
    return null;
  }

  const now = new Date();
  const monthName = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const rankings = getMonthlyRankings(now.getMonth(), now.getFullYear());

  return (
    <MobileContainer>
      {/* Header */}
      <div className="sticky top-0 bg-background z-10 px-6 py-4 border-b border-border">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="p-2 border border-border hover:bg-foreground hover:text-background transition-colors"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1} />
          </button>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Monthly</p>
            <p className="text-lg font-light">Rankings</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-6">
          {monthName}
        </p>

        {rankings.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground font-light">No data for this month</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rankings.map((entry, index) => (
              <RankingCard
                key={entry.worker.id}
                rank={index + 1}
                worker={entry.worker}
                points={entry.points}
                salary={entry.salary}
              />
            ))}
          </div>
        )}
      </div>
    </MobileContainer>
  );
}
