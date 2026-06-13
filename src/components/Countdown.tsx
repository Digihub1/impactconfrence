import React, { useState, useEffect } from 'react';
import { Play, Calendar, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface CountdownProps {
  onJoinStream?: () => void;
}

export default function Countdown({ onJoinStream }: CountdownProps) {
  // Target date: September 24, 2026 09:00:00 AM (local time)
  const targetDate = new Date('2026-09-24T09:00:00').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isOver: false });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeBlocks = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div id="countdown" className="w-full max-w-4xl mx-auto px-4 py-3">
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-lg">
        {/* Decorative backgrounds */}
        <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-blue-100/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-red-100/20 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          
          {/* Header left: Countdown or Live Indicator */}
          <div className="text-center md:text-left flex-1 font-medium">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${timeLeft.isOver ? 'bg-emerald-400' : 'bg-red-500'}`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${timeLeft.isOver ? 'bg-emerald-500' : 'bg-red-600'}`}></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-650 font-mono">
                {timeLeft.isOver ? 'Conference is Live' : 'Preparing for Impact'}
              </span>
            </div>
            
            {timeLeft.isOver ? (
              <h3 className="font-sans text-xl font-black text-slate-900 tracking-tight">
                APOSTOLIC IMPACT IS UNLEASHED
              </h3>
            ) : (
              <h3 className="font-sans text-2xl font-black text-slate-900 tracking-tight leading-tight uppercase">
                Prepare for Impartation
              </h3>
            )}
            <p className="text-xs text-slate-600 mt-1 max-w-sm font-semibold">
              Sept 24 - 27, 2026 • Live from Neema Gospel Church, Dallas, Texas
            </p>
          </div>

          {/* Time Counter block */}
          {!timeLeft.isOver ? (
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
              {timeBlocks.map((block, idx) => (
                <div key={block.label} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className="min-w-[65px] sm:min-w-[75px] h-[75px] sm:h-[85px] rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-inner relative overflow-hidden">
                      {/* Gradient shine */}
                      <div className="absolute inset-x-0 top-0 h-1/2 bg-white/40" />
                      <span className="font-mono text-3xl sm:text-4xl font-black text-red-650 leading-none">
                        {String(block.value).padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-500 mt-2.5 font-sans">
                      {block.label}
                    </span>
                  </div>
                  {idx < 3 && (
                    <span className="text-2xl sm:text-3xl font-black text-red-600 mx-1 sm:mx-2 self-start mt-6 select-none leading-none animate-pulse">
                      :
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 25px rgba(16,185,129,0.3)" }}
              whileTap={{ scale: 0.98 }}
              onClick={onJoinStream}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-full shadow-[0_4px_20px_rgba(16,185,129,0.3)] border border-emerald-500 transition-all duration-300 cursor-pointer text-xs uppercase tracking-widest shrink-0"
            >
              <Play className="fill-current w-5 h-5 animate-pulse" />
              Event Live — Join Stream
            </motion.button>
          )}

        </div>
      </div>
    </div>
  );
}
