import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { MobileContainer } from '@/components/MobileContainer';
import { useStore } from '@/store/useStore';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function AdminWorkerDetails() {
  const navigate = useNavigate();
  const { workerId } = useParams<{ workerId: string }>();
  const [searchParams] = useSearchParams();
  
  const month = parseInt(searchParams.get('month') || new Date().getMonth().toString());
  const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
  
  const isAdmin = useStore(state => state.isAdmin);
  const workers = useStore(state => state.workers);
  const sales = useStore(state => state.sales);

  if (!isAdmin) {
    navigate('/admin/login');
    return null;
  }

  const worker = workers.find(w => w.id === workerId);
  
  if (!worker) {
    navigate('/admin/stats');
    return null;
  }

  // Get worker's sales for the selected month
  const workerSales = sales.filter(sale => {
    const saleDate = new Date(sale.createdAt);
    return sale.workerId === workerId &&
      saleDate.getMonth() === month &&
      saleDate.getFullYear() === year;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const totalPoints = workerSales.reduce((sum, sale) => sum + sale.totalPoints, 0);
  const totalProducts = workerSales.reduce((sum, sale) => 
    sum + sale.products.reduce((pSum, p) => pSum + p.quantity, 0), 0
  );

  // Group by date
  const salesByDate = workerSales.reduce((acc, sale) => {
    const dateKey = format(new Date(sale.createdAt), 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(sale);
    return acc;
  }, {} as Record<string, typeof workerSales>);

  return (
    <MobileContainer>
      {/* Header */}
      <div className="sticky top-0 bg-background z-10 px-6 py-4 border-b border-border">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/stats')}
            className="p-2 border border-border hover:bg-foreground hover:text-background transition-colors"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1} />
          </button>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{MONTHS[month]} {year}</p>
            <p className="text-lg font-light">{worker.name}</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="px-6 py-5 border-b border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-extralight">{workerSales.length}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Entries</p>
          </div>
          <div>
            <p className="text-2xl font-extralight">{totalProducts}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Products</p>
          </div>
          <div>
            <p className="text-2xl font-extralight">{totalPoints}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Points</p>
          </div>
        </div>
      </div>

      {/* Sales breakdown by date */}
      <div className="px-6 py-6 space-y-6">
        {Object.keys(salesByDate).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-light">No entries this month</p>
          </div>
        ) : (
          Object.entries(salesByDate).map(([dateKey, daySales], dateIndex) => (
            <div 
              key={dateKey} 
              className="animate-fade-in"
              style={{ animationDelay: `${dateIndex * 100}ms` }}
            >
              <h3 className="text-xs text-muted-foreground uppercase tracking-widest mb-3">
                {format(new Date(dateKey), 'EEEE, MMMM d')}
              </h3>
              <div className="space-y-3">
                {daySales.map((sale, saleIndex) => (
                  <div 
                    key={sale.id} 
                    className="border border-border p-4 animate-fade-in"
                    style={{ animationDelay: `${(dateIndex * 100) + (saleIndex * 50)}ms` }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(sale.createdAt), 'HH:mm')}
                      </p>
                      <p className="font-light">+{sale.totalPoints} pts</p>
                    </div>
                    <div className="space-y-2">
                      {sale.products.map((product, productIndex) => (
                        <div 
                          key={productIndex} 
                          className="flex justify-between text-sm"
                        >
                          <span className="text-muted-foreground">{product.productName}</span>
                          <span className="font-light">
                            {product.quantity}× ({product.points * product.quantity} pts)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer spacer */}
      <div className="h-8" />
    </MobileContainer>
  );
}
