import { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Minus, Plus, X } from 'lucide-react';

interface CartSummaryProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onConfirm: () => void;
  onClear: () => void;
  isReturnMode?: boolean;
}

export function CartSummary({ items, onUpdateQuantity, onRemove, onConfirm, onClear, isReturnMode = false }: CartSummaryProps) {
  const totalPoints = items.reduce((sum, item) => sum + (item.points * item.quantity), 0);

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border animate-slide-up">
      <div className="mobile-container px-6 py-4">
        {/* Cart Items */}
        <div className="max-h-48 overflow-y-auto mb-4 space-y-3">
          {items.map(item => (
            <div key={item.productId} className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-light truncate">{item.productName}</p>
                <p className="text-xs text-muted-foreground">
                  {item.points} pts × {item.quantity} = {item.points * item.quantity} pts
                </p>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <button
                  onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                  className="w-8 h-8 border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-sm font-light">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                  className="w-8 h-8 border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onRemove(item.productId)}
                  className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Total & Actions */}
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {isReturnMode ? 'Return Total' : 'Total'}
            </p>
            <p className="text-2xl font-extralight">{isReturnMode ? '-' : ''}{totalPoints} pts</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClear}
              className="h-12 px-6 text-xs uppercase tracking-widest"
            >
              Clear
            </Button>
            <Button
              onClick={onConfirm}
              className="h-12 px-8 text-xs uppercase tracking-widest"
            >
              {isReturnMode ? 'Return' : 'Confirm'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
