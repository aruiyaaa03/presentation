import React from 'react';
import { Printer, Download, Sparkles, Languages, Check, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onPrint: () => void;
  onDownloadImage: () => void;
  onResetDemo: () => void;
  isDownloading: boolean;
  lang: 'bn' | 'en';
  onToggleLang: () => void;
  activeThemeName: string;
}

export const Header: React.FC<HeaderProps> = ({
  onPrint,
  onDownloadImage,
  onResetDemo,
  isDownloading,
  lang,
  onToggleLang,
}) => {
  return (
    <header className="no-print bg-neutral-950 border-b border-neutral-800/80 px-4 md:px-6 py-3 flex items-center justify-between z-30 shrink-0">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <a href="/" className="text-base md:text-lg font-bold tracking-tight text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          UniCover Studio
        </a>
        <span className="hidden sm:inline-block text-xs text-neutral-400 border-l border-neutral-800 pl-3">
          {lang === 'bn' ? 'অ্যাসাইনমেন্ট ও প্রেজেন্টেশন কভার পেজ' : 'Academic Cover Page Studio'}
        </span>
      </div>

      {/* Zone 2: Clean navigation/info links */}
      <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-neutral-400">
        <button
          onClick={onResetDemo}
          className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className="w-3 h-3 text-emerald-400" />
          <span>{lang === 'bn' ? 'এফসিইউবি ডেমো রিস্টোর' : 'Reset FCUB Demo'}</span>
        </button>
        <span className="text-neutral-600">·</span>
        <span className="text-neutral-400">
          A4 Portrait (210×297mm)
        </span>
        <span className="text-neutral-600">·</span>
        <span className="text-neutral-400">
          Vector Print Ready
        </span>
      </nav>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language switch button */}
        <button
          onClick={onToggleLang}
          title={lang === 'bn' ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
          className="px-2.5 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
        >
          <Languages className="w-3.5 h-3.5 text-neutral-400" />
          <span className="font-semibold">{lang === 'bn' ? 'বাংলা' : 'EN'}</span>
        </button>

        {/* Download Image Button */}
        <button
          onClick={onDownloadImage}
          disabled={isDownloading}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-medium transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-neutral-400" />
          <span>{isDownloading ? (lang === 'bn' ? 'তৈরি হচ্ছে...' : 'Exporting...') : 'Download PNG'}</span>
        </button>

        {/* Primary Action: Print / PDF */}
        <button
          onClick={onPrint}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all whitespace-nowrap"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? 'প্রিন্ট / PDF সেভ করুন' : 'Print / Save as PDF'}</span>
        </button>
      </div>
    </header>
  );
};
