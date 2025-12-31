import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileContainer } from '@/components/MobileContainer';
import { StatCard } from '@/components/StatCard';
import { MonthScroller } from '@/components/MonthScroller';
import { WorkerStatsCard } from '@/components/WorkerStatsCard';
import { useStore } from '@/store/useStore';
import { ArrowLeft } from 'lucide-react';

export default function AdminStats() {
  const navigate = useNavigate();
  const now = new Date();
  
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  
  const isAdmin = useStore(state => state.isAdmin);
  const workers = useStore(state => state.workers);
  const sales = useStore(state => state.sales);
  const getWorkerPoints = useStore(state => state.getWorkerPoints);
  const getWorkerSalary = useStore(state => state.getWorkerSalary);

  if (!isAdmin) {
    navigate('/admin/login');
    return null;
  }

  // Today's sales
  const todaySales = sales.filter(sale => {
    const saleDate = new Date(sale.createdAt);
    return saleDate.toDateString() === now.toDateString();
  });

  // Products sold today
  const todayProducts = todaySales.reduce((sum, sale) => {
    return sum + sale.products.reduce((pSum, p) => pSum + p.quantity, 0);
  }, 0);

  // Selected month sales
  const monthlySales = sales.filter(sale => {
    const saleDate = new Date(sale.createdAt);
    return saleDate.getMonth() === selectedMonth && saleDate.getFullYear() === selectedYear;
  });

  const monthlyProducts = monthlySales.reduce((sum, sale) => {
    return sum + sale.products.reduce((pSum, p) => pSum + p.quantity, 0);
  }, 0);

  const monthlyPoints = monthlySales.reduce((sum, sale) => sum + sale.totalPoints, 0);
  const monthlySalary = monthlyPoints * 10;

  const selectedMonthName = new Date(selectedYear, selectedMonth).toLocaleDateString('en-US', { month: 'long' });

  const handleMonthSelect = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  const handleWorkerClick = (workerId: string) => {
    navigate(`/admin/worker/${workerId}?month=${selectedMonth}&year=${selectedYear}`);
  };

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
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Detailed</p>
            <p className="text-lg font-light">Statistics</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-8">
        {/* Today */}
        <div className="animate-fade-in">
          <h2 className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Today</h2>
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Entries" value={todaySales.length} />
            <StatCard label="Products Sold" value={todayProducts} />
          </div>
        </div>

        {/* Month Scroller */}
        <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <h2 className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Select Month</h2>
          <MonthScroller 
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onSelect={handleMonthSelect}
          />
        </div>

        {/* Monthly Summary */}
        <div className="animate-fade-in" style={{ animationDelay: '150ms' }}>
          <h2 className="text-xs text-muted-foreground uppercase tracking-widest mb-4">{selectedMonthName} Summary</h2>
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Total Entries" value={monthlySales.length} />
            <StatCard label="Products Sold" value={monthlyProducts} />
            <StatCard label="Total Points" value={monthlyPoints} large />
            <StatCard label="Total Salary" value={`${monthlySalary.toLocaleString()} DA`} large />
          </div>
        </div>

        {/* Workers for Selected Month */}
        <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <h2 className="text-xs text-muted-foreground uppercase tracking-widest mb-4">
            Workers — {selectedMonthName}
          </h2>
          <p className="text-xs text-muted-foreground mb-4">Tap to view details</p>
          <div className="space-y-3">
            {workers.filter(w => w.active).map((worker, index) => {
              const workerPoints = getWorkerPoints(worker.id, selectedMonth, selectedYear);
              const workerSales = monthlySales.filter(s => s.workerId === worker.id);

              return (
                <WorkerStatsCard
                  key={worker.id}
                  name={worker.name}
                  points={workerPoints}
                  entries={workerSales.length}
                  onClick={() => handleWorkerClick(worker.id)}
                  index={index}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer spacer */}
      <div className="h-8" />
    </MobileContainer>
  );
}
