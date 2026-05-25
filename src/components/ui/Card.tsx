import React from 'react';
import { cn } from '@/lib/utils';

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("bg-card text-card-foreground rounded-2xl border shadow-sm", className)}>
    {children}
  </div>
);

export const CardHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)}>
    {children}
  </div>
);

export const CardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)}>
    {children}
  </h3>
);

export const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("p-6 pt-0", className)}>
    {children}
  </div>
);
