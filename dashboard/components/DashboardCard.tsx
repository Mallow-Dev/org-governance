import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface DashboardCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export function DashboardCard({ title, children, className, icon }: DashboardCardProps) {
  return (
    <div className={twMerge("glass-card p-6 flex flex-col", className)}>
      {(title || icon) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h3 className="text-lg font-semibold text-white/90">{title}</h3>}
          {icon && <div className="text-white/50">{icon}</div>}
        </div>
      )}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
