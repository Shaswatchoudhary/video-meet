import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, Clock, Info, Wifi } from 'lucide-react';
import { useCallStateHooks } from '@stream-io/video-react-sdk';

const MeetingTopBar = ({ meetingId }) => {
  const { useParticipantCount } = useCallStateHooks();
  const participantCount = useParticipantCount();
  const [timer, setTimer] = useState('0:00');
  const [time, setTime] = useState('');

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const totalSeconds = Math.floor(elapsed / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      if (hours > 0) {
        setTimer(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setTimer(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);

    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(clockInterval);
    };
  }, []);

  return (
    <div
      style={{ fontFamily: "'Google Sans', sans-serif" }}
      className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 z-50"
    >
      {/* Left: Meeting name */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col justify-center">
          <span className="text-[#e8eaed] text-sm font-medium leading-tight tracking-wide">
            {meetingId
              ? meetingId.length > 20
                ? meetingId.slice(0, 20) + '…'
                : meetingId
              : 'Meeting'}
          </span>
          <span className="text-[#9aa0a6] text-xs font-normal">{timer}</span>
        </div>
      </div>

      {/* Right: Time, participants, network */}
      <div className="flex items-center gap-1">
        <span className="text-[#e8eaed] text-sm font-medium mr-3 hidden sm:block">{time}</span>

        <button
          title="Participants"
          className="flex items-center gap-1.5 h-10 px-3 rounded-full text-[#bdc1c6] hover:bg-white/10 transition-colors text-sm font-medium"
        >
          <Users size={18} />
          <span className="text-[#e8eaed] text-sm">{participantCount}</span>
        </button>

        <button
          title="Connection quality"
          className="h-10 w-10 flex items-center justify-center rounded-full text-[#bdc1c6] hover:bg-white/10 transition-colors"
        >
          <Wifi size={18} className="text-[#34a853]" />
        </button>

        <button
          title="Meeting info"
          className="h-10 w-10 flex items-center justify-center rounded-full text-[#bdc1c6] hover:bg-white/10 transition-colors"
        >
          <Info size={18} />
        </button>
      </div>
    </div>
  );
};

export default MeetingTopBar;