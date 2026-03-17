import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  PaginatedGridLayout,
  SpeakerLayout,
  StreamTheme,
  useCallStateHooks,
  useCall,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { useAppContext } from '../context/useAppContext';
import {
  Mic, MicOff, Video, VideoOff, PhoneOff,
  Monitor, Hand, Smile, Users, MessageSquare,
  LayoutGrid, LayoutPanelLeft, Camera, Shield,
  Copy, Check, ChevronUp, UsersRound,
  Volume2, X, MoreVertical, Clock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MeetingSidePanel from './MeetingSidePanel';

const apiKey = 'f3yrnzjhm5wf';
const REACTIONS = ['👍', '❤️', '😂', '😮', '👏', '🎉'];

/* ── Floating emoji animation ── */
const FloatEmoji = ({ emoji, x }) => (
  <motion.div
    initial={{ opacity: 1, y: 0, scale: 1 }}
    animate={{ opacity: 0, y: -140, scale: 1.5 }}
    transition={{ duration: 3, ease: "easeOut" }}
    style={{
      position: 'fixed', bottom: 100, left: `${x}%`,
      fontSize: '2.2rem', pointerEvents: 'none', zIndex: 500,
    }}
  >
    {emoji}
  </motion.div>
);

/* ── Control Button with proper state handling (Google Meet style) ── */
const ControlButton = ({
  onClick, title, children,
  isMuted = false,
  isActive = false,
  isDanger = false,
  dark = false,
}) => {
  const [hovered, setHovered] = useState(false);

  // Google Meet style colors
  const getBackgroundColor = () => {
    if (isDanger) {
      return hovered ? '#b31412' : '#d93025'; // Red for leave
    }
    if (isMuted) {
      return hovered ? '#b31412' : '#ea4335'; // Brighter red when muted
    }
    if (isActive) {
      return hovered ? '#1a5c9e' : '#1a73e8'; // Blue when active
    }
    // Default gray
    return hovered ? '#5f6368' : '#3c4043';
  };

  return (
    <div style={{ position: 'relative' }}>
      <motion.button
        title={title}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        animate={isMuted ? {
          boxShadow: [
            "0 0 0 0px rgba(234, 67, 53, 0.4)",
            "0 0 0 10px rgba(234, 67, 53, 0)",
          ],
          scale: hovered ? 1.05 : 1
        } : {
          scale: hovered ? 1.05 : 1
        }}
        transition={isMuted ? {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        } : { duration: 0.2 }}
        style={{
          height: 48,
          width: 48,
          borderRadius: '50%',
          background: getBackgroundColor(),
          border: isMuted ? '2.5px solid rgba(255,255,255,0.3)' : 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.2s, box-shadow 0.2s',
          flexShrink: 0,
          color: '#fff',
          zIndex: 2,
        }}
      >
        {children}
      </motion.button>
      {isMuted && (
        <div style={{
          position: 'absolute',
          top: -20,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#d93025',
          color: '#fff',
          fontSize: '0.58rem',
          fontWeight: 900,
          padding: '3px 7px',
          borderRadius: 6,
          fontFamily: "'Space Mono', monospace",
          pointerEvents: 'none',
          boxShadow: '0 4px 10px rgba(217, 48, 37, 0.35)',
          zIndex: 10,
          letterSpacing: '0.05em',
          whiteSpace: 'nowrap'
        }}>
          OFF
        </div>
      )}
    </div>
  );
};

/* ── Top Bar (matching HomePage theme) ── */
const TopBar = ({ meetingId, time, participantCount, dark, remainingTime }) => {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/meeting/${meetingId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatRemaining = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-16 px-4 md:px-6 flex items-center justify-between backdrop-blur-lg border-b shrink-0 z-10 transition-all"
      style={{
        background: dark ? 'rgba(13,11,8,0.95)' : 'rgba(240,230,208,0.95)',
        borderBottomColor: dark ? 'rgba(255,200,100,0.1)' : 'rgba(180,130,70,0.18)',
        color: dark ? '#F0E8D8' : '#0F0A04',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
      {/* Left - Logo & Meeting ID */}
      <div className="flex items-center gap-4 md:gap-6">
        <div className="flex items-center gap-2">
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: dark ? '#F0E8D8' : '#0F0A04',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Video size={16} color={dark ? '#0F0A04' : '#F5E6C8'} />
          </div>
          <span className="hidden sm:inline font-bold text-lg">VideoMeet</span>
        </div>

        <button
          onClick={copyLink}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.5)',
            border: `1px solid ${dark ? 'rgba(255,200,100,0.15)' : 'rgba(180,130,70,0.28)'}`,
            borderRadius: 16,
            padding: '6px 12px',
            fontSize: '0.85rem',
            color: dark ? '#F0E8D8' : '#0F0A04',
            cursor: 'pointer',
            fontFamily: "'Space Mono', monospace",
          }}
        >
          <span>{meetingId}</span>
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>

      {/* Center - Time & Remaining & Participants */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{
          fontSize: '0.9rem',
          color: dark ? '#b8a080' : '#7A5A28',
          fontFamily: "'Space Mono', monospace",
        }}>
          {time}
        </span>

        {remainingTime !== null && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: remainingTime < 300 ? 'rgba(217, 48, 37, 0.1)' : (dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.5)'),
            border: `1px solid ${remainingTime < 300 ? '#ea4335' : (dark ? 'rgba(255,200,100,0.15)' : 'rgba(180,130,70,0.28)')}`,
            borderRadius: 16,
            padding: '4px 10px',
            color: remainingTime < 300 ? '#ea4335' : (dark ? '#F0E8D8' : '#0F0A04'),
          }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>
              {formatRemaining(remainingTime)}
            </span>
          </div>
        )}

        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.5)',
          border: `1px solid ${dark ? 'rgba(255,200,100,0.15)' : 'rgba(180,130,70,0.28)'}`,
          borderRadius: 16,
          padding: '4px 10px',
        }}>
          <UsersRound size={16} color={dark ? '#D4901A' : '#B8741A'} />
          <span>{participantCount}</span>
        </div>
      </div>

      {/* Right - Security Badge */}
      <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono"
        style={{
          background: dark ? 'rgba(52,168,83,0.1)' : 'rgba(52,168,83,0.08)',
          borderColor: dark ? 'rgba(52,168,83,0.3)' : 'rgba(52,168,83,0.25)',
          color: '#34a853',
        }}>
        <Shield size={14} />
        <span>End-to-end encrypted</span>
      </div>
    </div>
  );
};

/* ── Bottom Bar (Google Meet style with proper mute indicators) ── */
const BottomBar = ({ navigate, togglePanel, activePanel, meetingId, dark }) => {
  const call = useCall();
  const {
    useMicrophoneState,
    useCameraState,
    useScreenShareState,
    useLocalParticipant,
    useParticipants
  } = useCallStateHooks();

  const { isMuted: micMuted } = useMicrophoneState();
  const { isMuted: camMuted } = useCameraState();
  const { isSharing } = useScreenShareState();
  const localParticipant = useLocalParticipant();
  const participants = useParticipants();

  const [showReact, setShowReact] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [floats, setFloats] = useState([]);
  const [layout, setLayout] = useState('grid');
  const [showControls, setShowControls] = useState(true);
  const reactRef = useRef(null);

  // Auto-hide controls (Google Meet style)
  useEffect(() => {
    let timeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  const endCall = () => {
    call?.leave();
    navigate('/');
  };

  const sendReaction = emoji => {
    setFloats(f => [...f, { emoji, id: Date.now(), x: 15 + Math.random() * 70 }]);
    setTimeout(() => setFloats(f => f.slice(1)), 3200);
  };

  const toggleShare = async () => {
    try {
      if (!isSharing) {
        await call?.screenShare?.enable();
      } else {
        await call?.screenShare?.disable();
      }
    } catch (e) {
      console.log('Screen share error:', e.message);
    }
  };

  const toggleHand = () => {
    const next = !handRaised;
    setHandRaised(next);
    call?.sendCustomEvent?.({
      type: 'raise-hand',
      custom: { userId: localParticipant?.userId, raised: next }
    }).catch(() => {});
  };

  const cycleLayout = () => {
    const next = layout === 'grid' ? 'speaker' : 'grid';
    setLayout(next);
    window.dispatchEvent(new CustomEvent('vm-layout', { detail: next }));
  };

  return (
    <>
      <AnimatePresence>
        {floats.map(f => (
          <FloatEmoji key={f.id} emoji={f.emoji} x={f.x} />
        ))}
      </AnimatePresence>

      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300"
        initial={{ y: 100 }}
        animate={{ y: showControls ? 0 : 100 }}
        style={{
          pointerEvents: showControls ? 'auto' : 'none',
        }}
      >
        <div className="flex justify-center items-center px-4 pb-4">
          <div className="flex items-center gap-2 p-2 rounded-[40px] shadow-2xl backdrop-blur-xl border overflow-x-auto max-w-full no-scrollbar"
            style={{
              background: dark ? 'rgba(13,11,8,0.95)' : 'rgba(240,230,208,0.95)',
              borderColor: dark ? 'rgba(255,200,100,0.1)' : 'rgba(180,130,70,0.18)',
            }}>

            {/* Layout toggle */}
            <ControlButton
              title={layout === 'grid' ? 'Switch to speaker view' : 'Switch to grid view'}
              onClick={cycleLayout}
              dark={dark}
            >
              {layout === 'grid' ? <LayoutPanelLeft size={20} /> : <LayoutGrid size={20} />}
            </ControlButton>

            <div style={{ width: 1, height: 32, background: dark ? 'rgba(255,200,100,0.1)' : 'rgba(180,130,70,0.18)' }} />

            {/* Mic - Turns RED when muted (Google Meet style) */}
            <ControlButton
              title={micMuted ? 'Unmute microphone (Ctrl+D)' : 'Mute microphone (Ctrl+D)'}
              isMuted={micMuted}
              onClick={() => call?.microphone.toggle()}
              dark={dark}
            >
              {micMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </ControlButton>

            {/* Camera - Turns RED when off */}
            <ControlButton
              title={camMuted ? 'Turn on camera (Ctrl+E)' : 'Turn off camera (Ctrl+E)'}
              isMuted={camMuted}
              onClick={() => call?.camera.toggle()}
              dark={dark}
            >
              {camMuted ? <VideoOff size={20} /> : <Video size={20} />}
            </ControlButton>

            {/* Screen share */}
            <ControlButton
              title={isSharing ? 'Stop presenting' : 'Present now'}
              isActive={isSharing}
              onClick={toggleShare}
              dark={dark}
            >
              <Monitor size={20} color={isSharing ? '#34a853' : '#fff'} />
            </ControlButton>

            {/* Reactions */}
            <div ref={reactRef} style={{ position: 'relative' }}>
              <ControlButton
                title="Send a reaction"
                isActive={showReact}
                onClick={() => setShowReact(o => !o)}
                dark={dark}
              >
                <Smile size={20} />
              </ControlButton>

              <AnimatePresence>
                {showReact && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    style={{
                      position: 'absolute',
                      bottom: 'calc(100% + 10px)',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: dark ? 'rgba(18,13,8,0.97)' : 'rgba(253,249,241,0.97)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${dark ? 'rgba(255,200,100,0.14)' : 'rgba(180,130,70,0.25)'}`,
                      borderRadius: 36,
                      padding: '8px 14px',
                      display: 'flex',
                      gap: 4,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                      zIndex: 200,
                    }}
                  >
                    {REACTIONS.map(e => (
                      <button
                        key={e}
                        onClick={() => { sendReaction(e); setShowReact(false); }}
                        style={{
                          fontSize: '1.5rem',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px 6px',
                          borderRadius: 8,
                          transition: 'transform 0.12s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.35)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        {e}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Raise hand */}
            <ControlButton
              title={handRaised ? 'Lower hand' : 'Raise hand'}
              isActive={handRaised}
              onClick={toggleHand}
              dark={dark}
            >
              <Hand size={20} />
            </ControlButton>

            <div style={{ width: 1, height: 32, background: dark ? 'rgba(255,200,100,0.1)' : 'rgba(180,130,70,0.18)' }} />

            {/* People panel */}
            <ControlButton
              title={`People (${participants.length})`}
              isActive={activePanel === 'participants'}
              onClick={() => togglePanel('participants')}
              dark={dark}
            >
              <Users size={20} />
            </ControlButton>

            {/* Chat panel */}
            <ControlButton
              title="Chat"
              isActive={activePanel === 'chat'}
              onClick={() => togglePanel('chat')}
              dark={dark}
            >
              <MessageSquare size={20} />
            </ControlButton>

            {/* More options — only visible to others */}
            {participants.length > 1 && (
              <ControlButton title="More options" onClick={() => {}} dark={dark}>
                <MoreVertical size={20} />
              </ControlButton>
            )}

            <div style={{ width: 1, height: 32, background: dark ? 'rgba(255,200,100,0.1)' : 'rgba(180,130,70,0.18)' }} />

            {/* Leave call - Always red */}
            <button
              title="Leave call"
              onClick={endCall}
              style={{
                height: 48,
                padding: '0 24px',
                borderRadius: 24,
                background: '#d93025',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.9rem',
                transition: 'background 0.2s, transform 0.1s',
                flexShrink: 0
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#b31412';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#d93025';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <PhoneOff size={20} />
              <span>Leave</span>
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

/* ── Loading Screen (simplified, matching theme) ── */
const LoadingScreen = ({ dark }) => {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: dark ? '#0D0B08' : '#F0E6D0',
      gap: 24,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: `3px solid ${dark ? 'rgba(212,144,26,0.2)' : 'rgba(184,116,26,0.2)'}`,
          borderTopColor: dark ? '#D4901A' : '#B8741A',
        }}
      />
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ color: dark ? '#F0E8D8' : '#0F0A04', marginBottom: 8 }}>Joining meeting...</h2>
        <p style={{ color: dark ? '#b8a080' : '#7A5A28' }}>Please wait</p>
      </div>
    </div>
  );
};

/* ── Meeting Layout ── */
const MeetingLayout = ({ meetingId, isSidePanelOpen, navigate, togglePanel, activePanel, dark }) => {
  const [time, setTime] = useState('');
  const [layout, setLayout] = useState('grid');
  const [remainingTime, setRemainingTime] = useState(null);
  const [showEndModal, setShowEndModal] = useState(false);

  const { useParticipantCount } = useCallStateHooks();
  const participantCount = useParticipantCount();
  const call = useCall();

  useEffect(() => {
    // 1. Get host info and set limits
    const hostRaw = localStorage.getItem('meet_host_info');
    const hostInfo = hostRaw ? JSON.parse(hostRaw) : { plan: 'none' };

    const limits = {
      none: 20 * 60,      // 20 mins
      aarambh: 60 * 60,   // 60 mins
      samraat: 24 * 60 * 60 // 24 hours
    };

    const timeLimitSeconds = limits[hostInfo.plan] || (20 * 60);
    const joinTime = Date.now();

    const updateTime = () => {
      // Current Wall Clock
      setTime(new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }));

      // Meeting Duration Check
      const elapsedSeconds = Math.floor((Date.now() - joinTime) / 1000);
      const remaining = timeLimitSeconds - elapsedSeconds;

      if (remaining <= 0) {
        setRemainingTime(0);
        handleMeetingEnd();
      } else {
        setRemainingTime(remaining);
      }
    };

    const handleMeetingEnd = () => {
      setShowEndModal(true);
      call?.leave();
      setTimeout(() => navigate('/'), 5000);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    const handleLayoutChange = (e) => setLayout(e.detail);
    window.addEventListener('vm-layout', handleLayoutChange);

    return () => {
      clearInterval(timer);
      window.removeEventListener('vm-layout', handleLayoutChange);
    };
  }, [call, navigate]);

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      background: dark ? '#0D0B08' : '#F0E6D0',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      position: 'relative',
    }}>
      <TopBar
        meetingId={meetingId}
        time={time}
        participantCount={participantCount}
        dark={dark}
        remainingTime={remainingTime}
      />

      <main style={{
        flex: 1,
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className={`flex-1 transition-all duration-300 ${isSidePanelOpen ? 'md:mr-[360px]' : 'mr-0'}`}>
          {layout === 'grid' ? <PaginatedGridLayout /> : <SpeakerLayout />}
        </div>

        <MeetingSidePanel
          isOpen={isSidePanelOpen}
          onClose={() => togglePanel(null)}
          defaultTab={activePanel === 'chat' ? 'chat' : 'participants'}
          dark={dark}
        />
      </main>

      <BottomBar
        navigate={navigate}
        togglePanel={togglePanel}
        activePanel={activePanel}
        meetingId={meetingId}
        dark={dark}
      />

      <AnimatePresence>
        {showEndModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-6"
            style={{
              background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              style={{
                background: dark ? '#1a1610' : '#fff',
                padding: '40px 60px', borderRadius: 32, textAlign: 'center',
                maxWidth: 450, color: dark ? '#F0E8D8' : '#0F0A04'
              }}
            >
              <div style={{ width: 80, height: 80, background: 'rgba(217,48,37,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#ea4335' }}>
                <Clock size={40} />
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 16 }}>Meeting Ended</h2>
              <p style={{ opacity: 0.7, lineHeight: 1.6, marginBottom: 30 }}>
                This meeting has reached its time limit based on the host's subscription plan.
              </p>
              <button onClick={() => navigate('/')} style={{ padding: '12px 32px', borderRadius: 24, background: '#ea4335', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                Go back Home
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');

        .str-video,
        .str-video__call,
        .str-video__paginated-grid-layout,
        .str-video__speaker-layout,
        .str-video__speaker-layout__spotlight,
        .str-video__speaker-layout__participants-bar {
          background: transparent !important;
        }

        .str-video__participant-view {
          border-radius: 12px !important;
          overflow: hidden !important;
          border: none !important;
          background: ${dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)'} !important;
        }

        .str-video__participant-view--no-video {
          background: ${dark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.3)'} !important;
        }

        .str-video__avatar {
          background: ${dark ? 'rgba(212,144,26,0.1)' : 'rgba(184,116,26,0.1)'} !important;
          color: ${dark ? '#D4901A' : '#B8741A'} !important;
        }

        .str-video__paginated-grid-layout {
          gap: 8px !important;
          padding: 16px !important;
        }

        .str-video__call-controls {
          display: none !important;
        }

        .str-video__participant-view__name {
          background: rgba(0, 0, 0, 0.6) !important;
          color: ${dark ? '#F0E8D8' : '#fff'} !important;
          border-radius: 6px !important;
          padding: 2px 8px !important;
          font-size: 0.75rem !important;
          font-family: "'Space Mono', monospace" !important;
        }

        /* ── FIXED: Muted indicators — covers all Stream SDK class name variants ── */
        .str-video__participant-view__audio-muted-indicator,
        .str-video__participant-view__video-muted-indicator,
        .str-video__participant-details__audio-muted,
        .str-video__participant-details__video-muted,
        [class*="audio-muted-indicator"],
        [class*="video-muted-indicator"] {
          color: #fff !important;
          fill: #fff !important;
          background: #d93025 !important;
          padding: 5px !important;
          border-radius: 50% !important;
          box-shadow: 0 4px 12px rgba(217, 48, 37, 0.45) !important;
          border: 2px solid rgba(255,255,255,0.3) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        /* Force SVGs inside muted indicators to be white */
        [class*="audio-muted-indicator"] svg,
        [class*="video-muted-indicator"] svg,
        .str-video__participant-view__audio-muted-indicator svg,
        .str-video__participant-view__video-muted-indicator svg {
          color: #fff !important;
          fill: #fff !important;
          stroke: #fff !important;
        }

        .str-video__participant-view--speaking {
          box-shadow: 0 0 0 2px #34a853 !important;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 5px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: ${dark ? 'rgba(212,144,26,0.3)' : 'rgba(184,116,26,0.3)'};
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

/* ── Main MeetingRoom Component ── */
const MeetingRoom = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const { user, dark: themeDark } = useAppContext();
  const [dark, setDark] = useState(themeDark || false);

  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [error, setError] = useState(null);
  const [isSidePanelOpen, setSidePanel] = useState(false);
  const [activePanel, setActivePanel] = useState(null);

  useEffect(() => {
    if (!user || !meetingId) return;

    const token = localStorage.getItem('stream_token');
    if (!token) {
      setError('Authentication token not found. Please return to home and join again.');
      return;
    }

    const initCall = async () => {
      try {
        const client = new StreamVideoClient({
          apiKey,
          user: {
            id: user._id || user.id,
            name: user.name,
            image: user.avatar,
          },
          token,
        });

        const call = client.call('default', meetingId);

        await call.join({ create: true });

        setClient(client);
        setCall(call);
      } catch (err) {
        console.error('Failed to join call:', err);
        setError('Could not join the meeting. Please check your connection and try again.');
      }
    };

    initCall();

    return () => {
      if (call) {
        call.leave().catch(() => {});
      }
      if (client) {
        client.disconnectUser().catch(() => {});
      }
    };
  }, [user, meetingId]);

  const togglePanel = (panel) => {
    if (!panel || activePanel === panel) {
      setActivePanel(null);
      setSidePanel(false);
    } else {
      setActivePanel(panel);
      setSidePanel(true);
    }
  };

  if (error) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: dark ? '#0D0B08' : '#F0E6D0',
        padding: 32,
        textAlign: 'center',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: dark ? 'rgba(217,48,37,0.1)' : 'rgba(217,48,37,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#d93025',
          marginBottom: 24,
        }}>
          <Shield size={40} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: dark ? '#F0E8D8' : '#0F0A04', marginBottom: 12 }}>
          Cannot join meeting
        </h2>
        <p style={{ fontSize: '0.95rem', color: dark ? '#b8a080' : '#7A5A28', maxWidth: 400, lineHeight: 1.6, marginBottom: 28 }}>
          {error}
        </p>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '12px 32px',
            borderRadius: 24,
            background: dark ? '#D4901A' : '#B8741A',
            color: dark ? '#0D0B08' : '#F0E6D0',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.95rem',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          Return to Home
        </button>
      </div>
    );
  }

  if (!client || !call) {
    return <LoadingScreen dark={dark} />;
  }

  return (
    <StreamVideo client={client}>
      <StreamTheme>
        <StreamCall call={call}>
          <MeetingLayout
            meetingId={meetingId}
            isSidePanelOpen={isSidePanelOpen}
            navigate={navigate}
            togglePanel={togglePanel}
            activePanel={activePanel}
            dark={dark}
          />
        </StreamCall>
      </StreamTheme>
    </StreamVideo>
  );
};

export default MeetingRoom;