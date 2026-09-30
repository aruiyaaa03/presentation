import React, { useRef, useState } from 'react';
import {
  AssignmentType,
  CoverData,
  StudentInfo,
  SubmissionStyleMode,
  ThemeId,
} from '../types';
import { FONT_OPTIONS, PRESET_UNIVERSITIES, THEMES } from '../constants';
import {
  Upload,
  Link as LinkIcon,
  Palette,
  Type,
  Sparkles,
  Users,
  User,
  GraduationCap,
  Calendar,
  Layers,
  Image as ImageIcon,
  RotateCcw,
  Plus,
  Trash2,
  ChevronDown,
  Info,
} from 'lucide-react';

interface CoverEditorProps {
  data: CoverData;
  onChange: (data: CoverData) => void;
  lang: 'bn' | 'en';
}

export const CoverEditor: React.FC<CoverEditorProps> = ({
  data,
  onChange,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'theme' | 'submission' | 'style'>('content');
  const [logoInputType, setLogoInputType] = useState<'upload' | 'url' | 'presets'>('upload');
  const [logoUrlTemp, setLogoUrlTemp] = useState(data.logoUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = {
    content: lang === 'bn' ? 'বিষয়বস্তু ও তথ্য' : 'Content & Subject',
    theme: lang === 'bn' ? 'থিম ও ডিজাইন' : 'Themes & Layout',
    submission: lang === 'bn' ? 'সাবমিশন ও স্টুডেন্ট' : 'Submission Details',
    style: lang === 'bn' ? 'রং ও ফন্ট' : 'Colors & Fonts',
    presets: lang === 'bn' ? 'কুইক প্রিসেট (ভার্সিটি)' : 'Quick Presets',
  };

  const updateField = <K extends keyof CoverData>(key: K, value: CoverData[K]) => {
    onChange({
      ...data,
      [key]: value,
    });
  };

  // Handle Logo Upload from Local Computer / Mobile
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(lang === 'bn' ? 'ছবির সাইজ ৫MB এর কম হতে হবে।' : 'Image size must be under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateField('logoUrl', event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Group Member Add
  const handleAddStudent = () => {
    const newStudent: StudentInfo = {
      id: Date.now().toString(),
      name: '',
      studentId: '',
      department: data.departmentName,
      semester: '',
      section: '',
    };
    updateField('submittedBy', [...data.submittedBy, newStudent]);
  };

  // Handle Group Member Update
  const handleUpdateStudent = (index: number, field: keyof StudentInfo, value: string) => {
    const updated = [...data.submittedBy];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    updateField('submittedBy', updated);
  };

  // Handle Group Member Remove
  const handleRemoveStudent = (index: number) => {
    if (data.submittedBy.length <= 1) return;
    const updated = data.submittedBy.filter((_, i) => i !== index);
    updateField('submittedBy', updated);
  };

  // Apply a Preset University
  const applyPreset = (presetId: string) => {
    const preset = PRESET_UNIVERSITIES.find((p) => p.id === presetId);
    if (!preset) return;

    onChange({
      ...data,
      universityName: preset.name,
      departmentName: preset.department,
      courseCode: preset.courseCode,
      subjectName: preset.subjectName,
      logoUrl: preset.logoUrl,
      primaryColor: preset.primaryColor,
      accentColor: preset.accentColor,
      themeId: preset.themeId,
      assignmentType: preset.assignmentType,
    });
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl flex flex-col h-full overflow-hidden text-neutral-200">
      {/* Tab Navigation */}
      <div className="flex border-b border-neutral-800 bg-neutral-950/70 p-1.5 gap-1 shrink-0 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'content'
              ? 'bg-neutral-800 text-white shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t.content}</span>
        </button>

        <button
          onClick={() => setActiveTab('theme')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'theme'
              ? 'bg-neutral-800 text-white shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span>{t.theme}</span>
        </button>

        <button
          onClick={() => setActiveTab('submission')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'submission'
              ? 'bg-neutral-800 text-white shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-amber-400" />
          <span>{t.submission}</span>
        </button>

        <button
          onClick={() => setActiveTab('style')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'style'
              ? 'bg-neutral-800 text-white shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
          }`}
        >
          <Palette className="w-3.5 h-3.5 text-purple-400" />
          <span>{t.style}</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
        {/* ======================= TAB 1: CONTENT ======================= */}
        {activeTab === 'content' && (
          <div className="space-y-4">
            {/* Quick Preset Selector */}
            <div className="p-3 bg-neutral-950/60 border border-neutral-800 rounded-lg">
              <label className="text-[11px] font-semibold text-neutral-400 flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  {t.presets}
                </span>
                <span className="text-[10px] text-neutral-500">
                  {lang === 'bn' ? '১-ক্লিকে ফিল করুন' : '1-click auto-fill'}
                </span>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {PRESET_UNIVERSITIES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => applyPreset(p.id)}
                    className="flex items-center gap-2 p-1.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-left transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.primaryColor }} />
                    <span className="text-[11px] font-medium text-neutral-300 truncate">
                      {p.name.split('(')[1]?.replace(')', '') || p.name.split(' ')[0]} ({p.courseCode})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* University & Department */}
            <div className="space-y-3">
              <div>
                <label className="font-semibold text-neutral-300 block mb-1">
                  {lang === 'bn' ? 'বিশ্ববিদ্যালয়ের নাম (University Name)' : 'University Name'}
                </label>
                <input
                  type="text"
                  value={data.universityName}
                  onChange={(e) => updateField('universityName', e.target.value)}
                  placeholder="e.g. First Capital University of Bangladesh (FCUB)"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-300 block mb-1">
                  {lang === 'bn' ? 'ডিপার্টমেন্ট / বিভাগ (Department Name)' : 'Department Name'}
                </label>
                <input
                  type="text"
                  value={data.departmentName}
                  onChange={(e) => updateField('departmentName', e.target.value)}
                  placeholder="e.g. Department of English"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Assignment Type & Course Code */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-neutral-300 block mb-1">
                  {lang === 'bn' ? 'ডকুমেন্টের ধরণ (Type)' : 'Cover Type'}
                </label>
                <select
                  value={data.assignmentType}
                  onChange={(e) => updateField('assignmentType', e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Assignment">Assignment (অ্যাসাইনমেন্ট)</option>
                  <option value="Presentation">Presentation (প্রেজেন্টেশন)</option>
                  <option value="Term Paper">Term Paper (টার্ম পেপার)</option>
                  <option value="Lab Report">Lab Report (ল্যাব রিপোর্ট)</option>
                  <option value="Project Report">Project Report (প্রজেক্ট রিপোর্ট)</option>
                  <option value="Internship Report">Internship Report (ইন্টার্নশিপ)</option>
                  <option value="Thesis">Thesis / Research (থিসিস)</option>
                  <option value="Case Study">Case Study (কেস স্টাডি)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-neutral-300 block mb-1">
                  {lang === 'bn' ? 'বিষয় কোড (Course Code)' : 'Course Code'}
                </label>
                <input
                  type="text"
                  value={data.courseCode}
                  onChange={(e) => updateField('courseCode', e.target.value)}
                  placeholder="e.g. ENG:205 / CSE-101"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 font-mono font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Subject Name / Topic */}
            <div>
              <label className="font-semibold text-neutral-300 block mb-1 flex justify-between">
                <span>{lang === 'bn' ? 'টপিক / সাবজেক্টের নাম (Subject / Topic Title)' : 'Subject / Topic Title'}</span>
                <span className="text-[10px] text-emerald-400 font-normal">
                  {lang === 'bn' ? 'যেমন: THE GARDEN PARTY' : 'e.g. THE GARDEN PARTY'}
                </span>
              </label>
              <textarea
                rows={2}
                value={data.subjectName}
                onChange={(e) => updateField('subjectName', e.target.value)}
                placeholder="THE GARDEN PARTY"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 font-semibold focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Optional Subtitle / Topic Description */}
            <div>
              <label className="font-semibold text-neutral-400 block mb-1">
                {lang === 'bn' ? 'সাবটাইটেল / অতিরিক্ত বিবরণ (Subtitle - ঐচ্ছিক)' : 'Topic Subtitle (Optional)'}
              </label>
              <input
                type="text"
                value={data.topicSubtitle || ''}
                onChange={(e) => updateField('topicSubtitle', e.target.value)}
                placeholder="e.g. A Critical Study on Modern Short Fiction"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-300 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* University Logo Section */}
            <div className="pt-3 border-t border-neutral-800">
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-neutral-300 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                  {lang === 'bn' ? 'ভার্সিটি লোগো (University Logo)' : 'University Logo'}
                </label>
                <div className="flex items-center gap-2">
                  <label className="text-[10px] text-neutral-400 cursor-pointer flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={data.showLogo}
                      onChange={(e) => updateField('showLogo', e.target.checked)}
                      className="rounded accent-emerald-500"
                    />
                    <span>{lang === 'bn' ? 'লোগো দেখান' : 'Show Logo'}</span>
                  </label>
                </div>
              </div>

              {data.showLogo && (
                <div className="space-y-3 bg-neutral-950/60 p-3 rounded-lg border border-neutral-800">
                  {/* Logo Source Selector */}
                  <div className="flex gap-1 p-0.5 bg-neutral-900 rounded-md">
                    <button
                      onClick={() => setLogoInputType('upload')}
                      className={`flex-1 py-1.5 text-[11px] font-medium rounded transition-colors flex items-center justify-center gap-1 ${
                        logoInputType === 'upload' ? 'bg-neutral-800 text-white' : 'text-neutral-400'
                      }`}
                    >
                      <Upload className="w-3 h-3" />
                      {lang === 'bn' ? 'ফাইল আপলোড' : 'Upload File'}
                    </button>
                    <button
                      onClick={() => setLogoInputType('url')}
                      className={`flex-1 py-1.5 text-[11px] font-medium rounded transition-colors flex items-center justify-center gap-1 ${
                        logoInputType === 'url' ? 'bg-neutral-800 text-white' : 'text-neutral-400'
                      }`}
                    >
                      <LinkIcon className="w-3 h-3" />
                      {lang === 'bn' ? 'লিঙ্ক / URL' : 'Image URL'}
                    </button>
                    <button
                      onClick={() => setLogoInputType('presets')}
                      className={`flex-1 py-1.5 text-[11px] font-medium rounded transition-colors flex items-center justify-center gap-1 ${
                        logoInputType === 'presets' ? 'bg-neutral-800 text-white' : 'text-neutral-400'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      {lang === 'bn' ? 'লোগো লিস্ট' : 'Presets'}
                    </button>
                  </div>

                  {/* Upload input */}
                  {logoInputType === 'upload' && (
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleLogoUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-neutral-700 hover:border-emerald-500 rounded-lg p-3 text-center transition-colors flex flex-col items-center justify-center gap-1.5 group"
                      >
                        <Upload className="w-5 h-5 text-neutral-400 group-hover:text-emerald-400" />
                        <span className="text-neutral-300 font-medium text-[11px]">
                          {lang === 'bn' ? 'কম্পিউটার বা ফোন থেকে লোগো সিলেক্ট করুন' : 'Click or Drag & Drop University Logo'}
                        </span>
                        <span className="text-neutral-500 text-[10px]">PNG, JPG, SVG, WebP (Max 5MB)</span>
                      </button>
                    </div>
                  )}

                  {/* URL Input */}
                  {logoInputType === 'url' && (
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={logoUrlTemp}
                        onChange={(e) => setLogoUrlTemp(e.target.value)}
                        placeholder="https://example.com/logo.png"
                        className="flex-1 bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 text-xs"
                      />
                      <button
                        onClick={() => updateField('logoUrl', logoUrlTemp)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded text-xs"
                      >
                        {lang === 'bn' ? 'সেভ' : 'Apply'}
                      </button>
                    </div>
                  )}

                  {/* Preset Logos */}
                  {logoInputType === 'presets' && (
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => updateField('logoUrl', '/fcub-logo.png')}
                        className={`p-2 rounded border text-left flex items-center gap-2 ${
                          data.logoUrl === '/fcub-logo.png'
                            ? 'border-emerald-500 bg-emerald-950/30'
                            : 'border-neutral-800 bg-neutral-900 hover:bg-neutral-800'
                        }`}
                      >
                        <img src="/fcub-logo.png" alt="FCUB" className="w-6 h-6 object-contain" />
                        <span className="text-[11px] font-semibold text-neutral-200">FCUB (ডিফল্ট)</span>
                      </button>

                      {PRESET_UNIVERSITIES.slice(1).map((p) => (
                        <button
                          key={p.id}
                          onClick={() => updateField('logoUrl', p.logoUrl)}
                          className={`p-2 rounded border text-left flex items-center gap-2 ${
                            data.logoUrl === p.logoUrl
                              ? 'border-emerald-500 bg-emerald-950/30'
                              : 'border-neutral-800 bg-neutral-900 hover:bg-neutral-800'
                          }`}
                        >
                          <img src={p.logoUrl} alt={p.name} className="w-6 h-6 object-contain" />
                          <span className="text-[11px] font-medium text-neutral-300 truncate">
                            {p.name.split(' ')[0]}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Logo Controls: Size & Shape */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                        <span>{lang === 'bn' ? 'লোগো সাইজ' : 'Logo Scale'}</span>
                        <span className="font-mono">{data.logoScale}%</span>
                      </div>
                      <input
                        type="range"
                        min="60"
                        max="180"
                        value={data.logoScale}
                        onChange={(e) => updateField('logoScale', Number(e.target.value))}
                        className="w-full accent-emerald-500"
                      />
                    </div>

                    <div>
                      <span className="block text-[11px] text-neutral-400 mb-1">
                        {lang === 'bn' ? 'লোগোর শেপ' : 'Logo Shape'}
                      </span>
                      <select
                        value={data.logoShape}
                        onChange={(e) => updateField('logoShape', e.target.value as any)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-neutral-200 text-xs"
                      >
                        <option value="original">Original (স্বাভাবিক)</option>
                        <option value="circle">Circle (গোলাকার)</option>
                        <option value="shield">Shield (শিল্ড)</option>
                        <option value="square">Square (বর্গাকার)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================= TAB 2: THEMES ======================= */}
        {activeTab === 'theme' && (
          <div className="space-y-4">
            <div>
              <p className="text-neutral-400 mb-3">
                {lang === 'bn'
                  ? 'আপনার পছন্দের থিমটি নির্বাচন করুন। এফসিইউবি অরিজিনাল ফিতা থিম সহ আরও ৭টি প্রফেশনাল ডিজাইন রয়েছে:'
                  : 'Choose a cover theme. Includes your requested FCUB ribbon theme plus 7+ distinct academic styles:'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {THEMES.map((th) => {
                  const isSelected = data.themeId === th.id;
                  return (
                    <button
                      key={th.id}
                      onClick={() => {
                        onChange({
                          ...data,
                          themeId: th.id,
                          primaryColor: th.defaultPrimary,
                          accentColor: th.defaultAccent,
                        });
                      }}
                      className={`p-3 rounded-xl border text-left transition-all relative ${
                        isSelected
                          ? 'border-emerald-500 bg-neutral-800/80 shadow-md ring-1 ring-emerald-500/50'
                          : 'border-neutral-800 bg-neutral-950/60 hover:bg-neutral-900 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-neutral-100 text-xs">
                          {lang === 'bn' ? th.nameBn : th.name}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                            th.id === 'fcub-ribbon'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-neutral-800 text-neutral-400'
                          }`}
                        >
                          {th.badge}
                        </span>
                      </div>

                      <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                        {th.description}
                      </p>

                      <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-neutral-800/60">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20"
                          style={{ backgroundColor: th.defaultPrimary }}
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20"
                          style={{ backgroundColor: th.defaultAccent }}
                        />
                        <span className="text-[10px] text-neutral-500 ml-auto">
                          {isSelected ? '✓ ' + (lang === 'bn' ? 'সক্রিয়' : 'Active') : (lang === 'bn' ? 'সিলেক্ট করুন' : 'Select')}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* FCUB Ribbon Specific Options */}
            {data.themeId === 'fcub-ribbon' && (
              <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-lg space-y-2">
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {lang === 'bn' ? 'এফসিইউবি থিম অপশন' : 'FCUB Ribbon Options'}
                </span>
                <div className="flex items-center justify-between text-[11px] text-neutral-300">
                  <span>{lang === 'bn' ? 'কোণার সবুজ-লাল বাঁকা ফিতা (Corner Swoops)' : 'Dynamic Corner Ribbon Swoops'}</span>
                  <input
                    type="checkbox"
                    checked={data.hasCornerRibbons}
                    onChange={(e) => updateField('hasCornerRibbons', e.target.checked)}
                    className="rounded accent-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* Border Width Control */}
            <div className="p-3 bg-neutral-950/60 border border-neutral-800 rounded-lg">
              <div className="flex justify-between text-neutral-300 mb-1.5">
                <span>{lang === 'bn' ? 'আউটলাইন বর্ডারের সাইজ (Border Width)' : 'Border Width'}</span>
                <span className="font-mono text-neutral-400">{data.borderWidth}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="6"
                value={data.borderWidth}
                onChange={(e) => updateField('borderWidth', Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>
        )}

        {/* ======================= TAB 3: SUBMISSION DETAILS ======================= */}
        {activeTab === 'submission' && (
          <div className="space-y-4">
            {/* Submission Mode Selector */}
            <div className="p-3 bg-neutral-950/60 border border-neutral-800 rounded-lg">
              <label className="font-semibold text-neutral-300 block mb-2">
                {lang === 'bn' ? 'তথ্য প্রদর্শনের ধরণ (Submission Style)' : 'Submission Display Style'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => updateField('submissionMode', 'underline')}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    data.submissionMode === 'underline'
                      ? 'border-emerald-500 bg-emerald-950/30 text-emerald-200'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span className="font-bold block text-[11px]">
                    {lang === 'bn' ? 'আন্ডারলাইন দাগ' : 'Underline Line'}
                  </span>
                  <span className="text-[10px] opacity-75">
                    {lang === 'bn' ? 'ডেমো পিকচারের মতো' : 'Like demo picture'}
                  </span>
                </button>

                <button
                  onClick={() => updateField('submissionMode', 'typed')}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    data.submissionMode === 'typed'
                      ? 'border-emerald-500 bg-emerald-950/30 text-emerald-200'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span className="font-bold block text-[11px]">
                    {lang === 'bn' ? 'ক্লিন টাইপড টেক্সট' : 'Clean Typed Text'}
                  </span>
                  <span className="text-[10px] opacity-75">
                    {lang === 'bn' ? 'সোজা এলাইন্ড' : 'Aligned rows'}
                  </span>
                </button>

                <button
                  onClick={() => updateField('submissionMode', 'cards')}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    data.submissionMode === 'cards'
                      ? 'border-emerald-500 bg-emerald-950/30 text-emerald-200'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span className="font-bold block text-[11px]">
                    {lang === 'bn' ? 'বক্স কার্ড' : 'Dual Cards'}
                  </span>
                  <span className="text-[10px] opacity-75">
                    {lang === 'bn' ? 'আধুনিক ২টি বক্স' : 'Modern 2-column'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submitted To (Faculty / Teacher) */}
            <div className="p-3 bg-neutral-950/60 border border-neutral-800 rounded-lg space-y-3">
              <span className="font-semibold text-neutral-200 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" />
                {lang === 'bn' ? 'কাকে জমা দিচ্ছেন (Submitted To - Teacher)' : 'Submitted To (Instructor)'}
              </span>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">
                    {lang === 'bn' ? 'শিক্ষকের নাম (Teacher Name)' : 'Teacher Name'}
                  </label>
                  <input
                    type="text"
                    value={data.submittedTo.name}
                    onChange={(e) =>
                      updateField('submittedTo', {
                        ...data.submittedTo,
                        name: e.target.value,
                      })
                    }
                    placeholder="e.g. Dr. Shahinur Rahman"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">
                    {lang === 'bn' ? 'পদবী (Designation)' : 'Designation'}
                  </label>
                  <input
                    type="text"
                    value={data.submittedTo.designation}
                    onChange={(e) =>
                      updateField('submittedTo', {
                        ...data.submittedTo,
                        designation: e.target.value,
                      })
                    }
                    placeholder="e.g. Assistant Professor & Head"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">
                  {lang === 'bn' ? 'শিক্ষকের ডিপার্টমেন্ট (Department)' : 'Department'}
                </label>
                <input
                  type="text"
                  value={data.submittedTo.department}
                  onChange={(e) =>
                    updateField('submittedTo', {
                      ...data.submittedTo,
                      department: e.target.value,
                    })
                  }
                  placeholder="e.g. Department of English"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 text-xs"
                />
              </div>
            </div>

            {/* Submitted By (Student / Group) */}
            <div className="p-3 bg-neutral-950/60 border border-neutral-800 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-200 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                  {lang === 'bn' ? 'কে জমা দিচ্ছেন (Submitted By - Student)' : 'Submitted By (Student)'}
                </span>

                <label className="text-[11px] text-neutral-400 cursor-pointer flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={data.isGroupSubmission}
                    onChange={(e) => updateField('isGroupSubmission', e.target.checked)}
                    className="rounded accent-emerald-500"
                  />
                  <span>{lang === 'bn' ? 'গ্রুপ / একাধিক শিক্ষার্থী' : 'Group Submission'}</span>
                </label>
              </div>

              {/* Primary Student or List */}
              {data.submittedBy.map((student, index) => (
                <div
                  key={student.id || index}
                  className={`p-2.5 rounded-lg border ${
                    data.isGroupSubmission
                      ? 'border-neutral-700 bg-neutral-900/80 space-y-2'
                      : 'border-transparent p-0 space-y-2'
                  }`}
                >
                  {data.isGroupSubmission && (
                    <div className="flex justify-between items-center text-[11px] font-semibold text-neutral-300">
                      <span>{lang === 'bn' ? `শিক্ষার্থী #${index + 1}` : `Student #${index + 1}`}</span>
                      {data.submittedBy.length > 1 && (
                        <button
                          onClick={() => handleRemoveStudent(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">
                        {lang === 'bn' ? 'শিক্ষার্থীর নাম (Student Name)' : 'Student Name'}
                      </label>
                      <input
                        type="text"
                        value={student.name}
                        onChange={(e) => handleUpdateStudent(index, 'name', e.target.value)}
                        placeholder="MD. Abdullah Al Mamun"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">
                        {lang === 'bn' ? 'আইডি নাম্বার (Student ID)' : 'Student ID'}
                      </label>
                      <input
                        type="text"
                        value={student.studentId}
                        onChange={(e) => handleUpdateStudent(index, 'studentId', e.target.value)}
                        placeholder="221-02-0542"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 font-mono font-medium text-xs"
                      />
                    </div>
                  </div>

                  {!data.isGroupSubmission && (
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-neutral-500 block mb-1">
                          {lang === 'bn' ? 'সেমিস্টার (Semester)' : 'Semester'}
                        </label>
                        <input
                          type="text"
                          value={student.semester || ''}
                          onChange={(e) => handleUpdateStudent(index, 'semester', e.target.value)}
                          placeholder="6th Semester"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-neutral-300 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-500 block mb-1">
                          {lang === 'bn' ? 'ব্যাচ (Batch)' : 'Batch'}
                        </label>
                        <input
                          type="text"
                          value={student.batch || ''}
                          onChange={(e) => handleUpdateStudent(index, 'batch', e.target.value)}
                          placeholder="21st Batch"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-neutral-300 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-500 block mb-1">
                          {lang === 'bn' ? 'সেকশন (Section)' : 'Section'}
                        </label>
                        <input
                          type="text"
                          value={student.section || ''}
                          onChange={(e) => handleUpdateStudent(index, 'section', e.target.value)}
                          placeholder="A"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-neutral-300 text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {data.isGroupSubmission && (
                <button
                  onClick={handleAddStudent}
                  className="w-full py-1.5 border border-dashed border-neutral-700 hover:border-emerald-500 rounded text-neutral-300 hover:text-emerald-300 text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? '+ আর একজন মেম্বার যোগ করুন' : '+ Add Another Team Member'}</span>
                </button>
              )}
            </div>

            {/* Date & Session */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-neutral-950/60 border border-neutral-800 rounded-lg">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-neutral-400" />
                  {lang === 'bn' ? 'জমার তারিখ (Submission Date)' : 'Submission Date'}
                </label>
                <input
                  type="date"
                  value={data.submissionDate}
                  onChange={(e) => updateField('submissionDate', e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1.5 text-neutral-200 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">
                  {lang === 'bn' ? 'সেশন (Session)' : 'Academic Session'}
                </label>
                <input
                  type="text"
                  value={data.session || ''}
                  onChange={(e) => updateField('session', e.target.value)}
                  placeholder="e.g. 2023-2024"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1.5 text-neutral-200 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 4: STYLE & COLORS ======================= */}
        {activeTab === 'style' && (
          <div className="space-y-4">
            {/* Font Family Selection */}
            <div>
              <label className="font-semibold text-neutral-300 block mb-2 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-emerald-400" />
                {lang === 'bn' ? 'ফ্রন্ট স্টাইল (Typography / Font Family)' : 'Font Family'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FONT_OPTIONS.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => updateField('fontFamily', font.id)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      data.fontFamily === font.id
                        ? 'border-emerald-500 bg-neutral-800 ring-1 ring-emerald-500/50'
                        : 'border-neutral-800 bg-neutral-950/60 hover:bg-neutral-900'
                    }`}
                  >
                    <span className={`block text-xs font-semibold text-neutral-200 ${font.class}`}>
                      {font.name.split('(')[0]}
                    </span>
                    <span className="text-[10px] text-neutral-500">
                      {font.name.split('(')[1]?.replace(')', '') || 'Sample text'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="p-3 bg-neutral-950/60 border border-neutral-800 rounded-lg space-y-3">
              <span className="font-semibold text-neutral-200 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-purple-400" />
                {lang === 'bn' ? 'কালার প্যালেট (Brand & Accent Colors)' : 'Color Customization'}
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">
                    {lang === 'bn' ? 'মেইন কালার (Primary)' : 'Primary Theme Color'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={data.primaryColor}
                      onChange={(e) => updateField('primaryColor', e.target.value)}
                      className="w-8 h-8 rounded border border-neutral-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={data.primaryColor}
                      onChange={(e) => updateField('primaryColor', e.target.value)}
                      className="flex-1 bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-neutral-200 font-mono text-xs uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">
                    {lang === 'bn' ? 'একসেন্ট কালার (Accent)' : 'Accent / Ribbon Color'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={data.accentColor}
                      onChange={(e) => updateField('accentColor', e.target.value)}
                      className="w-8 h-8 rounded border border-neutral-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={data.accentColor}
                      onChange={(e) => updateField('accentColor', e.target.value)}
                      className="flex-1 bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-neutral-200 font-mono text-xs uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Watermark Control */}
            <div className="p-3 bg-neutral-950/60 border border-neutral-800 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-300">
                  {lang === 'bn' ? 'ব্যাকগ্রাউন্ড ওয়াটারমার্ক (Logo Watermark)' : 'Background Watermark'}
                </span>
                <input
                  type="checkbox"
                  checked={data.showWatermark}
                  onChange={(e) => updateField('showWatermark', e.target.checked)}
                  className="rounded accent-emerald-500"
                />
              </div>

              {data.showWatermark && (
                <div className="pt-2">
                  <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                    <span>{lang === 'bn' ? 'অস্পষ্টতা (Opacity)' : 'Opacity'}</span>
                    <span className="font-mono">{Math.round(data.watermarkOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.02"
                    max="0.15"
                    step="0.01"
                    value={data.watermarkOpacity}
                    onChange={(e) => updateField('watermarkOpacity', Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
