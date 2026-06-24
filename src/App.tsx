/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Sparkles, Menu, X, Globe } from 'lucide-react';

import Countdown from './components/Countdown';
import VisaSupport from './components/VisaSupport';
import ScheduleSection from './components/ScheduleSection';
import ContactVolunteer from './components/ContactVolunteer';
import ErrorBoundary from './components/ErrorBoundary';

import { LEADERSHIP_TEAM, CONFERENCE_HOSTS, SECRETARIAT_TEAM, INTERCESSION_TEAM, HOTELS } from './data';
// Importing generated images
import heroBg from './assets/images/conference_hero_bg_1781243521756.jpg';
import logoImg from './assets/images/DCI.png';
import bishopPortrait from './assets/images/Portrait 1.jpg';
import awardsBannerImg from './assets/images/Awards.png';

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Awards nomination view (state-driven, router-less)
  const [nominateView, setNominateView] = useState(false);
  const [nominationSuccess, setNominationSuccess] = useState<string | null>(null);

  const setNominateViewWithTransition = (next: boolean) => {
    const doSwap = () => {
      setNominationSuccess(null);
      setNominateView(next);
    };

    // View Transition API (where supported)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyDoc = document as any;
    if (typeof anyDoc?.startViewTransition === 'function') {
      anyDoc.startViewTransition(() => doSwap());
    } else {
      doSwap();
    }
  };


  const googleFormUrl = 'https://forms.gle/2UqrCMvMxpFwNtcV7';
  const nominationRecipient = 'lukas@heartforthecity.co.uk';

  const handleNominationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const nomineeName = String(fd.get('nomineeName') || '').trim();
    const category = String(fd.get('category') || '').trim();
    const reason = String(fd.get('reason') || '').trim();

    if (!nomineeName || !category || !reason) return;

    const subject = encodeURIComponent(`Nomination: ${nomineeName} for ${category}`);
    const body = encodeURIComponent(
      `Nominee Name: ${nomineeName}\nCategory: ${category}\n\nReason for Nomination:\n${reason}`
    );

    window.location.href = `mailto:${nominationRecipient}?subject=${subject}&body=${body}`;
    setNominationSuccess(nomineeName);
  };

  const handleRegisterClick = () => {
    window.open(googleFormUrl, '_blank');
  };

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#leadership', label: 'Leadership' },
    { href: '#secretariat', label: 'Secretariat' },
    { href: '#schedule', label: 'Schedule' },
    { href: '#awards', label: 'Awards' },
    { href: '#visa', label: 'Visa Support' },
    { href: '#accommodation', label: 'Accommodation' },
    { href: '#sponsorship', label: 'Sponsorship' },
    { href: '#contact', label: 'Contact' }
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-red-600 selection:text-white relative overflow-hidden">

      
      {/* SOPHISTICATED LIGHT AMBIENT BACKGROUND GLOWS */}
      <div className="absolute inset-x-0 top-0 h-[180vh] pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[700px] h-[700px] bg-rose-200/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-[20%] left-[-10%] w-[700px] h-[700px] bg-blue-200/25 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/60 to-slate-50" />
      </div>
      
      {/* GLOBAL TOP TRANSIT HEADER */}
      <header className="sticky top-0 z-45 bg-white/95 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative z-10">
          
          {/* Logo Badge */}
          <a href="#home" className="flex items-center">
            <img src={logoImg} alt="AIC Dallas Logo" className="h-10 w-auto object-contain" />
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-slate-900 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

{/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-6">

            <button
              onClick={handleRegisterClick}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full transition duration-300 shadow-[0_4px_14px_rgba(239,68,68,0.2)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.3)] cursor-pointer active:scale-97"
            >
              Register Now
            </button>
          </div>

          {/* Hamburger Menu Icon */}
          <div className="flex items-center gap-3 lg:hidden">
            <a
              href={googleFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 bg-red-650 text-white text-[9px] font-black uppercase tracking-[0.25em] rounded-full"
            >
              Register
            </a>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1 px-2.5 bg-slate-100 border border-slate-200 rounded-full text-slate-600 hover:text-slate-900 cursor-pointer transition"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE NAV DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 border-b border-slate-200 sticky top-20 z-40 overflow-hidden backdrop-blur-md"
          >
            <div className="p-5 space-y-4 relative z-10">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-650 hover:text-slate-900 transition py-1.5"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 border-t border-slate-200 flex justify-center">
                <a
                  href={googleFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 bg-red-650 text-white text-[9px] font-black uppercase tracking-[0.25em] rounded-full shadow cursor-pointer"
                >
                  Register
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section id="home" className="relative scroll-mt-20 min-h-[85vh] flex items-center justify-center py-16 overflow-hidden">
        {/* Dynamic Background Image with overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
            alt="Revival Atmosphere background image"
            className="w-full h-full object-cover select-none scale-105 filter brightness-100 saturate-115 opacity-40 animate-fade-in"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-50/40 to-slate-50" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* HERO LEFT: TEXTS & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <h1 className="font-serif text-4xl sm:text-6xl font-black text-slate-900 uppercase tracking-tight leading-none">
                Apostolic Impact <br className="hidden sm:inline" /> Conference 2026
              </h1>

              <p className="text-red-600 font-serif text-xl sm:text-2xl font-black tracking-wider uppercase">
                "2026 YEAR OF DOUBLE HARVEST" Zechariah 9:12
              </p>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                Bishop Dr. Mark Kariuki, Presiding Bishop of Deliverance Church International, together with the Apostolic Team, invite church leaders, ministers, professionals, and believers from around the world to a life-changing gathering of prayer, worship, apostolic teaching, workshops, networking, and recognition awards.
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-center lg:justify-start gap-2 font-bold text-slate-800">
                  <Calendar className="w-5 h-5 text-red-600" />
                  <span>September 24–27, 2026</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2 font-bold text-slate-800">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span>Neema Gospel Church, 7815 Arapaho Rd, Dallas, TX 75248, USA</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2 font-black text-amber-600 uppercase text-xs tracking-widest">
                  <Globe className="w-4 h-4" />
                  <span>Open to Christians Worldwide</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={handleRegisterClick}
                  className="w-full sm:w-auto px-8 py-3.5 bg-red-600 text-white font-extrabold rounded-full text-[10px] uppercase tracking-[0.2em] shadow-[0_4px_14px_rgba(239,68,68,0.2)] hover:bg-red-700 transition duration-300 cursor-pointer active:scale-97 flex items-center justify-center"
                >
                  Register Now
                </button>
                <a
                  href="#awards"
                  className="w-full sm:w-auto px-6 py-3.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 text-[10px] font-black rounded-full transition uppercase tracking-[0.2em] text-center cursor-pointer active:scale-97 shadow-sm"
                >
                  Nominate for Awards
                </a>
                <a
                  href="#sponsorship"
                  className="w-full sm:w-auto px-6 py-3.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 text-[10px] font-black rounded-full transition uppercase tracking-[0.2em] text-center cursor-pointer active:scale-97 shadow-sm"
                >
                  Become a Sponsor
                </a>
              </div>

            </div>

            {/* HERO RIGHT: DYNAMIC BISHOP HEADSHOT */}
            <div className="lg:col-span-5 relative mt-8 lg:mt-0 max-w-sm mx-auto w-full lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 rotate-1 shadow-2xl transition hover:rotate-0 duration-300">
                
                {/* Accent glow behind picture */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-red-500/10 blur-3xl" />
                
                <img
                  src={bishopPortrait}
                  alt="Bishop Dr. Mark Kariuki preaching with a microphone portrait image"
                  className="w-full aspect-[3/4] object-cover scale-100"
                  referrerPolicy="no-referrer"
                />

                {/* Overlaid Banner at bottom of graphic */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent p-5 text-center">
                  <span className="text-[9px] text-red-500 font-extrabold uppercase tracking-[0.2em] block font-mono">
                    Main Plenary Speaker
                  </span>
                  <h3 className="font-serif text-lg font-black text-slate-50 uppercase tracking-tight mt-1.5">
                    Apostolic Leadership Team
                  </h3>
                  <p className="text-[10px] text-slate-400 tracking-wide font-medium">
                    Advancing God's Kingdom Globally
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* LIVETIMER & QUICK INFO OVERLAPPING BANNER */}
      <div className="relative z-20 -mt-10 sm:-mt-14 pb-10">
        <Countdown onJoinStream={() => alert("Welcome to the video plenary pool! Joining our active session stream on Church YouTube.")} />
        
        {/* Quick Info Strip */}
        <div className="max-w-4xl mx-auto px-4 mt-6 text-center">
          <p className="text-sm font-black text-slate-500 uppercase tracking-widest italic">
            "The gathering of leaders, visionaries and kingdom builders is drawing near."
          </p>
        </div>
      </div>

      {/* THEME & PROPHETIC DECLARATION */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-8">
          <div className="inline-block p-4 px-8 border-2 border-white/20 rounded-2xl backdrop-blur-md">
            <p className="text-2xl font-serif italic">"Zechariah 9:12"</p>
          </div>
          <p className="text-xl md:text-3xl font-light tracking-wide text-slate-300 max-w-2xl mx-auto leading-relaxed">
            "We declare a season of miraculous acceleration, restored impact, divine alignment, and global recognition."
          </p>
        </div>
      </section>

      {/* LEADERSHIP SECTION */}
      <section id="leadership" className="scroll-mt-16 py-16 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase">APOSTOLIC BISHOPS</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest">Serving together to advance God's Kingdom globally.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {LEADERSHIP_TEAM.map((member, idx) => (
              <div key={idx} className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                {member.imageUrl ? (
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 text-4xl font-black">AIC</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-center">
                  <h4 className="text-white text-xs font-black uppercase">{member.name}</h4>
                  <span className="text-red-400 text-[8px] uppercase tracking-widest font-bold">{member.role}</span>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-3 bg-white/95 backdrop-blur-sm border-t border-slate-100 group-hover:hidden">
                  <h4 className="text-slate-900 text-[10px] font-black uppercase truncate">{member.name}</h4>
                  <span className="text-slate-500 text-[8px] uppercase font-bold">{member.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOSTS & INTERCESSION COMBINED SECTION */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Col: Conference Hosts */}
            <div className="lg:col-span-5 space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-black text-slate-900 uppercase">Conference Hosts</h2>
                <div className="w-12 h-1 bg-red-600 mt-2 mx-auto lg:mx-0 rounded-full" />
              </div>
              <div className="grid grid-cols-1 gap-6">
                {CONFERENCE_HOSTS.map((host, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-2xl flex flex-col items-center text-center transform transition hover:scale-[1.02] max-w-[400px] mx-auto my-8">
                    <div className="mb-6 w-full max-w-[240px] flex items-center justify-center overflow-hidden rounded-2xl shadow-lg border border-slate-100">
                      <img 
                        src={host.imageUrl || bishopPortrait} 
                        alt={host.name} 
                        className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-slate-900 uppercase leading-tight px-2">{host.name}</h3>
                      <p className="text-red-600 font-bold text-sm uppercase tracking-[0.2em]">{host.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: Intercession & Support Team */}
            <div className="lg:col-span-7 space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="text-2xl font-black text-slate-900 uppercase">DIASPORA SUPPORT TEAM</h2>
                <div className="w-12 h-1 bg-blue-600 mt-2 mx-auto lg:mx-0 rounded-full" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {INTERCESSION_TEAM.map((member, idx) => (
                  <div key={idx} className={`group relative aspect-[3/4] rounded-2xl overflow-hidden border shadow-md transition-all hover:shadow-lg hover:-translate-y-1 ${member.role.includes('Lead') ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
                    {member.imageUrl ? (
                      <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-200 text-4xl font-black bg-slate-50">AIC</div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-white/95 backdrop-blur-sm border-t border-slate-100 text-center">
<h4 className={`text-[10px] font-black uppercase truncate ${member.role.includes('Lead') ? 'text-inherit' : 'text-slate-900'}`}>
                        {member.name}
                      </h4>
                      <p className="text-[8px] font-bold uppercase tracking-widest opacity-70 text-slate-500">
                        {member.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECRETARIAT SECTION */}
      <section id="secretariat" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 uppercase">Apostolic Impact Conference Secretariat</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {SECRETARIAT_TEAM.map((member, idx) => {
              const normalizedName = member.name.toLowerCase();
              const isLukas = normalizedName.includes('lukas njenga');


              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center text-center gap-3 ${isLukas ? 'md:scale-110' : ''}`}
                >
                  <div
                    className={`${isLukas ? 'w-32 h-32 rounded-2xl' : 'w-24 h-24 rounded-full'} overflow-hidden border-2 border-slate-200 shadow-inner bg-slate-100 transition-all duration-300`}
                  >

                    {member.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 font-black">
                        AIC
                      </div>
                    )}
                  </div>


                  <div>
                    <h4 className={`${isLukas ? 'text-sm' : 'text-xs'} font-black text-slate-900 uppercase leading-tight`}>
                      {isLukas ? 'BISHOP Prof. Lukas Njenga' : member.name}
                    </h4>
                    <p className={`${isLukas ? 'text-[10px]' : 'text-[9px]'} text-slate-500 font-bold uppercase tracking-wider`}>
                      {member.role}
                    </p>

                    {/* Secretariat Team label for specific director members */}
                    {(['Dorcas Karanja', 'Kelvin Kiragu', 'Michael Njenga', 'Ruth Chege'].includes(member.name)) && (
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                        SECRETARIAT TEAM
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <ScheduleSection />

      {/* Awards nomination route (router-less) */}
      {nominateView ? (
        <section className="scroll-mt-16 py-16 bg-gradient-to-br from-amber-50 via-white to-blue-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex flex-col items-center justify-center text-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">Apostolic Impact International Awards 2026</h1>
                <p className="mt-4 text-slate-600 font-medium max-w-2xl mx-auto">
                  The Apostolic Impact International Awards 2026 honor leaders whose calling, service, and lived experience have produced measurable kingdom impact across ministry, marketplace, entrepreneurship, education, and community development.
                </p>
                <p className="mt-4 text-slate-600 font-medium max-w-2xl mx-auto">
                  Through recognition of prior learning, the awards celebrate faithful builders whose work has shaped people, strengthened communities, and advanced apostolic transformation in the diaspora and beyond.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  // Back to awards view
                  setNominateViewWithTransition(false);
                  if (window.location.pathname.endsWith('/nominate')) {
                    window.history.pushState({}, '', '/');
                  }
                }}
                className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-[10px] font-black uppercase tracking-[0.2em] rounded-full transition shadow-sm"
              >
                Back to Awards
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white border border-amber-100 rounded-2xl p-6">
                <h2 className="text-2xl font-semibold text-amber-700">Award Categories</h2>
                <ul className="mt-3 text-sm font-bold text-amber-800 list-disc pl-5 space-y-2">
                  <li>Marketplace Ministry Impact Award</li>
                  <li>Community Development Leadership</li>
                  <li>Apostolic Pioneer Award</li>
                  <li>Kingdom Entrepreneurship</li>
                </ul>
              </div>

              <div className="bg-white border border-blue-100 rounded-2xl p-6">
                <h2 className="text-2xl font-semibold text-blue-700">Judging Criteria</h2>
                <ul className="mt-3 text-sm font-bold text-blue-800 list-disc pl-5 space-y-2">
                  <li>Demonstrated leadership & discipleship impact</li>
                  <li>Contribution to community development and service</li>
                  <li>Faithfulness, integrity, and kingdom advancement</li>
                  <li>Evidence of measurable outcomes and testimonies</li>
                </ul>
              </div>
            </div>

            <form
              onSubmit={handleNominationSubmit}
              className="bg-white shadow rounded-xl border border-slate-200 p-7 space-y-6 max-w-[600px] mx-auto"
            >
              <h2 className="text-2xl font-bold text-slate-900 text-center">Nomination Form</h2>

              {nominationSuccess ? (
                <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <p className="text-emerald-800 font-bold">Nomination email draft opened.</p>
                  <p className="text-emerald-700 mt-1 text-sm">Please review and send the email from your mail app. Nominee: {nominationSuccess}</p>
                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setNominateViewWithTransition(false);
                        window.history.pushState({}, '', '/');
                      }}
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full transition shadow"
                    >
                      Submit Another
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNominationSuccess(null);
                        setNominateViewWithTransition(false);
                        window.history.pushState({}, '', '/');
                      }}
                      className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-[10px] font-black uppercase tracking-[0.2em] rounded-full transition"
                    >
                      Back to Awards
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700 text-center">Nominee Name</label>
                      <input
                        type="text"
                        name="nomineeName"
                        required
                        placeholder="Nominee Name"
                        className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700 text-center">Award Category</label>
                      <select
                        name="category"
                        required
                        className="w-full border border-slate-200 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select Category
                        </option>
                        <option>Marketplace Ministry Impact Award</option>
                        <option>Community Development Leadership</option>
                        <option>Apostolic Pioneer Award</option>
                        <option>Kingdom Entrepreneurship</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700 text-center">Reason for Nomination</label>
                    <textarea
                      name="reason"
                      rows={6}
                      required
                      placeholder="Briefly describe the nominee's contributions, impact, and kingdom work..."
                      className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-semibold uppercase tracking-[0.15em] text-xs shadow"
                  >
                    Submit Nomination
                  </button>
                </>
              )}
            </form>
          </div>
        </section>
      ) : (
        <section id="awards" className="py-[120px] bg-gradient-to-br from-amber-500 to-amber-700 text-white scroll-mt-16">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-8 flex flex-col items-center">
            <img
              src={awardsBannerImg}
              alt="Apostolic Impact International Awards banner"
              className="w-full h-[320px] object-cover rounded-2xl mb-6 shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
              loading="lazy"
              referrerPolicy="no-referrer"
            />

            <div className="flex flex-col items-center text-center">
              <h2 className="text-4xl md:text-5xl font-black uppercase">Apostolic Awards on Recognition of Prior Learning</h2>
              <p className="text-xl font-medium max-w-2xl mx-auto">Celebrate diaspora leaders, ministers, entrepreneurs, and community builders who have demonstrated exceptional kingdom impact.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mt-8">
                <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                  <h4 className="font-black uppercase mb-2">Award Categories</h4>
                  <ul className="text-xs space-y-1 font-bold list-disc list-inside">
                    <li>Marketplace Ministry Impact</li>
                    <li>Community Development Leadership</li>
                    <li>Apostolic Pioneer Award</li>
                    <li>Kingdom Entrepreneurship</li>
                  </ul>
                </div>

                <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex flex-col justify-center items-center text-center">
                  <button
                    type="button"
                    onClick={() => {
                      window.history.pushState({}, '', '/nominate');
                      setNominateViewWithTransition(true);
                    }}
                    className="px-8 py-3 bg-white text-amber-700 font-black uppercase text-xs rounded-full shadow-lg hover:bg-slate-100 transition"
                  >
                    Nominate a Leader
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}


      <VisaSupport />

      {/* ACCOMMODATION SECTION */}
      <section id="accommodation" className="scroll-mt-16 py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12"><h2 className="text-3xl font-black uppercase">Accommodation</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {HOTELS.map((hotel, idx) => (
               <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col justify-between shadow-md">
                <div className="space-y-4">
                   <h3 className="text-xl font-black uppercase">{hotel.name}</h3>

                  <p className="text-xs font-bold text-red-600 uppercase tracking-widest mt-1">
                    {hotel.addressLabel}
                  </p>

                  <ul className="text-sm font-bold text-slate-600 space-y-2">
                    <li className="text-slate-600">{hotel.address}</li>
                    <li>{hotel.name === 'Holiday Inn Express Dallas' ? `📍 4.5 miles from Venue` : ` ${hotel.distance}`}</li>
                    <li className="text-emerald-600">{hotel.rate}</li>
                  </ul>

                 </div>
                 <a href={hotel.bookingLink} target="_blank" className="mt-8 block w-full py-3 bg-slate-900 text-white text-center rounded-xl font-black uppercase text-xs tracking-widest">Book Now</a>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* SPONSORSHIP & DONATIONS */}
      <section id="sponsorship" className="py-24 bg-slate-50 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <h2 className="text-3xl font-black uppercase">Sponsorship Packages</h2>
            <div className="space-y-4">
              {[
                { tier: 'Platinum', amt: '$20,000', color: 'border-amber-500', text: 'text-amber-600', desc: 'Maximum visibility. Includes prime logo placement, 5-minute plenary presentation, and full-page program ad.' },
                { tier: 'Gold', amt: '$15,000', color: 'border-slate-300', text: 'text-slate-500', desc: 'Premium recognition. High-visibility logo placement, award presentation opportunity, and half-page program ad.' },
                { tier: 'Silver', amt: '$10,000', color: 'border-amber-700', text: 'text-amber-800', desc: 'Strategic partnership. Featured logo placement, workshop sponsorship, and quarter-page program ad.' },
                { tier: 'Bronze', amt: '$5,000', color: 'border-orange-300', text: 'text-orange-500', desc: 'Support partner. Logo in program and on event banners, plus mentions during breakout sessions.' },
                { tier: 'Supporter', amt: '$1,000', color: 'border-slate-200', text: 'text-slate-400', desc: 'Friend of the conference. Recognition in the official program and digital delegate materials.' }
              ].map(item => (
                <div key={item.tier} className={`p-5 bg-white border-l-4 ${item.color} rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group`}>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${item.text}`}>{item.tier} Partner</h4>
                    <span className="text-xs font-mono font-black text-slate-900 group-hover:text-red-600 transition-colors">{item.amt}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-wider mb-4">{item.desc}</p>
                  <button className="w-full py-2.5 bg-slate-100 group-hover:bg-slate-900 text-slate-900 group-hover:text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-300 cursor-pointer border border-slate-200 group-hover:border-slate-900">
                    Select {item.tier} Package
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-8">
            <h2 className="text-3xl font-black uppercase">Donations</h2>
            <div className="grid grid-cols-4 gap-4">
              {['10', '25', '50', '100', '500', '1,000', '5,000', '10,000'].map(amt => (
                <button key={amt} className="p-3 bg-white border border-slate-200 rounded-xl font-black text-xs hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition shadow-sm">${amt}</button>
              ))}
            </div>
            <button className="w-full py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg">Submit Donation</button>
          </div>
        </div>
      </section>

      {/* COMMITTEE MESSAGING PORTAL */}
      <ContactVolunteer />

      {/* FOOTER METADATA BAR SECTION */}
      <footer className="bg-slate-100 border-t border-slate-200 py-12 relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 uppercase text-[9px] text-slate-500 tracking-[0.25em] font-mono">
          
          <div className="flex flex-col items-center md:items-start gap-2">
            <span>© 2026 Apostolic Impact Conference. All Rights Reserved.</span>
            <span className="text-[8px] text-slate-450 font-bold">
              Deliverance Church International • Neema Gospel Church • Luke 4:18
            </span>
          </div>

          <div className="flex gap-4" />

        </div>
      </footer>



    </div>
    </ErrorBoundary>
  );
}
