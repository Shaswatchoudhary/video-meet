import React, { useState, useEffect } from 'react';
/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';

const FloatingShapes = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = [...Array(6)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: Math.random() * 5 + 5,
      delay: Math.random() * 5,
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Subtle Dot Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(#10b981 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Light Blue Glow 1 */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.3, 0.15],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-20 -left-20 w-96 h-96 bg-emerald-200/30 rounded-full blur-[100px]"
      />
      
      {/* Green Glow 2 */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
          x: [0, -40, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute top-1/2 -right-20 w-[500px] h-[500px] bg-green-200/20 rounded-full blur-[120px]"
      />
      
      {/* Teal Glow 3 (Bottom) */}
      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.1, 0.2, 0.1],
          x: [0, 60, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute -bottom-20 left-1/4 w-[600px] h-[600px] bg-teal-200/20 rounded-full blur-[150px]"
      />

      {/* Floating Particles (Soft Blue) */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
          }}
          className="absolute w-1.5 h-1.5 bg-emerald-400 rounded-full"
          style={{
            left: p.left,
            top: p.top,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingShapes;
