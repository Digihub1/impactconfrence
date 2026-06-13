import React, { useState, useRef } from 'react';
import { Award, UserCheck, ShieldCheck, Upload, Link2, HelpCircle, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Nomination } from '../types';

const US_STATES = [
  "Texas", "California", "New York", "Georgia", "Washington", "Massachusetts", "Maryland",
  "North Carolina", "Florida", "Illinois", "Minnesota", "Arizona", "Ohio", "Michigan", "Other"
];

export default function DiasporaAwards() {
  const [form, setForm] = useState({
    nominatorName: '',
    nominatorContact: '',
    nomineeName: '',
    nomineeOrganization: '',
    state: 'Texas',
    reason: '',
    supportingLink: '',
  });

  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Drag and Drop files
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const processFile = (file: File) => {
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > 10) {
      setErrors(prev => ({ ...prev, file: 'File size must be less than 10MB' }));
      return;
    }
    setUploadedFile({
      name: file.name,
      size: `${sizeInMB.toFixed(2)} MB`
    });
    if (errors.file) setErrors(prev => ({ ...prev, file: '' }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validateForm = () => {
    const nextErrors: { [key: string]: string } = {};

    if (!form.nominatorName.trim()) nextErrors.nominatorName = 'Nominator Name is required';
    if (!form.nominatorContact.trim()) nextErrors.nominatorContact = 'Nominator contact details are required';
    if (!form.nomineeName.trim()) nextErrors.nomineeName = 'Nominee Name is required';
    if (!form.nomineeOrganization.trim()) nextErrors.nomineeOrganization = 'Nominee organization is required';
    
    const reasonLength = form.reason.trim().length;
    if (reasonLength < 250) {
      nextErrors.reason = `Reason must be at least 250 characters (Current: ${reasonLength} chars)`;
    } else if (reasonLength > 500) {
      nextErrors.reason = `Reason cannot exceed 500 characters (Current: ${reasonLength} chars)`;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Save of nomination
    const timestamp = Date.now();
    const newNomination: Nomination = {
      id: `award-nom-${timestamp}`,
      date: new Date().toISOString(),
      nominatorName: form.nominatorName,
      nominatorContact: form.nominatorContact,
      nomineeName: form.nomineeName,
      nomineeOrganization: form.nomineeOrganization,
      state: form.state,
      reason: form.reason,
      supportingLink: form.supportingLink || undefined,
      fileName: uploadedFile?.name || undefined
    };

    // Store in localStorage
    const existingStr = localStorage.getItem('AIC_NOMINATIONS');
    const existingList: Nomination[] = existingStr ? JSON.parse(existingStr) : [];
    existingList.push(newNomination);
    localStorage.setItem('AIC_NOMINATIONS', JSON.stringify(existingList));

    setSuccess(true);
    
    // Reset form states
    setForm({
      nominatorName: '',
      nominatorContact: '',
      nomineeName: '',
      nomineeOrganization: '',
      state: 'Texas',
      reason: '',
      supportingLink: '',
    });
    setUploadedFile(null);
  };

  return (
    <section id="awards" className="scroll-mt-16 py-16 bg-transparent border-t border-slate-200 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-red-100/10 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4">
        
        {/* Title Block */}
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-bold text-red-650 uppercase tracking-widest font-mono flex items-center justify-center gap-1.5">
            <Award className="w-4 h-4 text-red-600 animate-bounce" /> Excellence & Impact
          </span>
          <h2 className="font-sans text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight">
            Diaspora Awards 2026
          </h2>
          <div className="w-16 h-1.5 bg-gradient-to-r from-blue-600 to-red-600 mx-auto rounded-full" />
          <p className="text-slate-600 max-w-xl mx-auto text-sm mt-3 font-semibold">
            Recognizing exceptional leaders and ministries serving the Diaspora. Help us honor those who are working tirelessly within the community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Block: Guidelines copy */}
          <div className="md:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-md">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.15em] border-b border-slate-100 pb-2 font-mono">
              Nomination Guidelines
            </h3>

            <p className="text-slate-655 text-xs leading-relaxed font-semibold">
              We welcome and value nominations of leaders who have selflessly served the diaspora community – whether in Christian ministries or non-Christian social spheres (commercial, educational, charity, health).
            </p>

            <ul className="space-y-4 font-medium">
              {[
                { title: "Fair Evaluation Panel", text: "All submissions are vetted by an independent inter-denominational committee of elders and specialists." },
                { title: "Awards Ceremony Dinner", text: "Nominated candidates & selected winners are officially hosted at the Awards Gala Dinner on Sunday evening, Sept 27." },
                { title: "Validation Checkups", text: "Please provide valid contact channels for both yourself and the nominee." }
              ].map((item, idx) => (
                <li key={idx} className="flex gap-2.5 items-start">
                  <ShieldCheck className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block leading-tight">{item.title}</span>
                    <p className="text-[10.5px] text-slate-550 leading-normal mt-1 font-semibold">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-[9px] font-black text-red-650 block uppercase tracking-widest font-mono">Sunday Gala Keynote Venue</span>
              <p className="text-[10px] text-slate-705 font-semibold mt-1">
                Grand Pavilion, Neema Gospel Church, Dallas, Texas. Sunday Sept 27 @ 6:00 PM.
              </p>
            </div>
          </div>          {/* Right Block: Nomination Interactive Form */}
          <div className="md:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-md">
            <h3 className="text-xs font-black text-red-650 uppercase tracking-[0.15em] border-b border-slate-100 pb-4 mb-4 font-mono">
              Submit Your Nomination
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
                  <h4 className="text-base font-extrabold text-slate-900 uppercase">Thank You! Nomination Received</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto font-semibold leading-relaxed">
                    Your nomination details have been safely indexed. The board of evaluators will review other documents provided in due course. Selected nominees will receive direct email invitations in August.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="mt-4 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-[10px] uppercase tracking-widest rounded-lg transition border border-slate-200 cursor-pointer"
                  >
                    Nominate Another Leader
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 font-semibold">
                  {/* Nominator Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-medium font-semibold">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest block font-mono">Your Full Name *</label>
                      <input
                        type="text"
                        name="nominatorName"
                        placeholder="Nominator Name"
                        value={form.nominatorName}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-400 focus:bg-white transition"
                      />
                      {errors.nominatorName && <p className="text-[10px] font-bold text-red-500 mt-1">{errors.nominatorName}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest block font-mono">Your Contact (Phone/Email) *</label>
                      <input
                        type="text"
                        name="nominatorContact"
                        placeholder="E.g., phone or email"
                        value={form.nominatorContact}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-400 focus:bg-white transition"
                      />
                      {errors.nominatorContact && <p className="text-[10px] font-bold text-red-500 mt-1">{errors.nominatorContact}</p>}
                    </div>
                  </div>

                  {/* Nominee Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-medium font-semibold">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest block font-mono">Nominee Name *</label>
                      <input
                        type="text"
                        name="nomineeName"
                        placeholder="Name of leader"
                        value={form.nomineeName}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-400 focus:bg-white transition font-bold"
                      />
                      {errors.nomineeName && <p className="text-[10px] font-bold text-red-500 mt-1">{errors.nomineeName}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest block font-mono">Nominee Org / Church / Field *</label>
                      <input
                        type="text"
                        name="nomineeOrganization"
                        placeholder="Ministry or organization"
                        value={form.nomineeOrganization}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-400 focus:bg-white transition"
                      />
                      {errors.nomineeOrganization && <p className="text-[10px] font-bold text-red-500 mt-1">{errors.nomineeOrganization}</p>}
                    </div>
                  </div>

                  {/* State Select */}
                  <div className="space-y-1 font-medium font-semibold">
                    <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest block font-mono">State of Core Impact (USA) *</label>
                    <select
                      name="state"
                      value={form.state}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-400 focus:bg-white transition cursor-pointer"
                    >
                      {US_STATES.map(st => (
                        <option className="bg-white text-slate-800 font-semibold" key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  {/* Reason (250-500 characters) */}
                  <div className="space-y-1 font-medium font-semibold">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest block font-mono">Reason for Nomination *</label>
                      <span className={`text-[10px] font-bold ${
                        form.reason.length >= 250 && form.reason.length <= 500
                          ? 'text-emerald-600'
                          : 'text-red-650'
                      }`}>
                        {form.reason.length} / 500 characters (Min 250)
                      </span>
                    </div>
                    <textarea
                      name="reason"
                      placeholder="Explain in 250–500 characters the specific impact, projects, or community work this nominee has led..."
                      rows={5}
                      value={form.reason}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-400 focus:bg-white transition leading-relaxed resize-none"
                    />
                    {errors.reason && <p className="text-[10.5px] font-bold text-red-500 leading-snug mt-1">{errors.reason}</p>}
                  </div>

                  {/* Supporting Link */}
                  <div className="space-y-1 font-medium font-semibold">
                    <label className="text-[10px] font-black text-slate-700 uppercase tracking-[0.15em] block font-mono">Supporting Profile Link</label>
                    <div className="relative">
                      <Link2 className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="url"
                        name="supportingLink"
                        placeholder="https://example.com/profile"
                        value={form.supportingLink}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-400 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  {/* Drag and Drop File Upload */}
                  <div className="space-y-1 font-medium font-semibold">
                    <label className="text-[10px] font-black text-slate-700 uppercase tracking-[0.15em] block font-mono">Upload Supporting Documents (Max 10MB)</label>
                    
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition ${
                        isDragActive
                          ? 'bg-red-50 border-red-400'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        className="hidden"
                      />
                      
                      {!uploadedFile ? (
                        <>
                          <Upload className="w-6 h-6 text-slate-400 mb-1" />
                          <span className="text-[11px] font-bold text-slate-700 mb-0.5">Drag and drop file here, or click to browse</span>
                          <span className="text-[9px] text-slate-400">PDF, Word, or JPG files only</span>
                        </>
                      ) : (
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <div className="p-1 px-2.5 rounded bg-red-50 border border-red-200 text-xs font-bold text-red-650">
                            Loaded
                          </div>
                          <div className="text-left">
                            <p className="text-[11px] font-bold text-slate-800 max-w-[200px] truncate">{uploadedFile.name}</p>
                            <span className="text-[9.5px] text-slate-500">{uploadedFile.size}</span>
                          </div>
                          <button
                            type="button"
                            onClick={clearFile}
                            className="p-1 text-slate-500 hover:text-slate-800 bg-slate-100 border border-slate-200 rounded-lg ml-2 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                    {errors.file && <p className="text-[10px] font-bold text-red-500 mt-1">{errors.file}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-red-600 hover:bg-red-750 text-white font-extrabold text-[10px] uppercase tracking-[0.2em] rounded-full transition duration-300 cursor-pointer text-center select-none active:scale-97 shadow-[0_4px_12px_rgba(220,38,38,0.15)]"
                  >
                    Submit Nomination
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
