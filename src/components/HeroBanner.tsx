/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Award, CheckCircle2, Star, TrendingUp, Users, ShieldAlert, FileText, ArrowUpRight } from "lucide-react";

interface HeroBannerProps {
  language: "en" | "hi";
  onExploreClick: () => void;
  onContactClick: () => void;
}

export default function HeroBanner({ language, onExploreClick, onContactClick }: HeroBannerProps) {
  const [slideIndex, setSlideIndex] = useState(0);

  const slides = [
    {
      title: language === "en" ? "Where Trust Meets Superior Quality" : "जहां विश्वास और श्रेष्ठ गुणवत्ता का संगम होता है",
      subtitle: language === "en" ? "India's Premiere Notebook & Stationery Manufacturer" : "भारत के अग्रणी नोटबुक और स्टेशनरी निर्माता",
      description: language === "en" 
        ? "We manufacture, wholesale, and distribute world-class notebooks, drawing books, registers, and specialized exam copies with state-of-the-art binding and custom cover designs."
        : "हम अत्याधुनिक बाइंडिंग और कस्टम कवर डिज़ाइनों के साथ विश्व स्तरीय नोटबुक, ड्राइंग बुक, रजिस्टर और विशेष परीक्षा प्रतियां तैयार और वितरित करते हैं।",
      badge: language === "en" ? "★ ISO 9001:2015 CERTIFIED" : "★ आईएसओ 9001:2015 प्रमाणित",
      bgGradient: "from-blue-900 via-indigo-950 to-slate-950",
      bgImage: "https://raw.githubusercontent.com/shrishivnterprises/shrishiventerprises-website/main/images/shivangi-warehouse.jpg",
    },
    {
      title: language === "en" ? "Eco-Friendly 90 GSM Luxury Paper" : "पर्यावरण-अनुकूल 90 जीएसएम शानदार कागज",
      subtitle: language === "en" ? "Unmatched Smoothness & Ink-Resistant Scribing" : "अतुलनीय चिकनाई और स्याही-प्रतिरोधी लेखन",
      description: language === "en" 
        ? "Crafted from ethically sourced pulp, our stationery features zero smudge, crisp ruling, and micro-perforated edges for high-performance school and corporate usage."
        : "नैतिक रूप से प्राप्त पल्प से निर्मित, हमारी स्टेशनरी में शून्य धब्बा, स्पष्ट रूलिंग और स्कूल और कॉर्पोरेट उपयोग के लिए माइक्रो-छिद्रित किनारे हैं।",
      badge: language === "en" ? "🌿 100% ECO-FRIENDLY & RECYCLABLE" : "🌿 100% पर्यावरण-अनुकूल और पुनर्चक्रण योग्य",
      bgGradient: "from-slate-900 via-blue-950 to-brand-blue",
      bgImage: "https://raw.githubusercontent.com/shrishivnterprises/shrishiventerprises-website/main/images/promo-notebooks.jpg",
    },
    {
      title: language === "en" ? "Distributor & Dealer Network" : "वितरक और डीलर नेटवर्क",
      subtitle: language === "en" ? "Grow Your Enterprise with Shri Shiv Trust" : "श्री शिव ट्रस्ट के साथ अपना व्यवसाय बढ़ाएं",
      description: language === "en" 
        ? "Join India's largest supply chain. Register as an authorized dealer today and get instant quotation access, priority dispatches, and unmatched wholesale discounts."
        : "भारत की सबसे बड़ी आपूर्ति श्रृंखला में शामिल हों। आज ही एक अधिकृत डीलर के रूप में पंजीकरण करें और तत्काल कोटेशन, प्राथमिकता प्रेषण और थोक छूट प्राप्त करें।",
      badge: language === "en" ? "🤝 PARTNER WITH LEADERS" : "🤝 लीडर्स के साथ साझेदारी करें",
      bgGradient: "from-slate-950 via-slate-900 to-indigo-950",
      bgImage: "https://raw.githubusercontent.com/shrishivnterprises/shrishiventerprises-website/main/images/promo-bulk-offer.jpg",
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [slides.length]);

  const stats = [
    { value: "35+", label: language === "en" ? "Years of Excellence" : "वर्षों की उत्कृष्टता", icon: Award },
    { value: "15M+", label: language === "en" ? "Monthly Notebook Capacity" : "मासिक नोटबुक क्षमता", icon: BookOpen },
    { value: "8,500+", label: language === "en" ? "Retail Partners" : "खुदरा भागीदार", icon: Users },
    { value: "28+", label: language === "en" ? "Indian States Served" : "भारतीय राज्य", icon: TrendingUp }
  ];

  return (
    <section className="relative overflow-hidden mb-12">
      {/* Slideshow Area */}
      <div className="relative h-[480px] md:h-[550px] w-full rounded-2xl overflow-hidden shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={slideIndex}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 text-white flex flex-col justify-center px-6 md:px-16 py-12 bg-slate-950"
          >
            {/* Background image with overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
              style={{ backgroundImage: `url(${slides[slideIndex].bgImage})` }}
              referrerPolicy="no-referrer"
            />
            
            {/* Elegant Ambient Background Particles */}
            <div className={`absolute inset-0 opacity-80 bg-gradient-to-r ${slides[slideIndex].bgGradient} mix-blend-multiply`}></div>
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-indigo-200 to-slate-900 animate-pulse-grad"></div>
            
            <div className="relative z-10 max-w-2xl">
              {/* Badge */}
              <motion.span
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block text-[11px] font-mono font-semibold tracking-widest bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-blue-200 mb-4"
              >
                {slides[slideIndex].badge}
              </motion.span>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="font-display font-bold text-3xl md:text-5xl leading-tight mb-2 tracking-tight text-white text-glow-blue"
              >
                {slides[slideIndex].title}
              </motion.h2>

              {/* Subtitle */}
              <motion.h3
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl font-display font-medium text-blue-100 mb-4"
              >
                {slides[slideIndex].subtitle}
              </motion.h3>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-slate-300 text-sm md:text-base mb-8 leading-relaxed font-light"
              >
                {slides[slideIndex].description}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <button
                  onClick={onExploreClick}
                  className="px-6 py-3 bg-white text-brand-blue font-display font-semibold rounded-xl text-sm shadow-lg hover:bg-slate-100 transition flex items-center space-x-2 border border-white"
                  id="btn-hero-explore"
                >
                  <span>{language === "en" ? "Explore Catalog" : "कैटलॉग देखें"}</span>
                  <BookOpen className="h-4 w-4" />
                </button>
                <button
                  onClick={onContactClick}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-display font-medium rounded-xl text-sm backdrop-blur-md transition flex items-center space-x-2 border border-white/15"
                  id="btn-hero-contact"
                >
                  <span>{language === "en" ? "Request Quotation" : "कोटेशन का अनुरोध करें"}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 right-6 flex space-x-2 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSlideIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                slideIndex === idx ? "w-8 bg-white" : "w-2 bg-white/40"
              }`}
              title={`Slide ${idx + 1}`}
            ></button>
          ))}
        </div>
      </div>

      {/* Trust & Company Introduction Row */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center px-2">
        <div className="md:col-span-7">
          <div className="flex items-center space-x-2 text-brand-blue font-mono text-xs font-bold uppercase tracking-wider mb-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>{language === "en" ? "Industry Pioneer Since 1991" : "1991 से उद्योग में अग्रणी"}</span>
          </div>
          <h3 className="font-display font-bold text-2xl md:text-3xl text-slate-900 dark:text-white mb-4 tracking-tight">
            {language === "en" ? "The Gold Standard in Indian Stationery Manufacturing" : "भारतीय स्टेशनरी निर्माण में स्वर्ण मानक"}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
            {language === "en"
              ? "Shri Shiv Enterprises represents trust, durability, and visual delight. With a massive zero-emission manufacturing campus housing advanced automatic high-speed disc binding machinery, we produce millions of premium long books, registers, and custom examination copies every month for schools, central boards, colleges, and corporate partners across India."
              : "श्री शिव एंटरप्राइजेज विश्वास, स्थायित्व और दृश्य आनंद का प्रतिनिधित्व करता है। उन्नत स्वचालित हाई-स्पीड डिस्क बाइंडिंग मशीनरी से युक्त एक विशाल शून्य-उत्सर्जन विनिर्माण परिसर के साथ, हम पूरे भारत में स्कूलों, केंद्रीय बोर्डों, कॉलेजों और कॉर्पोरेट भागीदारों के लिए हर महीने लाखों प्रीमियम लॉन्ग बुक, रजिस्टर और कस्टम परीक्षा प्रतियां तैयार करते हैं।"}
          </p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex items-start space-x-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-display font-semibold text-xs text-slate-800 dark:text-slate-200">{language === "en" ? "High GSM Maplitho" : "उच्च जीएसएम मैपलिथो"}</h4>
                <p className="text-[11px] text-slate-400">{language === "en" ? "Pure wood-free super white paper" : "शुद्ध लकड़ी-मुक्त सुपर सफेद कागज"}</p>
              </div>
            </div>
            <div className="flex items-start space-x-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-display font-semibold text-xs text-slate-800 dark:text-slate-200">{language === "en" ? "Laser-Accurate Ruling" : "लेजर-सटीक रूलिंग"}</h4>
                <p className="text-[11px] text-slate-400">{language === "en" ? "Standard margins & crisp micro lineation" : "मानक मार्जिन और स्पष्ट लाइनेशन"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="md:col-span-5 grid grid-cols-2 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl glass-light dark:glass-dark border border-slate-200/40 dark:border-slate-800/60 shadow-lg flex flex-col justify-between hover:scale-[1.03] transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <stat.icon className="h-5 w-5 text-brand-blue" />
                <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">ACTIVE</span>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white leading-none tracking-tight mb-1">{stat.value}</div>
                <div className="text-[11px] text-slate-400 leading-snug">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
