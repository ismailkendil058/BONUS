import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileContainer } from '@/components/MobileContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore } from '@/store/useStore';
import { ArrowLeft, Plus, Trash2, Power } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminProducts() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [points, setPoints] = useState('');
  const [quantity, setQuantity] = useState('');
  
  const isAdmin = useStore(state => state.isAdmin);
  const products = useStore(state => state.products);
  const addProduct = useStore(state => state.addProduct);
  const updateProduct = useStore(state => state.updateProduct);
  const deleteProduct = useStore(state => state.deleteProduct);

  if (!isAdmin) {
    navigate('/admin/login');
    return null;
  }

  const handleAdd = async () => {
    if (!name.trim() || !points || Number(points) <= 0) {
      toast.error('Please enter a valid name and points value');
      return;
    }

    const success = await addProduct(name.trim(), Number(points), Number(quantity) || 0);
    if (success) {
      setName('');
      setPoints('');
      setQuantity('');
      setShowForm(false);
      toast.success('Product added successfully');
    } else {
      toast.error('Failed to add product');
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    await updateProduct(id, { active: !active });
    toast.success(active ? 'Product hidden from workers' : 'Product visible to workers');
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    toast.success('Product deleted');
  };

  // Group products by points
  const groupedProducts = products.reduce<Record<number, typeof products>>((acc, product) => {
    if (!acc[product.points]) {
      acc[product.points] = [];
    }
    acc[product.points].push(product);
    return acc;
  }, {});

  const sortedGroups = Object.entries(groupedProducts)
    .sort(([a], [b]) => Number(a) - Number(b));

  return (
    <MobileContainer>
      {/* Header */}
      <div className="sticky top-0 bg-background z-10 px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 border border-border hover:bg-foreground hover:text-background transition-colors"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={1} />
            </button>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Manage</p>
              <p className="text-lg font-light">Products</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="p-3 border border-border hover:bg-foreground hover:text-background transition-colors"
          >
            <Plus className="w-5 h-5" strokeWidth={1} />
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="px-6 py-6 border-b border-border animate-slide-up">
          <h3 className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Add Product</h3>
          <div className="space-y-4">
            <Input
              placeholder="Product name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="h-12 border-border"
            />
            <Input
              placeholder="Points value"
              type="number"
              min="1"
              value={points}
              onChange={e => setPoints(e.target.value)}
              className="h-12 border-border"
            />
            <Input
              placeholder="Quantity available (optional)"
              type="number"
              min="0"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              className="h-12 border-border"
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowForm(false)}
                className="flex-1 h-12"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAdd}
                className="flex-1 h-12"
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Products List */}
      <div className="px-6 py-6 space-y-6">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground font-light">No products yet</p>
          </div>
        ) : (
          sortedGroups.map(([pointsValue, groupProducts]) => (
            <div key={pointsValue} className="animate-fade-in">
              <h3 className="text-xs text-muted-foreground uppercase tracking-widest mb-3">
                {pointsValue}-Point Products
              </h3>
              <div className="space-y-3">
                {groupProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className={`border border-border p-4 animate-fade-in ${!product.active ? 'opacity-50' : ''}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-light truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.points} pts · Qty: {product.quantity}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleToggleActive(product.id, product.active)}
                          className={`p-2 border transition-colors ${
                            product.active 
                              ? 'border-border hover:bg-foreground hover:text-background' 
                              : 'border-foreground bg-foreground text-background hover:bg-transparent hover:text-foreground'
                          }`}
                        >
                          <Power className="w-4 h-4" strokeWidth={1} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 border border-border hover:bg-foreground hover:text-background transition-colors"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={1} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </MobileContainer>
  );
}
