import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface MonthScrollerProps {
  selectedMonth: number;
  selectedYear: number;
  onSelect: (month: number, year: number) => void;
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export function MonthScroller({ selectedMonth, selectedYear, onSelect }: MonthScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Generate last 12 months
  const months: { month: number; year: number; label: string }[] = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentYear, currentMonth - i, 1);
    months.push({
      month: date.getMonth(),
      year: date.getFullYear(),
      label: `${MONTHS[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`
    });
  }

  useEffect(() => {
    // Auto-scroll to selected month
    if (scrollRef.current) {
      const selectedElement = scrollRef.current.querySelector('[data-selected="true"]');
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [selectedMonth, selectedYear]);

  return (
    <div 
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide -mx-6 px-6"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {months.map(({ month, year, label }) => {
        const isSelected = month === selectedMonth && year === selectedYear;
        const isCurrent = month === currentMonth && year === currentYear;
        
        return (
          <button
            key={`${month}-${year}`}
            data-selected={isSelected}
            onClick={() => onSelect(month, year)}
            className={cn(
              "flex-shrink-0 px-4 py-2.5 border transition-all duration-200 min-w-[72px]",
              "text-sm font-light tracking-wide",
              isSelected 
                ? "bg-foreground text-background border-foreground" 
                : "bg-background text-foreground border-border hover:border-foreground",
              isCurrent && !isSelected && "border-foreground/50"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
