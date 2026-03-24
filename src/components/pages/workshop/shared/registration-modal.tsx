'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { X, CheckCircle2, Loader2, ChevronRight, ArrowLeft } from 'lucide-react';
import { fetchCrmCourses, submitLeadToCrm } from '@/lib/crm-api';
import { useCountdown } from '../hooks';
import type { WorkshopJson } from '../types';
import mediaData from '@/data/media.json';

type WorkshopMedia = typeof mediaData.workshops[keyof typeof mediaData.workshops];

interface Props {
  workshop: WorkshopJson;
  onClose: () => void;
}

export function RegistrationModal({ workshop, onClose }: Props) {
  const primary = workshop.page_primary_color || '#ea580c';
  const media = (mediaData.workshops as Record<string, WorkshopMedia>)[workshop.slug] ?? null;
  const instructorImg = media?.instructor ?? '';
  const countdown = useCountdown(workshop.event_date, workshop.event_time);
  const priceOriginal = workshop.price_original;
  const backdropRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [experience, setExperience] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [crmCourseId, setCrmCourseId] = useState('');

  useEffect(() => {
    fetchCrmCourses('workshop').then((courses) => {
      const match = courses.find((c) => c.name.toLowerCase() === workshop.crm_workshop_name.toLowerCase());
      if (match) setCrmCourseId(match.id);
    });
  }, [workshop.crm_workshop_name]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  function validateStep1() {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = 'Please enter your full name';
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 10) e.phone = 'Enter a valid 10-digit mobile number';
    return e;
  }

  function validateStep2() {
    const e: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address';
    return e;
  }

  async function handleNext() {
    if (step === 1) {
      const e = validateStep1();
      if (Object.keys(e).length) { setErrors(e); return; }
      setErrors({});
      setStep(2);
    } else if (step === 2) {
      const e = validateStep2();
      if (Object.keys(e).length) { setErrors(e); return; }
      setErrors({});
      setSubmitError('');
      setIsSubmitting(true);
      const mobile = phone.replace(/\D/g, '').slice(-10);
      const result = await submitLeadToCrm({ name, email, mobile, courseInterest: crmCourseId || undefined });
      setIsSubmitting(false);
      if (result.success) { setStep(3); }
      else setSubmitError(result.error ?? 'Registration failed. Please try again.');
    }
  }

  function handleBack() {
    setErrors({});
    if (step === 2) setStep(1);
  }

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden" style={{ maxHeight: '92vh' }}>
        {/* Close */}
        <button onClick={onClose} className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-gray-100 transition-colors">
          <X className="w-4 h-4 text-gray-600" />
        </button>

        {/* Colored header */}
        <div className="px-6 pt-6 pb-4 text-center" style={{ background: `linear-gradient(135deg, ${primary} 0%, ${primary}cc 100%)` }}>
          <div className="flex items-center justify-center gap-3 mb-3">
            {instructorImg ? (
              <div className="w-12 h-12 rounded-full overflow-hidden relative border-2 border-white/50 shrink-0">
                <Image src={instructorImg} alt={workshop.instructor_name ?? ''} fill className="object-cover" sizes="48px" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <span className="text-white text-xl font-bold">{workshop.instructor_name?.[0]}</span>
              </div>
            )}
            <div className="text-left">
              <p className="text-white font-extrabold text-sm leading-tight">{workshop.title}</p>
              {workshop.instructor_name && <p className="text-white/75 text-xs">with {workshop.instructor_name}</p>}
            </div>
          </div>

          {/* Countdown */}
          <div className="bg-black/20 rounded-xl px-4 py-2 inline-flex items-center gap-3">
            {([{ l: 'D', v: countdown.days }, { l: 'H', v: countdown.hours }, { l: 'M', v: countdown.minutes }, { l: 'S', v: countdown.seconds }] as const).map((item, i) => (
              <div key={item.l} className="flex items-center gap-3">
                <div className="text-center">
                  <span className="text-white font-extrabold text-lg leading-none block">{pad(item.v)}</span>
                  <span className="text-white/60 text-[9px] uppercase">{item.l}</span>
                </div>
                {i < 3 && <span className="text-white/50 font-bold">:</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Progress steps */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
          {([1, 2, 3] as const).map((s) => (
            <div key={s} className="flex items-center gap-3 flex-1">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 transition-all"
                style={{ backgroundColor: step >= s ? primary : '#e5e7eb', color: step >= s ? 'white' : '#9ca3af' }}>
                {step > s ? '✓' : s}
              </div>
              <span className="text-xs font-medium hidden sm:block" style={{ color: step >= s ? primary : '#9ca3af' }}>
                {s === 1 ? 'Your Info' : s === 2 ? 'Contact' : 'Done!'}
              </span>
              {s < 3 && <div className="h-0.5 flex-1 rounded transition-all" style={{ backgroundColor: step > s ? primary : '#e5e7eb' }} />}
            </div>
          ))}
        </div>

        {/* Price pill */}
        {priceOriginal && (
          <div className="px-6 py-2 border-b flex items-center justify-center gap-2" style={{ backgroundColor: `${primary}10`, borderColor: `${primary}25` }}>
            <span className="text-gray-400 line-through text-sm">{priceOriginal}</span>
            <span className="font-extrabold text-lg" style={{ color: primary }}>{workshop.price}</span>
            <span className="text-xs font-bold text-gray-500">only · Limited seats</span>
          </div>
        )}

        {/* Step content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: '40vh' }}>
          {step === 1 && (
            <div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-1">Claim Your Spot</h3>
              <p className="text-sm text-gray-500 mb-5">Join <strong>15,000+</strong> students already enrolled at CodingShark.</p>
              <div className="space-y-4">
                <div>
                  <input type="text" placeholder="Your Full Name *" value={name} onChange={(e) => setName(e.target.value)}
                    className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-colors bg-white ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-gray-400'}`} />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">+91</span>
                    <input type="tel" placeholder="10-digit mobile number *" value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className={`w-full border rounded-xl pl-12 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-colors bg-white ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-gray-400'}`} />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-1">Almost There!</h3>
              <p className="text-sm text-gray-500 mb-5">We&apos;ll send your access details to your email.</p>
              <div className="space-y-4">
                <div>
                  <input type="email" placeholder="Your Email Address *" value={email} onChange={(e) => setEmail(e.target.value)}
                    className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-colors bg-white ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-gray-400'}`} />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <select value={experience} onChange={(e) => setExperience(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors bg-white">
                    <option value="">Your Experience Level (Optional)</option>
                    <option value="beginner">Complete Beginner</option>
                    <option value="some">Some Coding Experience</option>
                    <option value="intermediate">Intermediate Developer</option>
                    <option value="advanced">Advanced / Working Professional</option>
                  </select>
                </div>
                {submitError && <p className="text-red-500 text-xs text-center bg-red-50 rounded-lg p-2">{submitError}</p>}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: `${primary}15` }}>
                <CheckCircle2 className="w-10 h-10" style={{ color: primary }} />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">You&apos;re Enrolled!</h3>
              <p className="text-sm text-gray-500 mb-4">Check your WhatsApp and email for access details. Welcome to CodingShark!</p>
              <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">What happens next?</p>
                {['Check your email for login credentials', 'Join our WhatsApp community for live support', 'Start with Module 1 — available immediately'].map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center shrink-0" style={{ backgroundColor: primary }}>{i + 1}</span>
                    <span className="text-xs text-gray-600">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {step < 3 && (
          <div className="px-6 pb-6 pt-2 flex items-center gap-3">
            {step === 2 && (
              <button onClick={handleBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
            <button onClick={handleNext} disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-extrabold uppercase tracking-widest text-white text-sm shadow-lg hover:opacity-90 disabled:opacity-60 transition-opacity"
              style={{ backgroundColor: primary }}>
              {isSubmitting
                ? <><Loader2 className="w-4 h-4 animate-spin" />Processing...</>
                : step === 1
                  ? <><span>Continue</span><ChevronRight className="w-4 h-4" /></>
                  : <><span>Reserve My Seat</span><ChevronRight className="w-4 h-4" /></>
              }
            </button>
          </div>
        )}
        {step === 3 && (
          <div className="px-6 pb-6">
            <button onClick={onClose} className="w-full py-3 rounded-xl font-bold text-sm transition-colors" style={{ backgroundColor: `${primary}15`, color: primary }}>
              Close &amp; Start Learning →
            </button>
          </div>
        )}

        <p className="text-[10px] text-center text-gray-400 pb-4 px-6">By enrolling you agree to CodingShark&apos;s terms. Your info is 100% secure.</p>
      </div>
    </div>
  );
}
