import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
 variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning' | 'info';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
 const variants = {
 default: "border-transparent bg-primary-500 text-white shadow hover:bg-primary-600",
 secondary: "border-transparent bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:bg-[var(--border-default)]",
 destructive: "border-transparent bg-red-500 text-white shadow hover:bg-red-600",
 outline: "text-[var(--text-primary)] border border-[var(--border-default)]",
 success: "border-transparent bg-green-100 text-green-800 ",
 warning: "border-transparent bg-amber-100 text-amber-800 ",
 info: "border-transparent bg-blue-100 text-blue-800 ",
 };

 return (
 <div
 className={cn(
 "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
 variants[variant],
 className
 )}
 {...props}
 />
 );
}
