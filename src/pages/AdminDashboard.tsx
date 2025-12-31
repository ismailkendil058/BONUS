import { useNavigate } from 'react-router-dom';
import { MobileContainer } from '@/components/MobileContainer';
import { StatCard } from '@/components/StatCard';
import { useStore } from '@/store/useStore';
import { LogOut, Users, Package, Trophy, TrendingUp } from 'lucide-react';
import { useEffect } from 'react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  const isInitialized = useStore(state => state.isInitialized);
  const isAdmin = useStore(state => state.isAdmin);
  const workers = useStore(state => state.workers);
  const products = useStore(state => state.products);
  const sales = useStore(state => state.sales);
  const logout = useStore(state => state.logout);
  const getMonthlyRankings = useStore(state => state.getMonthlyRankings);
  const fetchAll = useStore(state => state.fetchAll);

  useEffect(() => {
    if (isInitialized && isAdmin) {
      fetchAll();
    }
  }, [isInitialized, isAdmin, fetchAll]);

  // Redirect if not admin after initialization
  useEffect(() => {
    if (isInitialized && !isAdmin) {
      navigate('/admin/login');
    }
  }, [isInitialized, isAdmin, navigate]);

  // Render nothing until initialization is complete and admin status is confirmed
  if (!isInitialized || !isAdmin) {
    return null;
  }

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Calculate monthly stats
  const monthlySales = sales.filter(sale => {
    const saleDate = new Date(sale.createdAt);
    return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
  });
  const monthlyPoints = monthlySales.reduce((sum, sale) => sum + sale.totalPoints, 0);
  const monthlySalary = monthlyPoints * 10;

  const rankings = getMonthlyRankings(currentMonth, currentYear);
  const topWorker = rankings[0];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { icon: TrendingUp, label: 'Statistics', path: '/admin/stats' },
    { icon: Trophy, label: 'Rankings', path: '/admin/rankings' },
    { icon: Users, label: 'Workers', path: '/admin/workers' },
    { icon: Package, label: 'Products', path: '/admin/products' },
  ];

  return (
    <MobileContainer>
      {/* Header */}
      <div className="sticky top-0 bg-background z-10 px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Admin</p>
            <p className="text-lg font-light">Dashboard</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-3 border border-border hover:bg-foreground hover:text-background transition-colors"
          >
            <LogOut className="w-5 h-5" strokeWidth={1} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">


        {/* Monthly Overview */}
        <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <h2 className="text-xs text-muted-foreground uppercase tracking-widest mb-4">This Month</h2>
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Total Points" value={monthlyPoints} large />
            <StatCard label="Total Salary" value={`${monthlySalary.toLocaleString()} DA`} large />
          </div>
        </div>

        {/* Top Performer */}
        {topWorker && (
          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h2 className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Top Performer</h2>
            <div className="border border-border p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 border border-foreground flex items-center justify-center">
                  <span className="text-2xl font-extralight">1</span>
                </div>
                <div className="flex-1">
                  <p className="text-lg font-light">{topWorker.worker.name}</p>
                  <p className="text-sm text-muted-foreground">{topWorker.points} pts · {topWorker.salary.toLocaleString()} DA</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
          <h2 className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Overview</h2>
          <div className="grid grid-cols-2 gap-3">
            <StatCard 
              label="Workers" 
              value={workers.filter(w => w.active).length} 
              sublabel={`${workers.length} total`}
            />
            <StatCard 
              label="Products" 
              value={products.filter(p => p.active).length} 
              sublabel={`${products.length} total`}
            />
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
          <h2 className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Manage</h2>
          <div className="grid grid-cols-2 gap-3">
            {menuItems.map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="border border-border p-6 flex flex-col items-center gap-3 hover:bg-foreground hover:text-background transition-all duration-200 active:scale-95"
              >
                <item.icon className="w-6 h-6" strokeWidth={1} />
                <span className="text-xs uppercase tracking-widest">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </MobileContainer>
  );
}