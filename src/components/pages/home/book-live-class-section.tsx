"use client";

import { useState } from "react";
import { ArrowRight, Play, CheckCircle2, Clock, Star, Sparkles, ShieldCheck, Zap, Users } from "lucide-react";
import home from "@/data/home.json";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { cn } from "@/lib/utils";
export function BookLiveClassSection() {
  const live = home.liveClass;
  const [showVideo, setShowVideo] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // YouTube video ID - Using a professional tech-related placeholder
  const videoId = "JKXwbbSvlu0"; 

  return (
    <Section className="relative overflow-hidden py-16 sm:py-16 bg-transparent">
      {/* ── Background Decorative Elements ── */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Top & Bottom Gradient Lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        
        {/* Glow Spheres */}
        <div className="absolute top-1/4 -left-20 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 h-96 w-96 rounded-full bg-orange-600/5 blur-[120px]" />
        
        {/* Mesh Gradient Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] blend-overlay" />
      </div>

      <Container>
        {/* ── Header Section ── */}
        <div className="flex flex-col items-center mb-12 sm:mb-16 md:mb-20 text-center px-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-6 backdrop-blur-xl transition-all hover:bg-primary/20">
            <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-primary uppercase font-sans">
              Limited Free Live Session
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-4xl leading-[1.1] tracking-tight font-heading">
            {live.title.split(' ').map((word, i) => (
              <span key={i} className={cn(word.toLowerCase() === '1%' ? 'text-primary' : '')}>
                {word}{' '}
              </span>
            ))}
          </h2>
          
          <p className="mt-6 text-sm sm:text-base md:text-lg text-white/60 max-w-2xl font-sans leading-relaxed">
            Experience our high-intensity, placement-focused learning model. 
            Join <span className="text-white font-medium">15k+ students</span> who've transformed their careers.
          </p>
        </div>

        <div className="grid gap-12 lg:gap-16 lg:grid-cols-[1.1fr_0.9fr] items-start">
          {/* ──── Left Column — Video & Stats ──── */}
          <div className="flex flex-col gap-10">
            {/* Professional Video Player UI */}
            <div className="relative group/video">
              {/* Outer glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-orange-500/20 rounded-[2rem] blur-xl opacity-0 group-hover/video:opacity-100 transition-opacity duration-700" />
              
              <div className="relative overflow-hidden border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl">
                <div className="relative aspect-video">
                  {!showVideo ? (
                    <>
                      <img
                        src="/images/adarshVideo.png"
                        alt="Live class preview"
                        className="w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover/video:scale-105"
                      />
                      {/* Interaction Overlay */}
                      <div 
                        className="absolute inset-0 flex items-center justify-center cursor-pointer group/play"
                        onClick={() => setShowVideo(true)}
                      >
                        <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-primary/90 text-white shadow-[0_0_50px_rgba(255,107,44,0.5)] transition-all duration-300 group-hover/play:scale-110 group-hover/play:bg-primary">
                          <Play className="h-6 w-6 sm:h-8 sm:w-8 fill-white ml-1.5" />
                        </div>
                        
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-semibold tracking-wider flex items-center gap-2">
                          <Zap className="h-3 w-3 text-primary animate-pulse" />
                          CLICK TO PREVIEW EXPERIENCE
                        </div>
                      </div>
                    </>
                  ) : (
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                      title="Coding Sharks Preview"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full border-0"
                    />
                  )}
                  
                  {/* Floating Tag */}
                  {/* <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 backdrop-blur-md border border-white/10 shadow-lg">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-widest">Live Workshop</span>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Stats - More Premium Design */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {live.stats.map((s, idx) => (
                <div
                  key={idx}
                  className="relative group p-6 border border-white/5 bg-white/[0.02] backdrop-blur-sm transition-all duration-500 hover:border-primary/20 hover:bg-white/[0.04]"
                >
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    {idx === 0 ? <ShieldCheck className="h-8 w-8 text-primary" /> : 
                     idx === 1 ? <Users className="h-8 w-8 text-primary" /> : 
                     <Zap className="h-8 w-8 text-primary" />}
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-white tracking-tighter mb-1 font-heading">
                    {s.value}
                  </div>
                  <div className="text-xs sm:text-sm text-white/40 font-sans uppercase tracking-widest font-semibold leading-tight">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Verification / Trust Points */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
              {[
                "Direct mentorship from IIT/NIT alumni",
                "Work on 10+ industry-standard products",
                "Advanced placements with 40 LPA+ packages",
                "Lifetime access to community sprints",
              ].map((point, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 border border-white/5 bg-white/[0.01]">
                  <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                  <span className="text-sm text-white/70 font-sans">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ──── Right Column — Form — Most Important ──── */}
          <div className="sticky top-24 lg:top-32">
            <div className="relative border border-white/10 bg-[#0a0a0a] p-8 sm:p-10 shadow-[0_48px_100px_-24px_rgba(0,0,0,0.8)] overflow-hidden">
               {/* Ambient Glow behind form */}
               <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-[80px]" />
               <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-orange-600/10 blur-[80px]" />

               {!submitted ? (
                 <>
                   <div className="relative z-10 mb-8">
                     <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-heading tracking-tight">
                       {live.form.title}
                     </h3>
                     <p className="text-sm text-white/40 flex items-center gap-2">
                       <Clock className="h-3.5 w-3.5" />
                       Fills in under 60s • Limited seats remaining
                     </p>
                   </div>

                   <form className="relative z-10 space-y-5" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                     {/* Topic Selection */}
                     <div className="space-y-2">
                       <label className="text-[11px] font-bold uppercase tracking-widest text-white/40 ml-1">
                         Curriculum Choice
                       </label>
                       <div className="relative group">
                         <select
                           required
                           defaultValue=""
                           className="w-full h-14 border border-white/10 bg-white/5 px-4 py-4 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none appearance-none transition-all cursor-pointer group-hover:border-white/20"
                         >
                           <option value="" disabled className="bg-[#111]">Select Specialization</option>
                           {live.form.programs.map((p) => (
                             <option key={p} value={p} className="bg-[#111]">{p}</option>
                           ))}
                         </select>
                         <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40 transition-transform group-hover:translate-y-[-40%]">
                           <ArrowRight className="h-4 w-4 rotate-90" />
                         </div>
                       </div>
                     </div>

                     {/* Inputs Group */}
                     <div className="grid gap-5">
                       <div className="relative">
                         <input
                           required
                           className="w-full h-14 border border-white/10 bg-white/5 px-5 text-sm text-white placeholder:text-white/20 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none"
                           placeholder="Full Name"
                         />
                       </div>
                       <div className="relative">
                         <input
                           type="email"
                           required
                           className="w-full h-14 border border-white/10 bg-white/5 px-5 text-sm text-white placeholder:text-white/20 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none"
                           placeholder="Work/Personal Email"
                         />
                       </div>
                       <div className="flex gap-3">
                         <div className="w-24 h-14 shrink-0 border border-white/10 bg-white/5 px-4 py-4 text-sm text-white flex items-center justify-between">
                            <span>🇮🇳</span>
                            <span>+91</span>
                         </div>
                         <input
                           type="tel"
                           required
                           className="flex-1 h-14 border border-white/10 bg-white/5 px-5 text-sm text-white placeholder:text-white/20 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none"
                           placeholder="WhatsApp Number"
                         />
                       </div>
                     </div>

                     {/* CTA Button */}
                     <div className="pt-4">
                       <button
                         type="submit"
                         className="group relative h-16 w-full overflow-hidden bg-primary text-base font-bold text-white shadow-[0_20px_40px_-10px_rgba(255,107,44,0.1)] transition-all active:scale-[0.98]"
                       >
                         <div className="relative z-10 flex items-center justify-center gap-3">
                           <span>{live.cta.label}</span>
                           <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                         </div>
                         {/* Glossy Overlay */}
                         <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                         {/* Shimmer Effect */}
                         <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                       </button>
                     </div>

                     {/* Trust Badge */}
                     <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-white/5">
                        <div className="flex items-center justify-between">
                           <div className="flex flex-col">
                             <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest mb-1">{live.cta.note}</p>
                             <p className="text-[10px] text-primary/80 font-medium">9.8/10 Students recommend CS</p>
                           </div>
                           <div className="flex space-x-1">
                             {[1,2,3,4,5].map(i => (
                               <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                             ))}
                           </div>
                        </div>
                     </div>
                   </form>
                 </>
               ) : (
                 <div className="relative z-10 py-12 flex flex-col items-center text-center">
                    <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                      <CheckCircle2 className="h-10 w-10 text-green-500" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-3">Booking Confirmed!</h3>
                    <p className="text-white/60 mb-8 max-w-[240px]">We've sent the session details to your email and WhatsApp.</p>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="text-primary text-sm font-semibold hover:underline"
                    >
                      Reschedule booking
                    </button>
                 </div>
               )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
