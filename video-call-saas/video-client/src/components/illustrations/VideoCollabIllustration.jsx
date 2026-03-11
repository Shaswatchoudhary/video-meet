import React from 'react';
/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import { Mic, MicOff, Video, VideoOff, PhoneMissed, MonitorUp, Settings, Users, MessageSquare } from 'lucide-react';

const VideoCollabIllustration = () => {
  // Avatars from UI Faces or abstract placeholders
  const users = [
    { id: 1, name: "Shaswat Choudhary", role: "Product Manager", color: "from-emerald-100 to-green-50", speaking: true, delay: 0 },
    { id: 2, name: "Kaushik Choudhary", role: "Lead Engineer", color: "from-slate-100 to-white", speaking: false, delay: 0.2 },
    { id: 3, name: "Sakku Choudhary", role: "UX Designer", color: "from-emerald-50 to-slate-50", speaking: false, delay: 0.4 },
    { id: 4, name: "Smile Jack", role: "Host", color: "from-white to-slate-100", speaking: false, delay: 0.6 },
  ];

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center pointer-events-none">
      
      {/* Background Ambient Glow */}
      <motion.div
        className="absolute w-full h-full bg-emerald-500/10 rounded-[3rem] blur-3xl"
      />

      <div className="relative w-full max-w-2xl h-full flex flex-col gap-4 p-4">
        {/* Main Video Grid */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          {users.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: user.delay, ease: "easeOut" }}
              className={`relative overflow-hidden rounded-2xl bg-white border border-emerald-100 shadow-sm ${user.speaking ? 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/20' : ''}`}
            >
              {/* Simulated Video Feed Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${user.color} opacity-80`} />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/20 border border-white flex items-center justify-center text-xl font-black text-slate-800 shadow-sm backdrop-blur-sm">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>

                <div className="absolute inset-0 flex items-center justify-center">
                   <motion.div 
                     animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }} 
                     transition={{ duration: 2, repeat: Infinity }} 
                     className="w-16 h-16 rounded-full border-2 border-blue-500/50 absolute" 
                   />
                   <motion.div 
                     animate={{ scale: [1, 2, 1], opacity: [0.1, 0, 0.1] }} 
                     transition={{ duration: 2, delay: 0.5, repeat: Infinity }} 
                     className="w-16 h-16 rounded-full border border-emerald-500/30 absolute" 
                   />
                </div>

              {/* Toolbar/Overlay inside Video */}
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                <div className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-emerald-100 shadow-md">
                  <p className="text-slate-800 text-xs font-black tracking-tight">{user.name}</p>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{user.role}</p>
                </div>
                
                <div className={`p-1.5 rounded-lg backdrop-blur-md shadow-sm border ${user.speaking ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                  {user.speaking ? <Mic size={14} /> : <MicOff size={14} />}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.8 }}
           className="h-16 w-full max-w-md mx-auto bg-white/60 backdrop-blur-2xl rounded-2xl border border-emerald-100 flex items-center justify-center gap-2 px-6 shadow-xl"
        >
          <div className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-500 cursor-pointer transition-all border border-slate-100">
             <Mic size={18} />
          </div>
          <div className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-500 cursor-pointer transition-all border border-slate-100">
             <Video size={18} />
          </div>
          <div className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-500 cursor-pointer transition-all border border-slate-100">
             <MonitorUp size={18} />
          </div>
          <div className="w-px h-8 bg-white/10 mx-2" />
          <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 cursor-pointer transition-all relative border border-white/5">
             <MessageSquare size={18} />
             <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          </div>
          <div className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-500 cursor-pointer transition-all border border-slate-100">
             <Users size={18} />
          </div>
          <div className="w-px h-8 bg-white/10 mx-2" />
          <div className="p-3 rounded-xl bg-red-500/80 hover:bg-red-500 text-white cursor-pointer transition-all shadow-lg shadow-red-500/20">
             <PhoneMissed size={18} />
          </div>
        </motion.div>
        
        <motion.div
           initial={{ opacity: 0, x: 50 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8, delay: 1.5 }}
           className="absolute top-8 -right-12 bg-white/80 backdrop-blur-xl border border-emerald-100 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 w-64"
        >
           <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-green-500 p-[1px]">
             <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
               <motion.div 
                 animate={{ rotate: 360 }} 
                 transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                 className="w-4 h-4 border-2 border-t-emerald-500 border-r-transparent border-b-green-500 border-l-transparent rounded-full"
               />
             </div>
           </div>
           <div>
             <p className="text-slate-900 text-xs font-black tracking-tight">Video CallAI Active</p>
             <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Generating subtitles...</p>
           </div>
        </motion.div>

      </div>
    </div>
  );
};

export default VideoCollabIllustration;
