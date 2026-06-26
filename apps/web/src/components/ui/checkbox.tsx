import React from 'react';
import { cn } from '../../lib/utils';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <label className={cn("relative flex items-center justify-center cursor-pointer group", className)}>
        <input
          type="checkbox"
          ref={ref}
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          {...props}
        />
        <div className={cn(
          "w-5 h-5 rounded-full border-2 border-[var(--border-default)] transition-colors flex items-center justify-center",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--border-focus)] peer-focus-visible:ring-offset-2",
          checked 
            ? "bg-primary-500 border-primary-500 text-white" 
            : "bg-transparent group-hover:border-primary-400 text-transparent"
        )}>
          <motion.div
            initial={false}
            animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Check className="h-3 w-3 stroke-[3]" />
          </motion.div>
        </div>
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";
