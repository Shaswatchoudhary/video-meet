import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  className, 
  variant = "primary", 
  isLoading, 
  ...props 
}) => {
  const [ripples, setRipples] = useState([]);

  const createRipple = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const newRipple = {
      x,
      y,
      id: Date.now(),
    };

    setRipples([...ripples, newRipple]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
  };

  const variants = {
    primary: "bg-blue-600 text-white shadow-[0_4px_15px_rgba(37,99,235,0.3)] hover:bg-blue-700 border-none",
    secondary: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm",
    outline: "border border-blue-600/50 text-blue-600 hover:bg-blue-50",
  };

  return (
    <button
      onClick={createRipple}
      className={twMerge(
        "relative overflow-hidden px-4 md:px-6 py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group font-medium",
        variants[variant],
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={18} />
      ) : (
        children
      )}

      {/* Ripple Effect */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 10,
            height: 10,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </button>
  );
};

export default Button;
