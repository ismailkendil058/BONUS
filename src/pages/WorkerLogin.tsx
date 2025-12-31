import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileContainer } from '@/components/MobileContainer';
import { PinInput } from '@/components/PinInput';
import { useStore } from '@/store/useStore';
import { ArrowLeft } from 'lucide-react';

export default function WorkerLogin() {
  const navigate = useNavigate();
  const loginWorker = useStore(state => state.loginWorker);
  const fetchAll = useStore(state => state.fetchAll);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (pin: string) => {
    setIsLoading(true);
    setError('');
    const worker = await loginWorker(pin);
    if (worker) {
      await fetchAll();
      navigate('/worker/home');
    } else {
      setError('Invalid PIN. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <MobileContainer>
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 p-2 hover:bg-secondary transition-colors"
      >
        <ArrowLeft className="w-5 h-5" strokeWidth={1} />
      </button>
      <PinInput 
        onSubmit={handleSubmit} 
        error={error}
        title="Worker PIN"
        disabled={isLoading}
      />
    </MobileContainer>
  );
}
