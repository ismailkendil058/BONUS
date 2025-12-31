import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface PinInputProps {
  onSubmit: (pin: string) => void;
  error?: string;
  title?: string;
  disabled?: boolean;
}

export function PinInput({ onSubmit, error, title = "Enter Your PIN", disabled = false }: PinInputProps) {
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNumberClick = (num: string) => {
    if (activeIndex >= 4) return;
    
    const newPin = [...pin];
    newPin[activeIndex] = num;
    setPin(newPin);
    setActiveIndex(activeIndex + 1);
  };

  const handleDelete = () => {
    if (activeIndex === 0) return;
    
    const newPin = [...pin];
    newPin[activeIndex - 1] = '';
    setPin(newPin);
    setActiveIndex(activeIndex - 1);
  };

  const handleSubmit = () => {
    const fullPin = pin.join('');
    if (fullPin.length === 4) {
      onSubmit(fullPin);
    }
  };

  const handleClear = () => {
    setPin(['', '', '', '']);
    setActiveIndex(0);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8 animate-fade-in">
      <h1 className="text-2xl font-extralight tracking-wider mb-16 uppercase">
        {title}
      </h1>

      {/* PIN Display */}
      <div className="flex gap-6 mb-8">
        {pin.map((digit, index) => (
          <div
            key={index}
            className={`w-14 h-14 border flex items-center justify-center text-2xl font-light transition-all duration-200 ${
              index === activeIndex 
                ? 'border-foreground' 
                : digit 
                  ? 'border-foreground bg-foreground text-background' 
                  : 'border-border'
            }`}
          >
            {digit ? '•' : ''}
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-foreground text-sm font-light mb-6 animate-fade-in">
          {error}
        </p>
      )}

      {/* Number Pad */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => handleNumberClick(num.toString())}
            className="w-16 h-16 border border-border text-xl font-light hover:bg-foreground hover:text-background transition-all duration-200 active:scale-95"
          >
            {num}
          </button>
        ))}
        <button
          onClick={handleClear}
          className="w-16 h-16 border border-border text-xs font-light hover:bg-foreground hover:text-background transition-all duration-200 active:scale-95 uppercase tracking-wider"
        >
          Clear
        </button>
        <button
          onClick={() => handleNumberClick('0')}
          className="w-16 h-16 border border-border text-xl font-light hover:bg-foreground hover:text-background transition-all duration-200 active:scale-95"
        >
          0
        </button>
        <button
          onClick={handleDelete}
          className="w-16 h-16 border border-border text-xs font-light hover:bg-foreground hover:text-background transition-all duration-200 active:scale-95 uppercase tracking-wider"
        >
          Del
        </button>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={pin.join('').length !== 4 || disabled}
        className="w-full max-w-xs h-14 text-sm font-light uppercase tracking-widest"
      >
        Access
      </Button>
    </div>
  );
}
