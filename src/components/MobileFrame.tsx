/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Laptop, Phone, Smartphone, Wifi, Battery, ShieldCheck } from "lucide-react";

interface MobileFrameProps {
  children: React.ReactNode;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  language: "en" | "hi";
  setLanguage: (lang: "en" | "hi") => void;
}

export default function MobileFrame({
  children,
  isDarkMode,
  setIsDarkMode,
  language,
  setLanguage,
}: MobileFrameProps) {
  const [viewMode, setViewMode] = useState<"mobile" | "web">("mobile");

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"}`}>
      {/* Platform Meta-Header Controls */}
      <header className={`sticky top-0 z-50 px-6 py-3 border-b backdrop-blur-md flex items-center justify-between ${
        isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"
      }`}>
        <div className="flex items-center space-x-3">
          <img 
            src="https://raw.githubusercontent.com/shrishivnterprises/shrishiventerprises-website/main/images/shiv-logo.jpg" 
            alt="Shri Shiv Logo" 
            className="h-8 w-8 rounded-lg object-cover shadow-md border border-slate-200 dark:border-slate-800" 
            referrerPolicy="no-referrer"
          />
          <div>
            <h1 className="font-display font-bold tracking-tight text-sm md:text-base">Shri Shiv Enterprises</h1>
            <p className="text-[10px] text-slate-400 font-mono">APP EXPERIENCE LABORATORY</p>
          </div>
        </div>

        {/* Multi-Device and System Settings */}
        <div className="flex items-center space-x-4">
          {/* View Switchers */}
          <div className={`flex rounded-full p-1 border text-xs font-medium ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-100 border-slate-200"}`}>
            <button
              onClick={() => setViewMode("mobile")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition ${
                viewMode === "mobile"
                  ? "bg-brand-blue text-white shadow-sm"
                  : isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-black"
              }`}
              id="btn-view-mobile"
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Mobile Preview</span>
            </button>
            <button
              onClick={() => setViewMode("web")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition ${
                viewMode === "web"
                  ? "bg-brand-blue text-white shadow-sm"
                  : isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-black"
              }`}
              id="btn-view-web"
            >
              <Laptop className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Responsive Web</span>
            </button>
          </div>

          {/* Quick Config Toggles */}
          <div className="flex items-center space-x-2">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
              className={`text-xs px-2.5 py-1.5 rounded-md border font-display transition ${
                isDarkMode ? "border-slate-800 hover:bg-slate-800 text-slate-300" : "border-slate-200 hover:bg-slate-100 text-slate-700"
              }`}
              id="btn-lang-toggle"
            >
              {language === "en" ? "Hindi (हिंदी)" : "English (EN)"}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`text-xs px-2.5 py-1.5 rounded-md border font-display transition ${
                isDarkMode ? "border-slate-800 hover:bg-slate-800 text-slate-300" : "border-slate-200 hover:bg-slate-100 text-slate-700"
              }`}
              id="btn-theme-toggle"
            >
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex justify-center items-center py-6 px-4 md:py-10">
        {viewMode === "mobile" ? (
          /* Mobile Frame Container */
          <div className="relative mx-auto w-full max-w-[410px] h-[850px] rounded-[55px] border-[12px] border-slate-900 shadow-2xl transition-all duration-300 bg-slate-950 overflow-hidden ring-4 ring-brand-blue/10">
            {/* iPhone Top Ear Speaker and Sensor bar (Notch / Dynamic Island) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-slate-900 rounded-b-2xl z-50 flex items-center justify-between px-4">
              <div className="h-2 w-2 rounded-full bg-slate-800"></div>
              <div className="h-1.5 w-14 rounded-full bg-slate-800"></div>
              <div className="h-2 w-2 rounded-full bg-blue-900"></div>
            </div>

            {/* Mobile Status Bar */}
            <div className={`absolute top-0 left-0 right-0 h-11 px-8 pt-2.5 flex items-center justify-between text-[11px] font-semibold z-40 ${
              isDarkMode ? "text-slate-300" : "text-slate-800"
            }`}>
              <span className="font-mono">10:45 AM</span>
              <div className="flex items-center space-x-1.5">
                <Wifi className="h-3 w-3" />
                <span className="text-[9px]">5G</span>
                <Battery className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Inner Mobile Screen Content */}
            <div className={`w-full h-full pt-11 pb-8 overflow-y-auto ${isDarkMode ? "bg-slate-900 text-slate-100" : "bg-white text-slate-800"}`}>
              {children}
            </div>

            {/* Apple Home Indicator */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-900/60 dark:bg-white/40 rounded-full z-40"></div>
          </div>
        ) : (
          /* Web Full Responsive Container */
          <div className={`w-full max-w-7xl mx-auto rounded-3xl border shadow-xl overflow-hidden min-h-[750px] transition-all duration-300 ${
            isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
          }`}>
            <div className={`px-4 py-2 border-b flex items-center space-x-2 ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-100 border-slate-200"}`}>
              <div className="flex space-x-1.5">
                <span className="h-3 w-3 rounded-full bg-red-400"></span>
                <span className="h-3 w-3 rounded-full bg-amber-400"></span>
                <span className="h-3 w-3 rounded-full bg-green-400"></span>
              </div>
              <div className={`flex-1 max-w-md mx-auto text-center py-1 rounded-md text-xs font-mono transition ${
                isDarkMode ? "bg-slate-900 text-slate-400 border border-slate-800" : "bg-white text-slate-500 border border-slate-200"
              }`}>
                https://shrishiventerprises.in/app-portal
              </div>
            </div>
            <div className="w-full">
              {children}
            </div>
          </div>
        )}
      </main>

      {/* Floating Certificate / Security Banner */}
      <footer className="py-6 text-center text-xs text-slate-400 font-display border-t border-slate-200/20">
        <div className="flex items-center justify-center space-x-1.5 mb-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span className="font-semibold text-slate-500">100% Secure SSL Enterprise Sandbox</span>
        </div>
        <div>Shri Shiv Enterprises © 2026. All Rights Reserved.</div>
      </footer>
    </div>
  );
}
