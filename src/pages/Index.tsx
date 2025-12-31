import { useNavigate } from 'react-router-dom';
import { MobileContainer } from '@/components/MobileContainer';
import { Button } from '@/components/ui/button';
import { User, Settings } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <MobileContainer className="flex flex-col items-center justify-center px-8">
      {/* Logo / Title */}
      <div className="text-center mb-20 animate-fade-in">
        <h1 className="text-3xl font-extralight tracking-[0.3em] uppercase mb-2">
          Pharmacie
        </h1>
        <p className="text-xs text-muted-foreground tracking-[0.5em] uppercase">
          Bakouche
        </p>
      </div>

      {/* Role Selection */}
      <div className="w-full max-w-xs space-y-4 animate-slide-up">
        <Button
          variant="outline"
          onClick={() => navigate('/worker/login')}
          className="w-full h-24 flex flex-col items-center justify-center gap-3 text-sm font-light uppercase tracking-widest hover:bg-foreground hover:text-background transition-all duration-300"
        >
          <User className="w-6 h-6" strokeWidth={1} />
          Worker
        </Button>

        <Button
          variant="outline"
          onClick={() => navigate('/admin/login')}
          className="w-full h-24 flex flex-col items-center justify-center gap-3 text-sm font-light uppercase tracking-widest hover:bg-foreground hover:text-background transition-all duration-300"
        >
          <Settings className="w-6 h-6" strokeWidth={1} />
          Admin
        </Button>
      </div>

      {/* Footer */}
      <p className="absolute bottom-8 text-xs text-muted-foreground tracking-wider animate-fade-in">
        Internal System
      </p>
    </MobileContainer>
  );
};

export default Index;
