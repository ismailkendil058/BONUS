import { Product } from '@/types';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  selected?: boolean;
}

export function ProductCard({ product, onAdd, selected }: ProductCardProps) {
  return (
    <button
      onClick={() => onAdd(product)}
      className={`aspect-square border p-4 flex flex-col justify-between text-left transition-all duration-200 active:scale-95 ${
        selected 
          ? 'bg-foreground text-background border-foreground' 
          : 'border-border hover:border-foreground'
      }`}
    >
      <div>
        <h3 className="text-sm font-light leading-tight">{product.name}</h3>
      </div>
      <div className="flex items-end justify-between">
        <span className={`text-lg font-extralight ${selected ? 'text-background' : 'text-muted-foreground'}`}>
          +{product.points} pts
        </span>
        <Plus className={`w-5 h-5 ${selected ? 'text-background' : 'text-muted-foreground'}`} />
      </div>
    </button>
  );
}
