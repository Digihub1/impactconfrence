import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, Clock, Info, CheckCircle2, ShieldAlert, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
  {
    question: "What exactly is covered in this 1-on-1 coaching session?",
    answer: "During your 30-minute private video call, our visa advisor reviews your personal situation, provides professional guidance regarding the DS-160 visa form application, suggests which supporting credentials to carry (financial records, ministry invitations), and shares mock interview practice questions. We analyze factors that show strong community ties to help build a realistic case."
  },
  {
    question: "Does booking a coaching session guarantee a US Visa?",
    answer: "No. Only consular officers at the United States Embassy / Consulate make the final determination based on federal immigration laws. This service prepares your interview readiness and documentation checklists to help avoid avoidable clerical errors, and does not serve as a guarantee of visa issuance."
  },
  {
    question: "Do I get an official Church Invitation Letter for my appointment?",
    answer: "Yes! If you select the 'US Visa Invitation Letter' request during your conference registration, Neema Gospel Church and Deliverance Church International can produce a signed invitational badge after verifying your details. This letter can be carried as support for your consular officer interview."
  },
  {
    question: "What should I bring to the coaching call?",
    answer: "Please have your current passport details, any rough drafts of your DS-160 application (if started), details about previous international travel, and any specific questions regarding scheduling appointments at your local US embassy."
  }
];

export default function VisaSupport() {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(prev => (prev === idx ? null : idx));
  };

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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-slate-800 text-[10px] font-extrabold uppercase tracking-[0.2em] font-mono">
                <Video className="w-3.5 h-3.5 text-blue-600" /> Virtual Zoom Support
              </div>
              
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                Consular Preparation Calls
              </h3>
              
              <p className="text-slate-655 text-xs leading-relaxed font-semibold">
                Book a structured 30-minute coaching session to prepare your US Visitor Visa (B1/B2) application. Our experienced counselors provide customized prep checklists, mock questions, and document audits.
              </p>

              <div className="p-3 bg-red-50/50 border border-red-100 rounded-xl flex items-start gap-2 text-slate-800 font-semibold">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="text-[10px] leading-normal font-sans text-slate-700">
                  <strong>DISCLAIMER:</strong> This is expert preparatory advisory coaching. This does not represent an immigration agency, and cannot guarantee visa issuance by the US Embassy.
                </span>
              </div>
            </div>

            {/* Direct Booking CTA Widget */}
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
          </div>

          {/* Section Right: Process and Guidelines */}
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

        {/* FAQs Accordion Block */}
        <div className="mt-12 space-y-3">
          <h3 className="font-sans text-lg font-black text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-red-600" /> Helpful Visa FAQs
          </h3>

          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div key={idx} className="py-2.5">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between py-2.5 text-left text-xs font-extrabold text-slate-900 hover:text-red-650 uppercase tracking-wide transition cursor-pointer select-none"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-red-600" />}
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-3 text-[11px] text-slate-600 leading-relaxed font-semibold">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
