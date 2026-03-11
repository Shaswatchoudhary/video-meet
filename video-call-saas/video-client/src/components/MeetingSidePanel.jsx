import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  Users,
  Search,
  Mic,
  MicOff,
  ShieldCheck,
  Send,
  MoreVertical,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCallStateHooks } from '@stream-io/video-react-sdk';

const MeetingSidePanel = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('participants');
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();

  const sendMessage = () => {
    if (!chatMessage.trim()) return;
    setMessages(prev => [
      ...prev,
      { id: Date.now(), text: chatMessage, sender: 'You', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
    setChatMessage('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          style={{ fontFamily: "'Google Sans', sans-serif" }}
          className="fixed right-0 top-0 bottom-0 w-[360px] bg-[#2d2e30] flex flex-col z-40 shadow-2xl"
        >
          {/* Tab Header */}
          <div className="flex items-center border-b border-white/8 pt-2 px-2">
            <button
              onClick={() => setActiveTab('participants')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === 'participants'
                  ? 'border-[#8ab4f8] text-[#8ab4f8]'
                  : 'border-transparent text-[#9aa0a6] hover:text-[#e8eaed] hover:bg-white/5'
              }`}
            >
              <Users size={16} />
              People
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === 'chat'
                  ? 'border-[#8ab4f8] text-[#8ab4f8]'
                  : 'border-transparent text-[#9aa0a6] hover:text-[#e8eaed] hover:bg-white/5'
              }`}
            >
              <MessageSquare size={16} />
              Chat
            </button>
            <button
              onClick={onClose}
              className="ml-auto mr-1 h-9 w-9 flex items-center justify-center rounded-full text-[#9aa0a6] hover:bg-white/10 hover:text-[#e8eaed] transition-colors flex-shrink-0"
            >
              <X size={18} />
            </button>
          </div>

          {/* Participants Tab */}
          {activeTab === 'participants' && (
            <div className="flex-1 overflow-y-auto">
              {/* Search */}
              <div className="p-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa0a6]" />
                  <input
                    type="text"
                    placeholder="Search people"
                    className="w-full bg-[#3c4043] rounded-full py-2 pl-9 pr-4 text-sm text-[#e8eaed] placeholder-[#9aa0a6] focus:outline-none focus:ring-2 focus:ring-[#8ab4f8] transition-all"
                  />
                </div>
              </div>

              {/* Count */}
              <div className="px-4 pb-1">
                <p className="text-xs font-medium text-[#9aa0a6] uppercase tracking-wider">
                  In the call · {participants.length}
                </p>
              </div>

              {/* List */}
              <div className="px-2">
                {participants.map((p) => (
                  <div
                    key={p.sessionId}
                    className="flex items-center justify-between px-2 py-2 rounded-xl hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        {p.image ? (
                          <img src={p.image} className="w-9 h-9 rounded-full object-cover" alt="" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#1a73e8] flex items-center justify-center text-sm font-semibold text-white uppercase">
                            {p.name?.charAt(0) || 'U'}
                          </div>
                        )}
                        {p.isSpeaking && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#34a853] rounded-full border-2 border-[#2d2e30]" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm text-[#e8eaed] font-medium flex items-center gap-1.5">
                          {p.name || 'Unknown'}
                          {p.isLocalParticipant && (
                            <span className="text-[10px] text-[#9aa0a6] font-normal">(You)</span>
                          )}
                        </div>
                        {p.role === 'host' && (
                          <span className="text-[10px] text-[#9aa0a6]">Meeting organizer</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {p.isMuted
                        ? <MicOff size={14} className="text-[#ea4335]" />
                        : <Mic size={14} className="text-[#9aa0a6]" />
                      }
                      <button className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-white/10 text-[#9aa0a6] transition-colors">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center px-6 py-12">
                    <div className="w-16 h-16 bg-[#3c4043] rounded-full flex items-center justify-center mb-4">
                      <MessageSquare size={28} className="text-[#9aa0a6]" />
                    </div>
                    <p className="text-[#e8eaed] text-sm font-medium mb-1">No messages yet</p>
                    <p className="text-[#9aa0a6] text-xs leading-relaxed">
                      Messages can only be seen by people in the call and are deleted when the call ends.
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className="flex flex-col gap-0.5">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-semibold text-[#8ab4f8]">{msg.sender}</span>
                        <span className="text-[10px] text-[#9aa0a6]">{msg.time}</span>
                      </div>
                      <p className="text-sm text-[#e8eaed] leading-relaxed">{msg.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Chat Input */}
              <div className="p-3 border-t border-white/8">
                <div className="flex items-center gap-2 bg-[#3c4043] rounded-full pl-4 pr-1.5 py-1.5">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Send a message to everyone"
                    className="flex-1 bg-transparent text-sm text-[#e8eaed] placeholder-[#9aa0a6] focus:outline-none"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!chatMessage.trim()}
                    className="h-8 w-8 rounded-full bg-[#8ab4f8] flex items-center justify-center text-[#202124] hover:bg-[#93bbf8] transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="px-4 py-3 border-t border-white/8 flex items-center gap-2">
            <ShieldCheck size={13} className="text-[#34a853] flex-shrink-0" />
            <span className="text-[10px] text-[#9aa0a6]">
              Messages and calls are end-to-end encrypted
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MeetingSidePanel;