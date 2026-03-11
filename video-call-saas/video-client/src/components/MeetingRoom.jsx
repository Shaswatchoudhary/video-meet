import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  SpeakerLayout,
  CallControls,
  StreamTheme,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { useAppContext } from '../context/useAppContext';
import { Loader2, ShieldAlert, Users as UsersIcon, MessageSquare } from 'lucide-react';
import MeetingTopBar from './MeetingTopBar';
import MeetingSidePanel from './MeetingSidePanel';

const apiKey = 'f3yrnzjhm5wf';

const MeetingRoom = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [error, setError] = useState(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [activePanel, setActivePanel] = useState(null); // 'participants' | 'chat' | null

  useEffect(() => {
    if (!user || !meetingId) return;

    const token = localStorage.getItem('stream_token');
    if (!token) {
      setError('Authorization token missing. Please join again from the home page.');
      return;
    }

    const streamClient = new StreamVideoClient({
      apiKey,
      user: {
        id: user._id || user.id,
        name: user.name,
      },
      token,
    });

    const streamCall = streamClient.call('default', meetingId);

    setClient(streamClient);
    setCall(streamCall);

    streamCall.join({ create: true }).catch((err) => {
      console.error('Failed to join call:', err);
      setError('Failed to join the meeting room. Please check your connection.');
    });

    return () => {
      streamCall.leave();
      streamClient.disconnectUser();
    };
  }, [user, meetingId]);

  const togglePanel = (panel) => {
    if (activePanel === panel) {
      setActivePanel(null);
      setIsSidePanelOpen(false);
    } else {
      setActivePanel(panel);
      setIsSidePanelOpen(true);
    }
  };

  /* ── Error State ── */
  if (error) {
    return (
      <div
        style={{ fontFamily: "'Google Sans', sans-serif", background: '#202124' }}
        className="h-screen flex flex-col items-center justify-center p-6 text-center text-white"
      >
        <div className="w-16 h-16 bg-[#ea4335]/10 text-[#ea4335] rounded-full flex items-center justify-center mb-5">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-xl font-medium text-[#e8eaed] mb-2">Can't join meeting</h2>
        <p className="text-[#9aa0a6] text-sm mb-8 max-w-sm leading-relaxed">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="bg-[#1a73e8] hover:bg-[#1557b0] text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors"
        >
          Return to Home
        </button>
      </div>
    );
  }

  /* ── Loading State ── */
  if (!client || !call) {
    return (
      <div
        style={{ fontFamily: "'Google Sans', sans-serif", background: '#202124' }}
        className="h-screen flex flex-col items-center justify-center text-white gap-4"
      >
        <Loader2 className="animate-spin text-[#8ab4f8]" size={36} />
        <p className="text-[#9aa0a6] text-sm">Joining the meeting…</p>
      </div>
    );
  }

  /* ── Main Meeting UI ── */
  return (
    <StreamVideo client={client}>
      <StreamTheme>
        <StreamCall call={call}>
          <div
            style={{ fontFamily: "'Google Sans', sans-serif", background: '#202124' }}
            className="h-screen flex flex-col overflow-hidden text-[#e8eaed]"
          >
            {/* Top Bar */}
            <MeetingTopBar meetingId={meetingId} />

            {/* Body */}
            <main className="flex-1 flex relative overflow-hidden">
              {/* Video area — shrinks when side panel is open */}
              <div
                className={`flex-1 flex flex-col transition-all duration-300 ease-in-out overflow-hidden ${
                  isSidePanelOpen ? 'mr-[360px]' : 'mr-0'
                }`}
              >
                {/* Video tiles — fill available space */}
                <div className="flex-1 overflow-hidden relative">
                  {/* Padding ensures tiles don't sit under top/bottom bars */}
                  <div className="absolute inset-0 top-16 bottom-24">
                    <SpeakerLayout />
                  </div>
                </div>
              </div>

              {/* Side Panel */}
              <MeetingSidePanel
                isOpen={isSidePanelOpen}
                onClose={() => {
                  setIsSidePanelOpen(false);
                  setActivePanel(null);
                }}
              />
            </main>

            {/* Bottom Control Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-24 flex items-center justify-between px-6 z-30 pointer-events-none">
              {/* Left spacer */}
              <div className="flex-1" />

              {/* Centre controls — Stream SDK provides mic/cam/end-call */}
              <div className="pointer-events-auto flex items-center">
                <CallControls onLeave={() => navigate('/')} />
              </div>

              {/* Right — People & Chat toggles */}
              <div className="flex-1 flex items-center justify-end gap-1 pointer-events-auto">
                <button
                  onClick={() => togglePanel('participants')}
                  title="Participants"
                  className={`h-12 w-12 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    activePanel === 'participants'
                      ? 'bg-[#8ab4f8]/20 text-[#8ab4f8]'
                      : 'text-[#e8eaed] hover:bg-white/10'
                  }`}
                >
                  <UsersIcon size={20} />
                </button>

                <button
                  onClick={() => togglePanel('chat')}
                  title="Chat"
                  className={`h-12 w-12 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    activePanel === 'chat'
                      ? 'bg-[#8ab4f8]/20 text-[#8ab4f8]'
                      : 'text-[#e8eaed] hover:bg-white/10'
                  }`}
                >
                  <MessageSquare size={20} />
                </button>
              </div>
            </div>
          </div>
        </StreamCall>
      </StreamTheme>
    </StreamVideo>
  );
};

export default MeetingRoom;