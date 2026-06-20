import React from 'react';
import { Calendar, CheckCircle2 } from 'lucide-react';

import featuredImg from '../assets/images/2026 Organizing Committee.png';

export default function VisaSupport() {
  return (
    <section id="visa" className="scroll-mt-16 py-16 bg-transparent border-y border-slate-200 relative overflow-hidden">
      {/* Decorative blurred lights */}
      <div className="absolute top-1/4 -right-16 w-48 h-48 rounded-full bg-red-100/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-16 w-48 h-48 rounded-full bg-blue-100/10 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4">
        
        {/* Title Block */}
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-bold text-red-650 uppercase tracking-widest font-mono">
            Visa & Consular Assistance
          </span>
          <h2 className="font-sans text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight">
            1-on-1 Visa Coaching
          </h2>
          <div className="w-16 h-1.5 bg-gradient-to-r from-blue-600 to-red-600 mx-auto rounded-full" />
          <p className="text-slate-600 max-w-xl mx-auto text-sm mt-3 font-semibold">
            Ensure your travel strategy is sound. Connect directly with expert visa consultants for custom interview preparation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch bg-medium">
          
          {/* Section Left: Copy details & Booking Widget Banner */}
          <div className="bg-white border border-slate-200/80 p-6 md:p-8 rounded-3xl flex flex-col justify-between relative shadow-md">
             <div className="space-y-4">
               <h3 className="text-lg font-black uppercase">Expert Consular Support</h3>
               <p className="text-xs text-slate-500 font-bold">Connect with expert consultant <strong>Juden Freeman</strong> for custom interview preparation and application guidance.</p>
               <div className="space-y-2 pt-4">
                 <button className="w-full py-3 bg-red-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest">Request Invitation Letter</button>
                 <a href="https://visas101.com/" target="_blank" className="block w-full py-3 border border-slate-200 text-slate-800 text-center rounded-xl font-black uppercase text-[10px] tracking-widest">Visit Visa101</a>
               </div>
             </div>
             <div className="mt-8 pt-8 border-t border-slate-100">
               <h4 className="text-[10px] font-black uppercase tracking-widest mb-4">Step-by-Step Instructions</h4>
               <ul className="text-[10px] space-y-2 font-bold text-slate-600">
                 <li className="flex gap-2"><span>1.</span> Register for the conference and request a letter.</li>
                 <li className="flex gap-2"><span>2.</span> Book a 1-on-1 coaching call for interview prep.</li>
                 <li className="flex gap-2"><span>3.</span> Complete your DS-160 and attend your interview.</li>
               </ul>
             </div>
          </div>

            <div className="pt-6 border-t border-slate-100 mt-6 md:mt-12">
              <a
                href="https://link.visas101.com/widget/bookings/1-on-1-coaching-call-30-minutes"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[10px] uppercase tracking-[0.2em] rounded-full transition duration-300 transform active:scale-97 text-center cursor-pointer select-none shadow-[0_4px_12px_rgba(220,38,38,0.15)]"
              >
                <Calendar className="w-4 h-4" />
                Book Consular Support Session
              </a>
              <span className="text-[10px] text-slate-500 font-mono block text-center mt-2.5">
                Redirects to link.visas101.com booking manager
              </span>
            </div>
          <div className="space-y-4 flex flex-col justify-between">
            <div className="bg-white border border-slate-200/80 p-6 rounded-3xl space-y-4 shadow-md">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2 font-mono">
                Process Summary
              </h4>
              
              <div className="space-y-4 font-medium">
                {[
                  { num: "01", title: "Book Your Slot", desc: "Select a date/time using the booking calendar and settle your support fee." },
                  { num: "02", title: "Form Verification", desc: "Share your draft DS-160 details and previous interview travel histories." },
                  { num: "03", title: "Video Interview Masterclass", desc: "Join your 1-on-1 session to rehearse key responses and structure your credentials properly." }
                ].map((item) => (
                  <div key={item.num} className="flex gap-4">
                    <span className="font-mono text-xs font-extrabold text-slate-800 bg-slate-50 border border-slate-205 px-2.5 py-1 rounded-lg h-7 select-none">
                      {item.num}
                    </span>
                    <div>
                      <span className="text-xs font-extrabold text-slate-900 block">{item.title}</span>
                      <p className="text-[11px] text-slate-550 leading-snug mt-0.5 font-semibold">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats list (Anonymized success story support) */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3.5 shadow-sm">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
              <div>
                <span className="text-xs font-extrabold text-slate-900 uppercase block">Proven Preparatory Success</span>
                <p className="text-[10px] text-slate-550 font-semibold leading-relaxed">
                  Dozens of ministerial and commercial delegates prepared through similar consular training sessions have successfully secured visas to travel to previous regional plenaries.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image Replacement (Organizing Committee) */}
        <div className="mt-12 flex flex-col items-center">
          <div className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white">
            <img
              src={featuredImg}
              alt="2026 organizing committee"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
            <div className="p-6 text-center">
              <h3 className="text-xl font-black text-slate-900 uppercase mb-2">2026 Organizing Committee</h3>
              <p className="text-slate-600 font-medium">
                Dedicated leaders working together to ensure a transformative experience for every delegate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
