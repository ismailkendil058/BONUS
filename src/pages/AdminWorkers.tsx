import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileContainer } from '@/components/MobileContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore } from '@/store/useStore';
import { ArrowLeft, Plus, Trash2, Power } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminWorkers() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  
  const isAdmin = useStore(state => state.isAdmin);
  const workers = useStore(state => state.workers);
  const addWorker = useStore(state => state.addWorker);
  const updateWorker = useStore(state => state.updateWorker);
  const deleteWorker = useStore(state => state.deleteWorker);
  const getWorkerPoints = useStore(state => state.getWorkerPoints);

  if (!isAdmin) {
    navigate('/admin/login');
    return null;
  }

  const handleAdd = async () => {
    if (!name.trim() || pin.length !== 4) {
      toast.error('Please enter a valid name and 4-digit PIN');
      return;
    }
    
    const existingPin = workers.find(w => w.pin === pin);
    if (existingPin) {
      toast.error('This PIN is already in use');
      return;
    }

    const success = await addWorker(name.trim(), pin);
    if (success) {
      setName('');
      setPin('');
      setShowForm(false);
      toast.success('Worker added successfully');
    } else {
      toast.error('Failed to add worker. PIN might be in use.');
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    await updateWorker(id, { active: !active });
    toast.success(active ? 'Worker deactivated' : 'Worker activated');
  };

  const handleDelete = async (id: string) => {
    await deleteWorker(id);
    toast.success('Worker deleted');
  };

  const now = new Date();

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
              <p className="text-lg font-light">Workers</p>
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
          <h3 className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Add Worker</h3>
          <div className="space-y-4">
            <Input
              placeholder="Worker name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="h-12 border-border"
            />
            <Input
              placeholder="4-digit PIN"
              value={pin}
              onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              maxLength={4}
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

      {/* Workers List */}
      <div className="px-6 py-6 space-y-3">
        {workers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground font-light">No workers yet</p>
          </div>
        ) : (
          workers.map((worker, index) => {
            const points = getWorkerPoints(worker.id, now.getMonth(), now.getFullYear());
            
            return (
              <div
                key={worker.id}
                className={`border border-border p-5 animate-fade-in ${!worker.active ? 'opacity-50' : ''}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-light truncate">{worker.name}</p>
                    <p className="text-xs text-muted-foreground">
                      PIN: {worker.pin} · {points} pts this month
                    </p>
                    <p className={`text-xs mt-1 ${worker.active ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {worker.active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleToggleActive(worker.id, worker.active)}
                      className={`p-2 border transition-colors ${
                        worker.active 
                          ? 'border-border hover:bg-foreground hover:text-background' 
                          : 'border-foreground bg-foreground text-background hover:bg-transparent hover:text-foreground'
                      }`}
                    >
                      <Power className="w-4 h-4" strokeWidth={1} />
                    </button>
                    <button
                      onClick={() => handleDelete(worker.id)}
                      className="p-2 border border-border hover:bg-foreground hover:text-background transition-colors"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </MobileContainer>
  );
}
