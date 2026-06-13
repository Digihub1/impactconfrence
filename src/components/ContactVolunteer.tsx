import React, { useState } from 'react';
import { Mail, MessageCircle, Send, CheckCircle, ShieldCheck, HelpCircle, PhoneCall } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContactMessage } from '../types';

export default function ContactVolunteer() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'General Question',
    message: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const nextErrors: { [key: string]: string } = {};

    if (!form.name.trim()) nextErrors.name = 'Your name is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      nextErrors.email = 'Your email is required';
    } else if (!emailRegex.test(form.email)) {
      nextErrors.email = 'Enter a valid email address';
    }

    if (!form.message.trim()) nextErrors.message = 'Please type your question or message';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Build contact message object
    const timestamp = Date.now();
    const newMsg: ContactMessage = {
      id: `msg-${timestamp}`,
      date: new Date().toISOString(),
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message
    };

    // Store in localStorage
    const existingStr = localStorage.getItem('AIC_MESSAGES');
    const existingList: ContactMessage[] = existingStr ? JSON.parse(existingStr) : [];
    existingList.push(newMsg);
    localStorage.setItem('AIC_MESSAGES', JSON.stringify(existingList));

    // Async sync to backend API for email submission
    // The actual email sending logic would be handled by the backend at /api/contact
    // The recipient email address (lukas@proximitypointcity.com) would be configured on the backend.
    fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...newMsg,
        recipientEmail: 'lukas@proximitypointcity.com' // Indicate recipient for backend
      })
    }).then(res => res.json())
      .then(data => {
        console.log('Contact message successfully synced to backend for email!', data);
      })
      .catch(err => console.error('Failed to sync contact message to backend: ', err));

    setSuccess(true);
    setForm({
      name: '',
      email: '',
      subject: 'General Question',
      message: '',
    });
  };

  return (
    <section id="contact" className="scroll-mt-16 py-16 bg-transparent border-t border-slate-200 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="max-w-4xl mx-auto px-4">
        
        {/* Title Block */}
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-bold text-red-650 uppercase tracking-widest font-mono">
            Get In Touch
          </span>
          <h2 className="font-sans text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight">
            Contact Committees
          </h2>
          <div className="w-16 h-1.5 bg-gradient-to-r from-blue-600 to-red-600 mx-auto rounded-full" />
          <p className="text-slate-600 max-w-xl mx-auto text-sm mt-3 font-semibold">
            Connecting our international delegates. Ask about registration options, logistics, hotels, or visa letters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Block: Bishop/Chair Contact Card */}
          <div className="md:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-md font-medium font-semibold">
            <div>
              <span className="text-[9px] text-red-655 font-black uppercase tracking-[0.2em] block font-mono">
                Conference Chairman
              </span>
              <h3 className="font-serif text-lg font-black text-slate-900 mt-1">
                Prof Lukas Njenga
              </h3>
              <p className="text-[11px] text-slate-500">
                Apostolic Secretariat, AIC Dallas 2026
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              
              {/* Email */}
              <div className="flex gap-3 items-center">
                <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 shrink-0">
                  <Mail className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 uppercase font-black block tracking-wider font-mono">Email Support</span>
                  <a
                    href="mailto:Lukas@heartforthecity.co.uk"
                    className="text-xs font-bold text-slate-800 hover:text-red-650 transition"
                  >
                    Lukas@heartforthecity.co.uk
                  </a>
                </div>
              </div>

              {/* Direct WhatsApp Contacts */}
              <div className="space-y-3">
                <span className="text-[9px] text-slate-500 uppercase font-black block mb-1 tracking-wider flex items-center gap-1 font-mono">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-500" /> WhatsApp Hotlines
                </span>

                {[
                  { label: "United Kingdom (Office)", num: "+44 7985 505 797", raw: "447985505797" },
                  { label: "United States (Local Chair)", num: "+1 945 270 9002", raw: "19452709002" },
                  { label: "Kenya Liaison", num: "+254 7955 08970", raw: "254795508970" }
                ].map((wa) => (
                  <div key={wa.raw} className="flex gap-3 items-center">
                    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-center text-emerald-600 shrink-0">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 font-bold block">{wa.label}</span>
                      <a
                        href={`https://wa.me/${wa.raw}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono font-extrabold text-slate-800 hover:text-emerald-600 transition block leading-tight"
                      >
                        {wa.num}
                      </a>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-205 text-[10px] text-slate-600 leading-relaxed font-semibold">
              ❓ Prefer face-to-face assistance? Ground registers are active at Neema Gospel Church during each morning session.
            </div>
          </div>

          {/* Right Block: General Questions Form */}
          <div className="md:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-md">
            <h3 className="text-xs font-black text-red-655 uppercase tracking-[0.15em] border-b border-slate-100 pb-4 mb-4 font-mono">
              Send an Inquiry Message
            </h3>

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 text-center py-8"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 text-emerald-600">
                    <ShieldCheck className="w-8 h-8 animate-pulse" />
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 uppercase">Inquiry Filed Successfully</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto font-semibold leading-relaxed">
                    Thanks for submitting! An advisor representing Prof Lukas Njenga's office will review your inquiry and follow-up at the registered email inside 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="mt-4 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-[10px] uppercase tracking-widest rounded-lg transition border border-slate-200 cursor-pointer"
                  >
                    File Another Query
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 font-semibold">
                  {/* Name */}
                  <div className="space-y-1 font-medium font-semibold">
                    <label className="text-[10px] font-black text-slate-705 uppercase tracking-widest block font-mono">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="E.g., Brother Davis"
                      value={form.name}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-400 focus:bg-white transition"
                    />
                    {errors.name && <p className="text-[10px] font-bold text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1 font-medium font-semibold">
                    <label className="text-[10px] font-black text-slate-750 uppercase tracking-widest block font-mono">Your Email *</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="davis@mychurch.org"
                      value={form.email}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-400 focus:bg-white transition"
                    />
                    {errors.email && <p className="text-[10px] font-bold text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  {/* Subject selector */}
                  <div className="space-y-1 font-medium font-semibold">
                    <label className="text-[10px] font-black text-slate-750 uppercase tracking-widest block font-mono">Inquiry Category *</label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-400 focus:bg-white transition cursor-pointer"
                    >
                      <option className="bg-white text-slate-805" value="General Question">General Question</option>
                      <option className="bg-white text-slate-805" value="Visa Support Letter">Visa Support Letter</option>
                      <option className="bg-white text-slate-805" value="Awards Help">Awards Nomination Enquiry</option>
                      <option className="bg-white text-slate-805" value="Hotel Discounts">Hotel Booking Advice</option>
                      <option className="bg-white text-slate-805" value="Volunteering">Volunteering Details</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div className="space-y-1 font-medium font-semibold">
                    <label className="text-[10px] font-black text-slate-750 uppercase tracking-widest block font-mono">Your Question / Message *</label>
                    <textarea
                      name="message"
                      placeholder="Type your question or support request here. Be as detailed as possible."
                      rows={5}
                      value={form.message}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-400 focus:bg-white transition leading-relaxed resize-none font-semibold"
                    />
                    {errors.message && <p className="text-[10px] font-bold text-red-500 mt-1">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-widest rounded-full transition duration-300 cursor-pointer flex items-center justify-center gap-2 select-none active:scale-97 shadow-[0_4px_12px_rgba(220,38,38,0.15)]"
                  >
                    <Send className="w-3.5 h-3.5 py-0.5" />
                    SUBMIT INQUIRY
                  </button>
                </form>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>
    </section>
  );
}
