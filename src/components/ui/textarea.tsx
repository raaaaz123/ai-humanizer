"use client";

import { TextareaHTMLAttributes, forwardRef } from "react";
import { themeClasses } from "@/lib/theme";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className = "", label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={props.id} 
            className={themeClasses.primaryText + " block mb-2 text-sm font-medium"}
          >
            {label}
          </label>
        )}
        <textarea
          className={`w-full min-h-32 p-4 rounded-lg border border-[#e2e8f0] 
            bg-white text-[#1e293b] placeholder:text-[#64748b]
            focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] 
            resize-none ${error ? `border-[#ef4444] focus:ring-[#ef4444]` : ""} ${className}`}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-[#ef4444]">{error}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";
