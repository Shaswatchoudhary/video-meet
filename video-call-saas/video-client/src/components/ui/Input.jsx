import React, { useState } from 'react';
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const Input = ({ 
  label, 
  type = "text", 
  error, 
  success, 
  showToggle, 
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="space-y-1 w-full group">
      {label && (
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1 group-focus-within:text-blue-400 transition-colors duration-300">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          type={inputType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={twMerge(
            "w-full bg-white/50 backdrop-blur-sm border border-emerald-100 rounded-xl px-4 py-2.5 text-slate-800 transition-all duration-300 outline-none text-sm shadow-sm",
            "placeholder:text-slate-400 focus:bg-white/80",
            isFocused ? "border-emerald-500/50 ring-2 ring-emerald-500/10 shadow-[0_4px_20px_rgba(16,185,129,0.05)]" : "",
            error ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10 shadow-[0_4px_10px_rgba(239,68,68,0.05)]" : "",
            success ? "border-emerald-500/50 focus:border-emerald-500" : "",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50"
          )}
          {...props}
        />

        {/* Focus Animation Line (Subtle bottom highlight) */}
        <motion.div
          initial={false}
          animate={{ scaleX: isFocused ? 1 : 0 }}
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 origin-left rounded-b-xl"
        />

        {/* Password Toggle */}
        {type === "password" && showToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}

        {/* Feedback Icons */}
        <AnimatePresence>
          {!showToggle && (error || success) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.5, x: 10 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {error && <X className="text-red-500" size={16} />}
              {success && <Check className="text-emerald-500" size={16} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-[10px] text-red-500 font-medium pl-1 leading-tight mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Input;
