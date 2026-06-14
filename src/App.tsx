/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Sparkles, Menu, X, Plane } from 'lucide-react';

import Countdown from './components/Countdown';
import VisaSupport from './components/VisaSupport';
import ScheduleSection from './components/ScheduleSection';
import ContactVolunteer from './components/ContactVolunteer';
import ErrorBoundary from './components/ErrorBoundary';

import { SPEAKER_PROFILES, HOTELS } from './data';
// Importing generated images
import heroBg from './assets/images/conference_hero_bg_1781243521756.jpg';
import logoImg from '../assets/images/DCI.png';
import bishopPortrait from '../assets/images/bishop_portrait 1.jpg';

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const googleFormUrl = 'https://forms.gle/2UqrCMvMxpFwNtcV7';
  const handleRegisterClick = () => {
    window.open(googleFormUrl, '_blank');
  };

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#speakers', label: 'Speakers' },
    { href: '#schedule', label: 'Schedule' },
    { href: '#visa', label: 'Visa Support' },
    { href: '#travel', label: 'Travel & Venue' },
    { href: '#contact', label: 'Contact Us' }
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
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-650/10 border border-red-550/20 text-red-600 font-extrabold text-[10px] uppercase tracking-[0.2em] font-mono">
                <Sparkles className="w-3.5 h-3.5 inline mr-1 animate-spin" />
                Apostolic Event Dallas • Sept 24–27, 2026
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl font-black text-slate-900 uppercase tracking-tight leading-none">
                Apostolic Impact <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-red-600 animate-pulse">
                  Conference
                </span>
              </h1>

              <div className="space-y-1">
                <p className="text-amber-600 font-serif text-sm sm:text-lg font-black tracking-wider uppercase leading-snug">
                  "2026 YEAR OF DOUBLE HARVEST"
                </p>
                <p className="text-slate-500 font-mono text-xs italic">
                  — Zechariah 9:12
                </p>
              </div>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                Join Bishop Dr. Mark Kariuki and leaders from across the Diaspora for Apostolic Impact 2026 — a life-changing conference of worship, teaching, and community impact. Save the date: Sept 24–27, Neema Gospel Church, Dallas, TX.
              </p>

              {/* Badges strip */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-2 bg-white border border-slate-200/80 p-2 px-3.5 rounded-xl shadow-sm">
                  <Calendar className="w-4 h-4 text-red-600" />
                  <span>Sept 24–27, 2026</span>
                </div>
                <div className="flex items-center gap-2 bg-white border border-slate-200/80 p-2 px-3.5 rounded-xl shadow-sm">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Neema Gospel Church, Dallas TX</span>
                </div>
              </div>

              {/* Dynamic CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={handleRegisterClick}
                  className="w-full sm:w-auto px-8 py-3.5 bg-red-600 text-white font-extrabold rounded-full text-[10px] uppercase tracking-[0.2em] shadow-[0_4px_14px_rgba(239,68,68,0.2)] hover:bg-red-700 transition duration-300 cursor-pointer active:scale-97 flex items-center justify-center"
                >
                  Register Now
                </button>
                <a
                  href="#visa"
                  className="w-full sm:w-auto px-6 py-3.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 text-[10px] font-black rounded-full transition uppercase tracking-[0.2em] text-center cursor-pointer active:scale-97 shadow-sm"
                >
                  Book Visa Support
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
                    Bishop Dr. Mark Kariuki
                  </h3>
                  <p className="text-[10px] text-slate-400 tracking-wide font-medium">
                    Presiding Bishop, Deliverance Church International
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
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          
          {/* Card 1: Theme banner */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-md">
            <span className="text-[9px] font-black uppercase text-red-650 block font-mono tracking-widest">Conference Pillar</span>
            <h4 className="text-xs font-black text-slate-900 uppercase mt-1">2026 Double Harvest</h4>
            <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed font-semibold">
              We declare a season of miraculous acceleration, restored impacts, and global alignment under Zechariah 9:12.
            </p>
          </div>

          {/* Card 2: Contacts Chair */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-md flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-black uppercase text-red-650 block font-mono tracking-widest">Secretariat Chairman</span>
              <h4 className="text-xs font-black text-slate-900 uppercase mt-1">Prof Lukas Njenga</h4>
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
              <a
                href="https://wa.me/447985505797"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-1.5 bg-slate-55 hover:bg-emerald-50 border border-slate-200 text-slate-750 hover:text-emerald-700 rounded-lg text-[9px] font-black tracking-widest text-center uppercase transition"
              >
                WhatsApp
              </a>
              <a
                href="mailto:Lukas@heartforthecity.co.uk"
                className="flex-1 py-1.5 bg-slate-55 hover:bg-red-50 border border-slate-200 text-slate-750 hover:text-red-700 rounded-lg text-[9px] font-black tracking-widest text-center uppercase transition"
              >
                Email ID
              </a>
            </div>
          </div>

          {/* Card 3: Important timelines */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-md">
            <span className="text-[9px] font-black uppercase text-red-650 block font-mono tracking-widest">Planning Benchmarks</span>
            <ul className="text-[10px] text-slate-600 space-y-1.5 mt-2 font-semibold">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-red-650" />
                <span>Registrations Opened: 15 June 2026</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-red-650" />
                <span>Consular booking queues: Active</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* CORE SPEAKERS BIOGRAPHIES SECTION */}
      <section id="speakers" className="scroll-mt-16 py-16 bg-transparent border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs font-bold text-red-600 uppercase tracking-widest font-mono">
              Conference Keynotes
            </span>
            <h2 className="font-sans text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight">
              Anointed Leadership
            </h2>
            <div className="w-16 h-1.5 bg-gradient-to-r from-blue-600 to-red-600 mx-auto rounded-full" />
          </div>

          <div className="space-y-6">
            {SPEAKER_PROFILES.map((spk, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 bg-white border border-slate-200/80 rounded-3xl flex flex-col md:flex-row gap-6 items-start hover:shadow-xl transition-all duration-300 shadow-md"
              >
                {/* Visual Circle Emblem */}
                <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 text-lg font-black shrink-0 font-serif select-none">
                  {spk.name.startsWith("Bishop") ? "B" : "PL"}
                </div>

                <div className="space-y-2 flex-1">
                  <div>
                    <span className="text-[10px] text-red-650 font-extrabold uppercase tracking-widest font-mono block">
                      {spk.location}
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 uppercase tracking-tight">
                      {spk.name}
                    </h3>
                    <span className="text-xs text-slate-500 font-bold">
                      {spk.role}
                    </span>
                  </div>
                  <p className="text-slate-650 text-xs leading-relaxed font-semibold">
                    {spk.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SCHEDULE TIMETABLE CARD COMPONENT */}
      <ScheduleSection />

      {/* VISA PREPARATION BLOCK */}
      <VisaSupport />

      {/* VENUE MAPS & TRAVEL AND HOTELS SECTION */}
      <section id="travel" className="scroll-mt-16 py-16 bg-transparent border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Title Block */}
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs font-bold text-red-650 uppercase tracking-widest font-mono">
              Venue Logistics & Accommodations
            </span>
            <h2 className="font-sans text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight">
              Travel & Lodging
            </h2>
            <div className="w-16 h-1.5 bg-gradient-to-r from-blue-600 to-red-600 mx-auto rounded-full" />
            <p className="text-slate-600 max-w-xl mx-auto text-sm mt-3 font-semibold">
              We look forward to welcoming you to Carrollton, Texas. Connect with airport guides and review hotel allocations below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-10">
            
            {/* Map Frame Card representation */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between shadow-md">
              <div className="space-y-4">
                <span className="text-[10px] text-amber-600 font-extrabold uppercase tracking-widest block font-mono">
                  Sovereign Host Sanctuary
                </span>
                <h3 className="font-serif text-lg font-black text-slate-900 uppercase leading-tight">
                  Neema Gospel Church
                </h3>
                <p className="text-slate-650 text-xs font-mono font-bold">
                  3015 N Josey Ln, Carrollton, TX 75007 (Dallas Metro)
                </p>

                <p className="text-slate-500 text-xs leading-relaxed font-semibold">
                  Neema Gospel Church is an expansive, high-tech sanctuary which can handle international delegations with secure parking. It is a warm, godly house of praise, easily accessible from central Dallas freeways.
                </p>
              </div>

              {/* Graphic Mock map or real locator */}
              <div className="h-44 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center text-center p-4 mt-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#dc2626_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
                <div className="relative z-10 space-y-1.5 text-center">
                  <MapPin className="w-7 h-7 text-red-600 mx-auto animate-bounce" />
                  <span className="text-[10px] font-black text-slate-800 block uppercase tracking-wider mb-1">Interactive Metropark Map</span>
                  <a
                    href="https://maps.google.com/?q=Neema+Gospel+Church+Josey+Ln+Carrollton+TX"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-full text-[9px] font-black uppercase tracking-widest transition inline-block cursor-pointer select-none shadow"
                  >
                    Launch Google Maps
                  </a>
                </div>
              </div>
            </div>
                  {/* Airport Guide card list */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between shadow-md">
              <div className="space-y-4">
                <span className="text-[10px] text-[#ef4444] font-extrabold uppercase tracking-widest block font-mono">
                  Flight & Shuttles Coordination
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 uppercase">
                  Airport Transfers
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed font-semibold">
                  Delegates flying in from East Africa, Western Europe, or other states are recommended to book their tickets to either of Dallas' major airports:
                </p>
              </div>

              <div className="space-y-4 mt-6">
                {[
                  { name: "Dallas/Fort Worth International (DFW)", dist: "Approx 15-20 miles to Neema Gospel Church. Major global hub for British Airways, Qatar, and KLM." },
                  { name: "Dallas Love Field (DAL)", dist: "Approx 16 miles to venue. Convenient domestic flight terminal for connecting state transfers (Southwest Airlines)." }
                ].map((apt, idx) => (
                  <div key={idx} className="flex gap-3 start items-start">
                    <Plane className="w-4 h-4 text-red-600 shrink-0 mt-1" />
                    <div>
                      <span className="text-xs font-extrabold text-slate-900 block leading-tight">{apt.name}</span>
                      <p className="text-[10.5px] text-slate-500 mt-1 leading-normal font-semibold">{apt.dist}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Hotel list card grid */}
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#ef4444] font-mono block">
              Partner Lodging (AIC Special Room allocations)
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-medium">
              {HOTELS.map((hotel) => (
                <div key={hotel.name} className="p-5 bg-white border border-slate-200/80 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition">
                  <div>
                    <h4 className="text-xs font-black text-amber-700 uppercase leading-snug">{hotel.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 font-mono font-bold">{hotel.address}</p>
                    <ul className="text-[10.5px] text-slate-600 space-y-1 mt-3 font-semibold">
                      <li>📍 {hotel.distance}</li>
                      <li className="font-bold text-emerald-600">💵 {hotel.rate}</li>
                      <li>📞 {hotel.phone}</li>
                    </ul>
                  </div>

                  {hotel.bookingLink && (
                    <a
                      href={hotel.bookingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 w-full py-2 bg-slate-50 hover:bg-red-50 hover:text-red-700 border border-slate-200 text-slate-700 text-[9px] font-black tracking-widest uppercase transition text-center cursor-pointer block select-none rounded-lg"
                    >
                      Check Availability
                    </a>
                  )}
                </div>
              ))}
            </div>
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
