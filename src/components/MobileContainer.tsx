import { ReactNode } from 'react';

interface MobileContainerProps {
  children: ReactNode;
  className?: string;
}

export function MobileContainer({ children, className = '' }: MobileContainerProps) {
  return (
    <div className={`mobile-container bg-background min-h-screen ${className}`}>
      {children}
    </div>
  );
}
