"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { theme } from "@/lib/theme";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={props.id} 
            className={`block mb-2 text-sm font-medium text-[${theme.colors.text}]`}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            className={`w-full p-3 rounded-lg border border-[${theme.colors.border}] 
              bg-white text-[${theme.colors.text}] placeholder:text-[${theme.colors.textLight}]
              focus:outline-none focus:ring-2 focus:ring-[${theme.colors.accent}] 
              ${icon ? 'pl-10' : ''}
              ${error ? `border-[${theme.colors.error}] focus:ring-[${theme.colors.error}]` : ""} 
              ${className}`}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className={`mt-1 text-sm text-[${theme.colors.error}]`}>{error}</p>
        )}
      </div>
    );
  }
); 