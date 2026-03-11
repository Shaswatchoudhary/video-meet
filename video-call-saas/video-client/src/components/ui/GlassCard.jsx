import React from 'react';
/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const GlassCard = ({ children, className, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={twMerge(
        "glass-card relative group",
        className
      )}
      {...props}
    >
      {/* Card Border Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-green-400/10 to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-inherit" />
      
      {/* Content */}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </motion.div>
  );
};

export default GlassCard;
