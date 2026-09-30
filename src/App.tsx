/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { CoverData } from './types';
import { INITIAL_COVER_DATA, THEMES } from './constants';
import { Header } from './components/Header';
import { CoverEditor } from './components/CoverEditor';
import { CoverPreview } from './components/CoverPreview';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Printer,
  Download,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  X,
  FileCheck,
  Eye,
  Sliders,
} from 'lucide-react';

export default function App() {
  const [data, setData] = useState<CoverData>(() => {
    const saved = localStorage.getItem('unicover_draft');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_COVER_DATA;
  });

  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [zoom, setZoom] = useState<number>(0.72);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');
  const [exportSuccessMsg, setExportSuccessMsg] = useState<string | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Auto-save draft to local storage
  useEffect(() => {
    localStorage.setItem('unicover_draft', JSON.stringify(data));
  }, [data]);

  // Auto-adjust zoom to fit screen comfortably on mount
  useEffect(() => {
    const handleResize = () => {
      if (previewContainerRef.current) {
        const containerWidth = previewContainerRef.current.clientWidth - 48;
        const containerHeight = previewContainerRef.current.clientHeight - 80;
        
        // A4 ratio: 794px width x 1123px height
        const scaleW = containerWidth / 794;
        const scaleH = containerHeight / 1123;
        const calculatedScale = Math.min(scaleW, scaleH, 0.95);
        
        if (calculatedScale > 0.3) {
          setZoom(Number(calculatedScale.toFixed(2)));
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // Download High-Resolution Image (PNG)
  const handleDownloadImage = async () => {
    if (!previewRef.current) return;
    setIsDownloading(true);

    try {
      // Small timeout to guarantee DOM fonts are settled
      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        pixelRatio: 2, // 2x for retina / sharp print quality
        quality: 0.98,
      });

      const safeSubject = (data.subjectName || 'Cover')
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, '_')
        .substring(0, 30);
      const safeCode = (data.courseCode || 'Assignment')
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, '_');

      const link = document.createElement('a');
      link.download = `${safeCode}_${safeSubject}_cover.png`;
      link.href = dataUrl;
      link.click();

      // Trigger celebratory confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });

      setExportSuccessMsg(
        lang === 'bn'
          ? 'কভার ইমেজ সফলভাবে ডাউনলোড হয়েছে!'
          : 'Cover page image downloaded successfully!'
      );
      setTimeout(() => setExportSuccessMsg(null), 4000);
    } catch (err) {
      console.error('Download error:', err);
      alert(
        lang === 'bn'
          ? 'ইমেজ ডাউনলোডে সমস্যা হয়েছে। সরাসরি প্রিন্ট বা PDF সেভ করার চেষ্টা করুন।'
          : 'Image download encountered an issue. Please use the Print / Save as PDF button.'
      );
    } finally {
      setIsDownloading(false);
    }
  };

  // Reset to default FCUB Demo
  const handleResetDemo = () => {
    if (
      window.confirm(
        lang === 'bn'
          ? 'আপনি কি নিশ্চিত যে এফসিইউবি (THE GARDEN PARTY) এর মূল ডেমো ডেটা রিস্টোর করতে চান?'
          : 'Are you sure you want to restore the default FCUB demo?'
      )
    ) {
      setData(INITIAL_COVER_DATA);
      setExportSuccessMsg(
        lang === 'bn' ? 'মূল ডেমো ডেটা রিস্টোর হয়েছে!' : 'Restored to FCUB Demo!'
      );
      setTimeout(() => setExportSuccessMsg(null), 3000);
    }
  };

  const currentTheme = THEMES.find((t) => t.id === data.themeId) || THEMES[0];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Top Bar Contract (1-row, 3-zone) */}
      <Header
        onPrint={handlePrint}
        onDownloadImage={handleDownloadImage}
        onResetDemo={handleResetDemo}
        isDownloading={isDownloading}
        lang={lang}
        onToggleLang={() => setLang(lang === 'bn' ? 'en' : 'bn')}
        activeThemeName={lang === 'bn' ? currentTheme.nameBn : currentTheme.name}
      />

      {/* Success Notification Banner */}
      {exportSuccessMsg && (
        <div className="no-print bg-emerald-600 text-white text-xs py-2 px-4 flex items-center justify-center gap-2 font-medium shadow-sm transition-all animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{exportSuccessMsg}</span>
        </div>
      )}

      {/* Mobile Tab Switcher */}
      <div className="no-print md:hidden flex border-b border-neutral-800 bg-neutral-900 p-1">
        <button
          onClick={() => setMobileTab('edit')}
          className={`flex-1 py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 ${
            mobileTab === 'edit'
              ? 'bg-neutral-800 text-white shadow-sm'
              : 'text-neutral-400'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? 'তথ্য সম্পাদনা' : 'Edit Info'}</span>
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 ${
            mobileTab === 'preview'
              ? 'bg-neutral-800 text-white shadow-sm'
              : 'text-neutral-400'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? 'কভার প্রিভিউ' : 'Live Preview'}</span>
        </button>
      </div>

      {/* Main Workspace Layout */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left Side: Customization Form & Options */}
        <section
          className={`no-print w-full md:w-[460px] lg:w-[500px] xl:w-[520px] p-3 md:p-4 border-r border-neutral-800/80 bg-neutral-950 flex flex-col shrink-0 overflow-hidden ${
            mobileTab === 'preview' ? 'hidden md:flex' : 'flex'
          }`}
        >
          <CoverEditor data={data} onChange={setData} lang={lang} />
        </section>

        {/* Right Side: A4 Live Canvas Viewport */}
        <section
          ref={previewContainerRef}
          className={`flex-1 bg-neutral-900/90 relative flex flex-col items-center overflow-auto p-4 md:p-6 select-none ${
            mobileTab === 'edit' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Floating Canvas Toolbar */}
          <div className="no-print mb-4 sticky top-0 z-20 bg-neutral-950/90 backdrop-blur-md border border-neutral-800 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-3 text-xs">
            <span className="text-neutral-400 font-medium hidden sm:inline-block">
              {lang === 'bn' ? 'থিম:' : 'Theme:'}{' '}
              <strong className="text-emerald-400">
                {lang === 'bn' ? currentTheme.nameBn : currentTheme.name}
              </strong>
            </span>

            <div className="h-3 w-px bg-neutral-800 hidden sm:block" />

            {/* Zoom Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setZoom((z) => Math.max(0.4, Number((z - 0.05).toFixed(2))))}
                className="p-1 rounded hover:bg-neutral-800 text-neutral-300 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] text-neutral-400 w-10 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom((z) => Math.min(1.2, Number((z + 0.05).toFixed(2))))}
                className="p-1 rounded hover:bg-neutral-800 text-neutral-300 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(0.72)}
                className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
                title="Reset Zoom"
              >
                <Maximize2 className="w-3 h-3" />
              </button>
            </div>

            <div className="h-3 w-px bg-neutral-800" />

            {/* Print Help Guide Modal Trigger */}
            <button
              onClick={() => setShowPrintModal(true)}
              className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-emerald-400 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {lang === 'bn' ? 'প্রিন্ট টিপস' : 'Print Tips'}
              </span>
            </button>
          </div>

          {/* Canvas Wrapper */}
          <div
            className="flex justify-center items-start w-full transition-all"
            style={{ minHeight: `${1123 * zoom + 40}px` }}
          >
            <CoverPreview ref={previewRef} data={data} scale={zoom} />
          </div>
        </section>
      </main>

      {/* Print Instructions Modal */}
      {showPrintModal && (
        <div className="no-print fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 text-neutral-200 shadow-2xl relative">
            <button
              onClick={() => setShowPrintModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3 text-emerald-400">
              <FileCheck className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">
                {lang === 'bn' ? 'পারফেক্ট A4 প্রিন্ট ও PDF গাইড' : 'Perfect A4 Print & PDF Guide'}
              </h3>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed mb-4">
              {lang === 'bn'
                ? 'ব্রাউজারের প্রিন্ট ডায়ালগ দিয়ে এক ক্লিকে ১০০% ভেক্টর কোয়ালিটিতে সম্পূর্ণ পেজ বর্ডারলেস প্রিন্ট বা PDF সেভ করার জন্য নিচের সেটিংসগুলো চেক করুন:'
                : 'For 100% crisp vector print or PDF export without blank pages or cutoff borders, verify these browser print settings:'}
            </p>

            <ul className="space-y-2.5 text-xs bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 mb-5">
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-400">1.</span>
                <span>
                  <strong>Destination:</strong> Save as PDF{' '}
                  <span className="text-neutral-500">
                    ({lang === 'bn' ? 'বা আপনার প্রিন্টার সিলেক্ট করুন' : 'or select your physical printer'})
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-400">2.</span>
                <span>
                  <strong>Paper Size:</strong> A4{' '}
                  <span className="text-neutral-500">(210 × 297 mm)</span>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-400">3.</span>
                <span>
                  <strong>Margins:</strong> None{' '}
                  <span className="text-neutral-500">
                    ({lang === 'bn' ? 'মার্জিন None রাখলে বর্ডার একদম নিখুঁত আসবে' : 'ensures exact edge ribbons'})
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-400">4.</span>
                <span>
                  <strong>Background graphics:</strong>{' '}
                  <span className="text-emerald-400 font-semibold">Checked / On ✓</span>{' '}
                  <span className="text-neutral-500">
                    ({lang === 'bn' ? 'ফিতা ও কালার ব্যাকগ্রাউন্ড প্রিন্ট হওয়ার জন্য আবশ্যক' : 'required for ribbons'})
                  </span>
                </span>
              </li>
            </ul>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowPrintModal(false);
                  handlePrint();
                }}
                className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'এখনই প্রিন্ট করুন' : 'Print Now'}</span>
              </button>
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium text-xs transition-colors"
              >
                {lang === 'bn' ? 'বুঝেছি' : 'Got it'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
