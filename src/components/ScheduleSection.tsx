import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, Sunrise, Moon, Sunset } from 'lucide-react';
import { CONFERENCE_SCHEDULE } from '../data';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScheduleSection() {
  const [activeTab, setActiveTab] = useState(0);

  const currentDay = CONFERENCE_SCHEDULE[activeTab];

  // Helper to choose background indicator icons for time of day
  const getTimePeriodIcon = (timeStr: string) => {
    const isEvening = timeStr.toLowerCase().includes('pm') && (timeStr.toLowerCase().includes('6:') || timeStr.toLowerCase().includes('7:'));
    const isAfternoon = timeStr.toLowerCase().includes('pm') && !isEvening;
    if (isEvening) return <Moon className="w-4 h-4 text-rose-400 shrink-0" />;
    if (isAfternoon) return <Sunset className="w-4 h-4 text-amber-500 shrink-0" />;
    return <Sunrise className="w-4 h-4 text-sky-400 shrink-0" />;
  };

  return (
    <section id="schedule" className="scroll-mt-16 py-16 bg-transparent border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Title Block */}
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold text-red-600 uppercase tracking-widest font-mono">
            Full Program Schedule
          </span>
          <h2 className="font-sans text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight">
            Schedule of Events
          </h2>
          <div className="w-16 h-1.5 bg-gradient-to-r from-blue-600 to-red-600 mx-auto rounded-full" />
          <p className="text-slate-600 max-w-xl mx-auto text-sm mt-3 font-semibold">
            Explore our daily breakouts, masterclasses, and powerful worship sessions. Select a day to view the curriculum.
          </p>
        </div>

        {/* Tab Selectors */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 p-1.5 bg-slate-100 rounded-full border border-slate-200 max-w-2xl mx-auto">
          {CONFERENCE_SCHEDULE.map((day, idx) => (
            <button
              key={day.date}
              onClick={() => setActiveTab(idx)}
              className={`flex-1 min-w-[120px] px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] select-none cursor-pointer transition duration-300 ${
                activeTab === idx
                  ? 'bg-white text-slate-900 border border-slate-200/80 shadow-md'
                  : 'text-slate-600 hover:text-slate-900 bg-transparent hover:bg-slate-200/50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 inline mr-1.5 shrink-0" />
              {(() => {
                const parts = day.dayLabel.split(', ');
                return parts.length > 1 ? parts[1] : day.dayLabel;
              })()}
            </button>
          ))}
        </div>

        {/* Schedule Cards Section */}
        <div className="space-y-4 font-medium">
          {/* Day Theme Statement */}
          <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-4 shadow-md">
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-red-600 font-mono block">
                Today's Core Guidance
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase leading-snug">
                {currentDay.theme}
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500 hidden sm:inline tracking-wider">
              {currentDay.dayLabel}
            </span>
          </div>

          {/* Timecards listing */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-4"
            >
              {currentDay.events.map((event, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:p-6 bg-white hover:shadow-lg shadow-sm transition duration-300 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-start gap-4"
                >
                  {/* Left: Time and Tagging */}
                  <div className="sm:w-1/3 space-y-1.5 shrink-0">
                    <div className="flex items-center gap-1.5 font-bold">
                      {getTimePeriodIcon(event.time)}
                      <span className="font-mono text-xs font-extrabold text-red-600 tracking-wide uppercase">
                        {event.time.split(' - ')[0] /* First part */}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono block uppercase">
                      {event.time}
                    </span>
                  </div>

                  {/* Right: Content details */}
                  <div className="flex-1 space-y-2.5">
                    <h3 className="font-sans text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-tight">
                      {event.title}
                    </h3>
                    
                    <p className="text-slate-600 text-xs leading-relaxed font-semibold">
                      {event.description}
                    </p>

                    {/* Metadata indicators: Speaker & Room */}
                    <div className="flex flex-wrap items-center gap-4 pt-2.5 border-t border-slate-100 font-bold">
                      {event.speaker && (
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span className="text-[10.5px] font-bold text-slate-700">
                            {event.speaker}
                          </span>
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="text-[10.5px] font-medium text-slate-500">
                            {event.location}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
