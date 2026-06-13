import React, { useEffect, useMemo, useRef, useState } from 'react';

import { X, User, Mail, Phone, Globe, MapPin, Building, Briefcase, CreditCard, CheckCircle, Ticket, Download, Sparkles, Receipt, Percent, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROMO_CODES } from '../data';
import { Registration, AttendeeDetails, AttendanceDetails, MinistryDetails, PaymentDetails } from '../types';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (reg: Registration) => void;
}

const COUNTRIES = [
  "United States", "Kenya", "Canada", "United Kingdom", "Uganda", "Tanzania",
  "Rwanda", "Nigeria", "South Africa", "Ghana", "Germany", "France", "Australia", "Other"
];

const VOLUNTEER_ROLES = [
  "Ushering & Protocol", "Worship & Musician Support", "Audio / Video / Live Stream Tech",
  "Hospitality & Welfare", "Prayer force & Counseling", "Registration desk & Information"
];

export default function RegistrationModal({ isOpen, onClose, onSuccess }: RegistrationModalProps) {
  const DRAFT_STORAGE_KEY = 'AIC_REGISTRATION_DRAFT_v1';
  const [step, setStep] = useState(1);
  const [restoring, setRestoring] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isRestoringDraftRef = useRef(false);

  // Form States
  const [attendee, setAttendee] = useState<AttendeeDetails>({
    fullName: '',
    email: '',
    phone: '',
    country: 'United States',
    stateCity: '',
  });

  const [attendance, setAttendance] = useState<AttendanceDetails>({
    type: 'In-person',
    days: ['24', '25', '26', '27'],
    requestVisaLetter: false,
  });

  const [ministry, setMinistry] = useState<MinistryDetails>({
    organization: '',
    roleTitle: '',
    wantsToVolunteer: false,
    volunteerRoles: [],
  });

  const [payment, setPayment] = useState<PaymentDetails>({
    ticketType: 'Free',
    promoCode: '',
    discountApplied: 0,
    totalPaid: 0,
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    termsAccepted: false,
  });

  // Promo checking
  const [promoMessage, setPromoMessage] = useState({ text: '', type: '' });
  const [tempPromo, setTempPromo] = useState('');

  // Form Finished Registration State
  const [completedRegistration, setCompletedRegistration] = useState<Registration | null>(null);


  // Base Ticket Cost
  const getTicketPrice = (type: 'Free' | 'Standard' | 'VIP') => {
    if (type === 'Free') return 0;
    if (type === 'Standard') return 50;
    return 150;
  };

  const calculateTotal = (type: 'Free' | 'Standard' | 'VIP', discountPercent: number) => {
    const base = getTicketPrice(type);
    const discounted = base - (base * discountPercent);
    return Math.max(0, discounted);
  };

  // Field change handlers
  const handleAttendeeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAttendee(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleAttendanceType = (type: 'In-person' | 'Online') => {
    setAttendance(prev => ({ ...prev, type }));
  };

  const handleDaySelect = (day: string) => {
    setAttendance(prev => {
      const exists = prev.days.includes(day);
      const updatedDays = exists
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day];
      return { ...prev, days: updatedDays };
    });
  };

  const handleMinistryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMinistry(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleVolunteerRole = (role: string) => {
    setMinistry(prev => {
      const exists = prev.volunteerRoles.includes(role);
      const updated = exists
        ? prev.volunteerRoles.filter(r => r !== role)
        : [...prev.volunteerRoles, role];
      return { ...prev, volunteerRoles: updated };
    });
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPayment(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleTicketSelect = (type: 'Free' | 'Standard' | 'VIP') => {
    const finalTotal = calculateTotal(type, payment.discountApplied || 0);
    setPayment(prev => ({
      ...prev,
      ticketType: type,
      totalPaid: finalTotal
    }));
  };

  // Promo Code Validation
  const applyPromo = () => {
    const sanitized = tempPromo.trim().toUpperCase();
    if (PROMO_CODES[sanitized] !== undefined) {
      const discount = PROMO_CODES[sanitized];
      const finalPrice = calculateTotal(payment.ticketType, discount);
      setPayment(prev => ({
        ...prev,
        promoCode: sanitized,
        discountApplied: discount,
        totalPaid: finalPrice
      }));
      setPromoMessage({ text: `Success! Code applied: ${discount * 100}% discount`, type: 'success' });
    } else {
      setPromoMessage({ text: 'Invalid promo code', type: 'error' });
    }
  };

  const PHONE_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

  // Step Nav validations
  const validateStep = (currentStep: number) => {
    const stepErrors: { [key: string]: string } = {};

    if (currentStep === 1) {
      if (!attendee.fullName.trim()) stepErrors.fullName = 'Full Name is required';

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!attendee.email.trim()) {
        stepErrors.email = 'Email is required';
      } else if (!emailRegex.test(attendee.email)) {
        stepErrors.email = 'Enter a valid email address';
      }

      if (!attendee.phone.trim()) {
        stepErrors.phone = 'Phone number is required';
      } else if (!PHONE_REGEX.test(attendee.phone.trim())) {
        stepErrors.phone = 'Invalid phone format.';
      }

      if (!attendee.stateCity.trim()) stepErrors.stateCity = 'State / City is required';
    }


    if (currentStep === 2) {
      if (attendance.days.length === 0) {
        stepErrors.days = 'Select at least one day you will attend';
      }
    }

    if (currentStep === 3) {
      if (!ministry.organization.trim()) stepErrors.organization = 'Church, Ministry or Organization is required';
      if (!ministry.roleTitle.trim()) stepErrors.roleTitle = 'Role/Title is required';
      if (ministry.wantsToVolunteer && ministry.volunteerRoles.length === 0) {
        stepErrors.volunteerRoles = 'Select at least one role you would like to serve in';
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const draftSnapshot = useMemo(() => {
    return {
      step,
      attendee,
      attendance,
      ministry,
      payment,
      updatedAt: Date.now()
    };
  }, [step, attendee, attendance, ministry, payment]);

  const persistDraft = (snapshot: typeof draftSnapshot) => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(snapshot));
    } catch (e) {
      // ignore storage errors
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    if (!draftSnapshot) return;
    if (isRestoringDraftRef.current) return;
    persistDraft(draftSnapshot);
  }, [isOpen, draftSnapshot]);

  useEffect(() => {
    if (!isOpen) return;
    try {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<typeof draftSnapshot> & { step?: number };
      if (!parsed.step) return;

      isRestoringDraftRef.current = true;
      setStep(Math.max(1, Math.min(3, parsed.step)));
      if (parsed.attendee) setAttendee(parsed.attendee as AttendeeDetails);
      if (parsed.attendance) setAttendance(parsed.attendance as AttendanceDetails);
      if (parsed.ministry) setMinistry(parsed.ministry as MinistryDetails);
      if (parsed.payment) setPayment(parsed.payment as PaymentDetails);
    } catch {
      // ignore draft restore errors
    } finally {
      isRestoringDraftRef.current = false;
      setRestoring(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const clearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const progressPct = useMemo(() => {
    if (step <= 1) return 33;
    if (step === 2) return 66;
    return 100;
  }, [step]);

  const handleNext = () => {
    if (!validateStep(step)) return;

    // Save draft before moving steps (best-effort)
    try {
      const snapshot = {
        step: step + 1,
        attendee,
        attendance,
        ministry,
        payment,
        updatedAt: Date.now()
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(snapshot));
    } catch {
      // ignore
    }

    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setStep(prev => {
      const next = Math.max(1, prev - 1);
      try {
        localStorage.setItem(
          DRAFT_STORAGE_KEY,
          JSON.stringify({
            step: next,
            attendee,
            attendance,
            ministry,
            payment,
            updatedAt: Date.now()
          })
        );
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3) || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const utmSource = new URLSearchParams(window.location.search).get('utm_source') || undefined;

    try {
      // Use environment variable or replace with your Deployed Web App URL
      const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL || "YOUR_APPS_SCRIPT_WEB_APP_URL_HERE"; 
      const response = await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors', // Apps Script requires no-cors for simple POST across domains
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ 
          attendee, 
          attendance, 
          ministry, 
          payment, 
          utmSource,
          date: new Date().toISOString() 
        })
      });

      /**
       * Note: 'no-cors' mode results in an opaque response, meaning we can't read 
       * the JSON returned by GAS directly. For production, we use a fallback ID 
       * generator if the response is opaque, while the GAS script handles 
       * the correct sequential ID in the actual spreadsheet.
       */
      
      // Generate a temporary ID for the UI confirmation (the Sheet will have the sequential one)
      const officialId = `ICD-2026-TEMP-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

      const newReg: Registration = {
        id: officialId,
        date: new Date().toISOString(),
        ticketNumber: officialId,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${officialId}`,
        attendee,
        attendance,
        ministry,
        payment: { ...payment, cardNumber: '••••' },
        status: 'Confirmed'
      };

      clearDraft();
      setCompletedRegistration(newReg);
      onSuccess(newReg);
    } catch (err) {
      setSubmitError("Connection failed. Please check your internet and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  // Reset Form

  const resetAllForm = () => {
    setAttendee({
      fullName: '',
      email: '',
      phone: '',
      country: 'United States',
      stateCity: '',
    });
    setAttendance({
      type: 'In-person',
      days: ['24', '25', '26', '27'],
      requestVisaLetter: false,
    });
    setMinistry({
      organization: '',
      roleTitle: '',
      wantsToVolunteer: false,
      volunteerRoles: [],
    });
    setPayment({
      ticketType: 'Free',
      promoCode: '',
      discountApplied: 0,
      totalPaid: 0,
      cardName: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvv: '',
      termsAccepted: false,
    });
    setStep(1);
    setErrors({});
    setPromoMessage({ text: '', type: '' });
    setTempPromo('');
    setCompletedRegistration(null);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setPayment(prev => ({ ...prev, cardNumber: formatted }));
    if (errors.cardNumber) setErrors(prev => ({ ...prev, cardNumber: '' }));
  };

  const handleCardExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setPayment(prev => ({ ...prev, cardExpiry: value }));
    if (errors.cardExpiry) setErrors(prev => ({ ...prev, cardExpiry: '' }));
  };

  const triggerPrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  if (restoring) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
          <div className="text-center">
            <h3 className="text-sm font-black text-slate-900 tracking-widest uppercase font-mono">
              Preparing Registration
            </h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              Restoring your progress...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-t-[2rem] sm:rounded-3xl shadow-2xl overflow-hidden mt-auto sm:mt-0 sm:my-8 max-h-[92vh] sm:max-h-[90vh] flex flex-col">
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white sticky top-0 z-20 shrink-0 font-medium">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-red-650 animate-pulse" />
            <h2 className="text-sm font-black text-slate-900 tracking-widest uppercase font-mono whitespace-normal leading-tight">
              {completedRegistration ? 'Registration Confirmed!' : 'Conference Registration'}
            </h2>
          </div>
          <button
            onClick={() => { clearDraft(); resetAllForm(); onClose(); }}

            className="p-2 px-3 text-slate-500 hover:text-slate-800 transition bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-black uppercase tracking-widest cursor-pointer border border-slate-200"
          >
            <X className="w-4 h-4 inline mr-1" /> Close
          </button>
        </div>

        {/* Form area */}
        <div className="flex-1 overflow-hidden flex flex-col bg-white">
          {!completedRegistration && (
            <div className="px-6 pt-4 pb-2 border-b border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono whitespace-normal leading-tight">
                  Registration progress
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-700 font-mono">
                  {progressPct}%
                </div>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-600 transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}

          {!completedRegistration ? (
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
              {/* Stepper Wizard Indicator */} {/* Add min-h-0 to allow flex item to shrink and enable scrolling */}
              <div className="flex items-start justify-between pb-6 border-b border-slate-100 gap-1 sm:gap-2">
                {[1, 2, 3].map((s) => (
                  <React.Fragment key={s}>
                    <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition shrink-0 ${
                          step >= s
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                      >
                        {s}
                      </div>
                      <span className={`text-[8px] sm:text-[10px] font-semibold uppercase tracking-widest font-mono whitespace-normal leading-tight text-center break-words w-full px-1 ${
                        step >= s ? 'text-slate-900' : 'text-slate-500'
                      }`}>
                        {s === 1 && 'Personal Information'}
                        {s === 2 && 'Attendance Details'}
                        {s === 3 && 'Ministry & Community Service'}
                      </span>
                    </div>
                    {s < 3 && (
                      <div className="flex items-center h-8 flex-1">
                        <div className={`w-full h-0.5 ${step > s ? 'bg-red-600' : 'bg-slate-200'}`} />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* STEP 1: ATTENDEE DETAILS */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 font-medium min-h-0">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 whitespace-normal leading-tight">
                    Step 1: Delegate Identity
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1 min-w-0">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-widest block font-mono whitespace-normal leading-tight break-words">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          name="fullName"
                          placeholder="E.g., John Doe"
                          value={attendee.fullName}
                          onChange={handleAttendeeChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition min-w-0"
                        />
                      </div>
                      {errors.fullName && <p className="text-[10px] font-bold text-red-500 mt-1">{errors.fullName}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-1 min-w-0">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-widest block font-mono whitespace-normal leading-tight break-words">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          name="email"
                          placeholder="johndoe@example.com"
                          value={attendee.email}
                          onChange={handleAttendeeChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition min-w-0"
                        />
                      </div>
                      {errors.email && <p className="text-[10px] font-bold text-red-500 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div className="space-y-1 min-w-0">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-widest block font-mono whitespace-normal leading-tight break-words">Phone number *</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                        <input
                          type="tel"
                          name="phone"
                          placeholder="+1 (555) 019-2834"
                          required
                          pattern="^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$"
                          value={attendee.phone}
                          onChange={handleAttendeeChange}
                          className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition min-w-0 ${
                            errors.phone 
                              ? 'border-red-500 focus:ring-red-500' 
                              : 'border-slate-200 focus:ring-2 focus:ring-red-600 focus:border-transparent'
                          }`}
                        />
                      </div>
                      {errors.phone && <p className="text-[10px] font-bold text-red-500 mt-1">{errors.phone}</p>}
                    </div>

                    {/* Country */}
                    <div className="space-y-1 min-w-0">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-widest block font-mono whitespace-normal leading-tight break-words">Country of Residence *</label>
                      <div className="relative">
                        <Globe className="absolute left-3.5 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
                        <select
                          name="country"
                          value={attendee.country}
                          onChange={handleAttendeeChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition appearance-none cursor-pointer min-w-0"
                        >
                          {COUNTRIES.map(cty => (
                            <option className="bg-white text-slate-900" key={cty} value={cty}>{cty}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* State / City */}
                  <div className="space-y-1 min-w-0">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-widest block font-mono whitespace-normal leading-tight break-words">State / City of Residence *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        name="stateCity"
                        placeholder="E.g., Dallas, Texas"
                        value={attendee.stateCity}
                        onChange={handleAttendeeChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition min-w-0"
                      />
                    </div>
                    {errors.stateCity && <p className="text-[10px] font-bold text-red-500 mt-1">{errors.stateCity}</p>}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: ATTENDANCE DETAILS */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 font-medium min-h-0">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 whitespace-normal leading-tight">
                    Step 2: Attendance Format
                  </h3>

                  {/* In-person vs Online */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-widest block font-mono whitespace-normal leading-tight break-words">Participation Format</label>
                    <div className="grid grid-cols-1 gap-4">
                      <div
                        onClick={() => handleAttendanceType('In-person')}
                        className={`p-5 rounded-xl border flex flex-col justify-center cursor-pointer transition-all duration-200 ${
                          attendance.type === 'In-person'
                            ? 'bg-red-50 border-red-200 text-red-700 ring-2 ring-red-600 ring-inset'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-500'
                        }`}
                      >
                        <span className="font-bold text-sm whitespace-normal leading-tight">Join In-Person (Neema Gospel Church)</span>
                        <span className="text-xs mt-1 opacity-80 whitespace-normal leading-tight">At Neema Gospel Church, Dallas TX</span>
                      </div>
                    </div>
                  </div>

                  {/* Days attending */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-widest block font-mono whitespace-normal leading-tight break-words">Which days will you attend?</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { val: '24', label: 'Sept 24 (Thur)' },
                        { val: '25', label: 'Sept 25 (Fri)' },
                        { val: '26', label: 'Sept 26 (Sat)' },
                        { val: '27', label: 'Sept 27 (Sun)' },
                      ].map((item) => (
                        <div
                          key={item.val}
                          onClick={() => handleDaySelect(item.val)}
                          className={`p-3 rounded-xl border text-center cursor-pointer text-xs font-semibold uppercase tracking-wider transition-all duration-200 whitespace-normal leading-tight flex items-center justify-center ${
                            attendance.days.includes(item.val)
                              ? 'bg-red-600 border-red-600 text-white shadow-md'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {item.label}
                        </div>
                      ))}
                    </div>
                    {errors.days && <p className="text-[10px] font-bold text-red-500 mt-1">{errors.days}</p>}
                  </div>

                  {/* Visa invitation letter requested */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wide whitespace-normal leading-tight block">US Visa Invitation Letter?</span>
                        <p className="text-xs text-slate-600 mt-0.5">
                          If you reside outside the USA and require an official church signed invitation letter to present at your embassy interview, toggle below.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={attendance.requestVisaLetter}
                        onChange={(e) => setAttendance(prev => ({ ...prev, requestVisaLetter: e.target.checked }))}
                        className="w-5 h-5 rounded accent-red-600 border-slate-300 text-white cursor-pointer shrink-0"
                      />
                    </div>
                    {attendance.requestVisaLetter && (
                      <div className="p-3.5 bg-white border border-slate-200 rounded-xl mt-3">
                        <span className="text-xs font-semibold text-red-600 block uppercase mb-1 tracking-wider font-mono">Visa Support Booking Guidance</span>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          We recommend booking a 1-on-1 consular coaching session in the <strong>Visa Support</strong> section of the site to review your application strategy.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* STEP 3: MINISTRY / ROLE & VOLUNTEERING */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 font-medium min-h-0">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 whitespace-normal leading-tight">
                    Step 3: Ministry & Community Service
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Church / Org */}
                    <div className="space-y-1 min-w-0">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-widest block font-mono whitespace-normal leading-tight break-words">Church / Organization Name *</label>
                      <div className="relative">
                        <Building className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          name="organization"
                          placeholder="Your current home church"
                          value={ministry.organization}
                          onChange={handleMinistryChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition min-w-0"
                        />
                      </div>
                      {errors.organization && <p className="text-[10px] font-bold text-red-500 mt-1">{errors.organization}</p>}
                    </div>

                    {/* Role Title */}
                    <div className="space-y-1 min-w-0">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-widest block font-mono whitespace-normal leading-tight break-words">Your Title / Ministry Role / Profession *</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          name="roleTitle"
                          placeholder="E.g., Pastor, Usher, Member, CFO"
                          value={ministry.roleTitle}
                          onChange={handleMinistryChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition min-w-0"
                        />
                      </div>
                      {errors.roleTitle && <p className="text-[10px] font-bold text-red-500 mt-1">{errors.roleTitle}</p>}
                    </div>
                  </div>

                  {/* Wants to Volunteer */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wide whitespace-normal leading-tight block">Volunteer / Serve at the Conference?</span>
                        <p className="text-xs text-slate-600 mt-0.5">
                          We are looking for dedicated delegates to assist in ushering, multimedia streaming, sound engineering, and safety teams.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={ministry.wantsToVolunteer}
                        onChange={(e) => setMinistry(prev => ({ ...prev, wantsToVolunteer: e.target.checked }))}
                        className="w-5 h-5 rounded accent-red-600 border-slate-300 text-white cursor-pointer shrink-0"
                      />
                    </div>

                    {/* Conditional Volunteer Role Checklist */}
                    {ministry.wantsToVolunteer && (
                      <div className="p-3.5 bg-white border border-slate-200 rounded-xl mt-3 space-y-2">
                        <span className="text-xs font-semibold text-red-600 block uppercase mb-2 tracking-wider font-mono">Select your areas of interest *</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {VOLUNTEER_ROLES.map(role => {
                            const isChecked = ministry.volunteerRoles.includes(role);
                            return (
                              <label
                                key={role}
                                className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer text-xs font-semibold select-none border transition-colors whitespace-normal leading-tight ${
                                  isChecked
                                    ? 'bg-red-50 border-red-200 text-red-700'
                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleVolunteerRole(role)}
                                  className="mt-0.5 rounded accent-red-500 shrink-0"
                                />
                                {role}
                              </label>
                            );
                          })}
                        </div>
                        {errors.volunteerRoles && <p className="text-[10px] font-bold text-red-500 mt-1">{errors.volunteerRoles}</p>}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
              </div>

              {/* NAV BUTTONS */}
              <div className="sticky bottom-0 bg-white border-t border-slate-100 p-6 flex justify-between gap-4 shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex-1 sm:flex-none px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-widest rounded-xl transition cursor-pointer select-none border border-slate-200 active:scale-97"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 sm:flex-none px-10 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-xl transition duration-300 cursor-pointer select-none active:scale-97 shadow-lg shadow-red-100"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none px-10 py-3.5 bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-xl transition duration-300 cursor-pointer select-none active:scale-97 shadow-lg shadow-red-200 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                    ) : (
                      'Complete Registration'
                    )}
                  </button>
                )}
                {submitError && <p className="absolute -top-6 right-6 text-[10px] font-bold text-red-500">{submitError}</p>}
              </div>
            </form>
          ) : (
            <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-white">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6 min-h-0">
              
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">Your Plenary Entry is Reserved!</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  A verification confirmation has been processed. Below is your official delegate entry credential.
                </p>
              </div>

              {/* VISUAL TICKET CARD */}
              <div className="relative border border-dashed border-white/10 rounded-3xl bg-[#0a0a0a] overflow-hidden divide-y divide-dashed divide-white/10 shadow-2xl print:text-black print:bg-white print:border-black">
                
                {/* Visual circle notches for classic theater-ticket cuts */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 rounded-r-full bg-[#0c0c0c] border-r border-white/10 border-y" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 rounded-l-full bg-[#0c0c0c] border-l border-white/10 border-y" />

                {/* Ticket Top: Venue Info */}
                <div className="p-6 font-medium">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[9px] font-black text-red-550 tracking-[0.2em] uppercase font-mono">Apostolic Impact Conference</span>
                      <h4 className="font-serif text-base font-black text-white uppercase mt-1 tracking-tight">DALLAS, TEXAS • 2026</h4>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white font-bold text-[10px] uppercase font-mono tracking-wider">
                      {completedRegistration.payment.ticketType} Delegate
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-5">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-black block tracking-wider">Attendee Name</span>
                      <p className="text-xs font-bold text-white mt-1 break-words">{completedRegistration.attendee.fullName}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-black block tracking-wider">Ticket Reference</span>
                      <p className="text-xs font-mono font-bold text-amber-400 mt-1 break-all">{completedRegistration.ticketNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Ticket Bottom: QR & Venue Directions */}
                <div className="p-6 flex flex-col sm:flex-row items-center gap-6">
                  {/* QR Code */}
                  <div className="w-36 h-36 bg-white p-2.5 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                    <img
                      src={completedRegistration.qrCodeUrl}
                      alt="Digital registration QR ticket"
                      className="w-32 h-32 select-none"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Directions / Arrival Details */}
                  <div className="flex-1 space-y-2 text-center sm:text-left font-medium">
                    <span className="text-[10px] text-amber-500 font-black uppercase tracking-widest block font-mono">Arrival Instructions</span>
                    <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                      <li>Present this digital ticket at the Neema Gospel Church foyer desk.</li>
                      <li>General ground registration opens: Sept 24, 2026 at 09:00 AM.</li>
                      <li>Location Address: <strong>Neema Gospel Church, Dallas, TX</strong></li>
                      <li>Participation tier: <strong>{completedRegistration.attendance.type}</strong></li>
                    </ul>
                    {completedRegistration.attendance.requestVisaLetter && (
                      <div className="p-1.5 px-2.5 bg-white/5 border border-white/10 rounded-lg text-[9.5px] text-slate-300 inline-block font-extrabold tracking-wider uppercase font-mono">
                        ℹ️ Visa application letter requested. Will process in 48 hours.
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Direct print/download coordinates */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={triggerPrint}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white text-[10px] font-extrabold uppercase tracking-widest rounded-full border border-white/10 cursor-pointer transition active:scale-97"
                >
                  <Download className="w-4 h-4" />
                  Print / Save Ticket
                </button>
                <button
                  type="button"
                  onClick={() => { resetAllForm(); onClose(); }}
                  className="w-full sm:w-auto flex items-center justify-center px-8 py-3.5 bg-white hover:bg-slate-100 text-black text-[10px] font-black uppercase tracking-[0.15em] rounded-full cursor-pointer transition active:scale-97 shadow-md"
                >
                  I'm Ready! Return to Site
                </button>
              </div>

            </motion.div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
