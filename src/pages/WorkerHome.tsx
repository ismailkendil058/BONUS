import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileContainer } from '@/components/MobileContainer';
import { ProductCard } from '@/components/ProductCard';
import { CartSummary } from '@/components/CartSummary';
import { useStore } from '@/store/useStore';
import { LogOut, CheckCircle, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export default function WorkerHome() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isReturnMode, setIsReturnMode] = useState(false);
  
  const currentWorker = useStore(state => state.currentWorker);
  const products = useStore(state => state.products);
  const cart = useStore(state => state.cart);
  const logout = useStore(state => state.logout);
  const addToCart = useStore(state => state.addToCart);
  const updateCartQuantity = useStore(state => state.updateCartQuantity);
  const removeFromCart = useStore(state => state.removeFromCart);
  const clearCart = useStore(state => state.clearCart);
  const confirmSale = useStore(state => state.confirmSale);
  const confirmReturn = useStore(state => state.confirmReturn);

  // Redirect if not logged in
  if (!currentWorker) {
    navigate('/worker/login');
    return null;
  }

  // Group products by points
  const groupedProducts = useMemo(() => {
    const activeProducts = products.filter(p => p.active);
    const groups: Record<number, typeof products> = {};
    
    activeProducts.forEach(product => {
      if (!groups[product.points]) {
        groups[product.points] = [];
      }
      groups[product.points].push(product);
    });

    return Object.entries(groups)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([points, products]) => ({
        points: Number(points),
        products,
      }));
  }, [products]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleConfirm = async () => {
    if (isReturnMode) {
      await confirmReturn();
      setShowSuccess(true);
      toast.success('Return confirmed successfully!');
      setTimeout(() => {
        setShowSuccess(false);
        setIsReturnMode(false);
      }, 2000);
    } else {
      await confirmSale();
      setShowSuccess(true);
      toast.success('Entry confirmed successfully!');
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  const toggleReturnMode = () => {
    clearCart();
    setIsReturnMode(!isReturnMode);
  };

  const cartProductIds = cart.map(item => item.productId);

  return (
    <MobileContainer className="pb-64">
      {/* Success Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 bg-background flex items-center justify-center animate-fade-in">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4" strokeWidth={1} />
            <p className="text-xl font-light">{isReturnMode ? 'Return Confirmed' : 'Entry Confirmed'}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 bg-background z-10 px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Welcome</p>
            <p className="text-lg font-light">{currentWorker.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleReturnMode}
              className={`p-3 border transition-colors ${
                isReturnMode 
                  ? 'bg-foreground text-background border-foreground' 
                  : 'border-border hover:bg-foreground hover:text-background'
              }`}
            >
              <RotateCcw className="w-5 h-5" strokeWidth={1} />
            </button>
            <button
              onClick={handleLogout}
              className="p-3 border border-border hover:bg-foreground hover:text-background transition-colors"
            >
              <LogOut className="w-5 h-5" strokeWidth={1} />
            </button>
          </div>
        </div>
        {isReturnMode && (
          <div className="mt-3 py-2 px-3 border border-border bg-muted/30">
            <p className="text-xs uppercase tracking-wider text-center">Return Mode Active</p>
          </div>
        )}
      </div>

      {/* Product Categories */}
      <div className="px-6 py-6 space-y-8">
        {groupedProducts.map(({ points, products }) => (
          <div key={points} className="animate-fade-in">
            <h2 className="text-xs text-muted-foreground uppercase tracking-widest mb-4">
              {isReturnMode ? 'Return: ' : ''}{points}-Point Products
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={addToCart}
                  selected={cartProductIds.includes(product.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <CartSummary
        items={cart}
        onUpdateQuantity={updateCartQuantity}
        onRemove={removeFromCart}
        onConfirm={handleConfirm}
        onClear={clearCart}
        isReturnMode={isReturnMode}
      />
    </MobileContainer>
  );
}
