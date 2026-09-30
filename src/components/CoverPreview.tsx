import React, { forwardRef } from 'react';
import { CoverData } from '../types';
import {
  FcubCornerRibbon,
  DiamondDivider,
  ClassicalCornerOrnaments,
  AcademicSealSvg,
} from './themes/VectorDecorations';

interface CoverPreviewProps {
  data: CoverData;
  scale?: number;
  printMode?: boolean;
}

export const CoverPreview = forwardRef<HTMLDivElement, CoverPreviewProps>(
  ({ data, scale = 1, printMode = false }, ref) => {
    const {
      universityName,
      departmentName,
      facultyName,
      assignmentType,
      courseCode,
      subjectName,
      topicSubtitle,
      themeId,
      fontFamily,
      logoUrl,
      logoScale,
      logoShape,
      logoPosition,
      showLogo,
      primaryColor,
      accentColor,
      textColor,
      paperBgColor,
      borderWidth,
      hasCornerRibbons,
      showWatermark,
      watermarkOpacity,
      submissionMode,
      isGroupSubmission,
      submittedBy,
      submittedTo,
      submissionDate,
      session,
    } = data;

    // Font family mapping
    const fontClassMap: Record<string, string> = {
      Merriweather: 'font-merriweather',
      'Playfair Display': 'font-playfair',
      'Cormorant Garamond': 'font-cormorant',
      Cinzel: 'font-cinzel',
      'Plus Jakarta Sans': 'font-jakarta',
      Montserrat: 'font-montserrat',
      Poppins: 'font-poppins',
      Lora: 'font-lora',
    };

    const activeFont = fontClassMap[fontFamily] || 'font-merriweather';

    // Logo shape styling
    const getLogoShapeClass = () => {
      switch (logoShape) {
        case 'circle':
          return 'rounded-full border border-neutral-200 object-cover';
        case 'shield':
          return 'rounded-b-2xl rounded-t-lg object-contain';
        case 'square':
          return 'rounded-md object-contain';
        case 'original':
        default:
          return 'object-contain';
      }
    };

    const logoPositionClass =
      logoPosition === 'left'
        ? 'justify-start'
        : logoPosition === 'right'
        ? 'justify-end'
        : 'justify-center';

    // Renders the University Logo with fallback
    const renderLogo = () => {
      if (!showLogo) return null;

      const sizePx = Math.round((logoScale / 100) * 88);

      return (
        <div className={`flex ${logoPositionClass} w-full items-center mb-6`}>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="University Logo"
              referrerPolicy="no-referrer"
              className={`transition-all duration-200 ${getLogoShapeClass()}`}
              style={{
                height: `${sizePx}px`,
                maxWidth: `${sizePx * 1.5}px`,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))',
              }}
              onError={(e) => {
                // If remote logo fails, swap with styled fallback
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <AcademicSealSvg primaryColor={primaryColor} size={sizePx} />
          )}
        </div>
      );
    };

    // Submission details rendering
    const renderSubmissionDetails = () => {
      const primaryStudent = submittedBy[0] || {
        name: 'MD. Abdullah Al Mamun',
        studentId: '221-02-0542',
      };

      if (submissionMode === 'underline') {
        return (
          <div className="w-full max-w-[500px] mx-auto space-y-4 my-8 text-neutral-800 text-[14px]">
            {/* Submitted To Line */}
            <div className="flex items-baseline gap-2">
              <span className="font-bold shrink-0 min-w-[110px] text-neutral-900">
                Submitted To:
              </span>
              <div className="flex-1 border-b-2 border-neutral-700 pb-0.5 min-h-[22px] flex items-center px-1 font-medium">
                {submittedTo.name ? (
                  <span>
                    {submittedTo.name}
                    {submittedTo.designation && (
                      <span className="text-neutral-600 text-xs ml-2">
                        ({submittedTo.designation})
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="opacity-0">.</span>
                )}
              </div>
            </div>

            {/* Submitted By Line */}
            {isGroupSubmission ? (
              <div className="space-y-2 pt-1">
                <span className="font-bold text-neutral-900 block">
                  Submitted By (Group Members):
                </span>
                <div className="border border-neutral-300 rounded bg-neutral-50/50 p-2 space-y-1.5">
                  {submittedBy.map((st, i) => (
                    <div key={st.id || i} className="flex justify-between items-center text-xs pb-1 border-b border-neutral-200 last:border-0">
                      <span className="font-medium text-neutral-800">
                        {i + 1}. {st.name || 'Member Name'}
                      </span>
                      <span className="font-mono text-neutral-700 bg-white px-1.5 py-0.5 rounded border border-neutral-200">
                        ID: {st.studentId || 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold shrink-0 min-w-[110px] text-neutral-900">
                    Submitted By:
                  </span>
                  <div className="flex-1 border-b-2 border-neutral-700 pb-0.5 min-h-[22px] flex items-center px-1 font-medium">
                    {primaryStudent.name ? (
                      <span>{primaryStudent.name}</span>
                    ) : (
                      <span className="opacity-0">.</span>
                    )}
                  </div>
                </div>

                {/* ID Line */}
                <div className="flex items-baseline gap-2">
                  <span className="font-bold shrink-0 min-w-[110px] text-neutral-900">
                    ID:
                  </span>
                  <div className="flex-1 border-b-2 border-neutral-700 pb-0.5 min-h-[22px] flex items-center px-1 font-semibold tracking-wider">
                    {primaryStudent.studentId ? (
                      <span>{primaryStudent.studentId}</span>
                    ) : (
                      <span className="opacity-0">.</span>
                    )}
                  </div>
                </div>

                {/* Optional Semester & Section if filled */}
                {(primaryStudent.semester || primaryStudent.batch || primaryStudent.section) && (
                  <div className="flex items-baseline gap-2 text-xs text-neutral-600 pl-[118px] pt-1">
                    {primaryStudent.semester && <span>{primaryStudent.semester}</span>}
                    {primaryStudent.batch && <span>• {primaryStudent.batch}</span>}
                    {primaryStudent.section && <span>• Sec: {primaryStudent.section}</span>}
                  </div>
                )}
              </>
            )}

            {/* Submission Date */}
            {submissionDate && (
              <div className="flex items-baseline gap-2 pt-1">
                <span className="font-bold shrink-0 min-w-[110px] text-neutral-900 text-xs">
                  Date of Submission:
                </span>
                <div className="flex-1 border-b border-neutral-400 pb-0.5 text-xs text-neutral-700 font-medium px-1">
                  {submissionDate}
                </div>
              </div>
            )}
          </div>
        );
      }

      if (submissionMode === 'cards') {
        return (
          <div className="w-full max-w-[540px] mx-auto my-6 grid grid-cols-2 gap-4 text-xs">
            {/* Submitted To Box */}
            <div
              className="p-3.5 rounded-lg border bg-neutral-50/70"
              style={{ borderColor: `${primaryColor}40` }}
            >
              <span
                className="font-bold uppercase tracking-wider block mb-1 text-[11px]"
                style={{ color: primaryColor }}
              >
                Submitted To
              </span>
              <p className="font-semibold text-neutral-900 text-[13px]">
                {submittedTo.name || 'Instructor Name'}
              </p>
              <p className="text-neutral-600 mt-0.5">{submittedTo.designation}</p>
              <p className="text-neutral-500 text-[11px] mt-0.5">{submittedTo.department}</p>
            </div>

            {/* Submitted By Box */}
            <div
              className="p-3.5 rounded-lg border bg-neutral-50/70"
              style={{ borderColor: `${primaryColor}40` }}
            >
              <span
                className="font-bold uppercase tracking-wider block mb-1 text-[11px]"
                style={{ color: primaryColor }}
              >
                Submitted By
              </span>
              {isGroupSubmission ? (
                <div className="space-y-1">
                  {submittedBy.map((st, i) => (
                    <div key={st.id || i} className="flex justify-between text-[11px]">
                      <span className="font-medium text-neutral-800 truncate pr-1">
                        {st.name}
                      </span>
                      <span className="font-mono text-neutral-600 shrink-0">
                        {st.studentId}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <p className="font-semibold text-neutral-900 text-[13px]">
                    {primaryStudent.name || 'Student Name'}
                  </p>
                  <p className="font-mono font-medium text-neutral-700 mt-0.5">
                    ID: {primaryStudent.studentId || 'Student ID'}
                  </p>
                  <p className="text-neutral-500 text-[11px] mt-0.5">
                    {primaryStudent.program || primaryStudent.department || departmentName}
                  </p>
                  {(primaryStudent.semester || primaryStudent.section) && (
                    <p className="text-neutral-500 text-[10px]">
                      {primaryStudent.semester} {primaryStudent.section && `• Sec: ${primaryStudent.section}`}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        );
      }

      // Default 'typed' mode (Clean 2-column or aligned text)
      return (
        <div className="w-full max-w-[500px] mx-auto my-6 space-y-3 text-neutral-800 text-[13px]">
          <div className="grid grid-cols-[130px_1fr] items-baseline border-b border-neutral-100 pb-1.5">
            <span className="font-semibold text-neutral-900">Submitted To:</span>
            <div>
              <span className="font-medium text-neutral-900">{submittedTo.name}</span>
              {submittedTo.designation && (
                <span className="text-neutral-500 text-xs block">
                  {submittedTo.designation}, {submittedTo.department}
                </span>
              )}
            </div>
          </div>

          {isGroupSubmission ? (
            <div className="border-b border-neutral-100 pb-2">
              <span className="font-semibold text-neutral-900 block mb-1.5">
                Submitted By (Group Members):
              </span>
              <div className="space-y-1 pl-2">
                {submittedBy.map((st, i) => (
                  <div key={st.id || i} className="flex justify-between items-center text-xs">
                    <span className="font-medium text-neutral-800">
                      {i + 1}. {st.name}
                    </span>
                    <span className="font-mono font-semibold text-neutral-700">
                      ID: {st.studentId}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[130px_1fr] items-baseline border-b border-neutral-100 pb-1.5">
                <span className="font-semibold text-neutral-900">Submitted By:</span>
                <span className="font-medium text-neutral-900">{primaryStudent.name}</span>
              </div>
              <div className="grid grid-cols-[130px_1fr] items-baseline border-b border-neutral-100 pb-1.5">
                <span className="font-semibold text-neutral-900">Student ID:</span>
                <span className="font-mono font-bold tracking-wider text-neutral-900">
                  {primaryStudent.studentId}
                </span>
              </div>
              {(primaryStudent.semester || primaryStudent.batch) && (
                <div className="grid grid-cols-[130px_1fr] items-baseline border-b border-neutral-100 pb-1.5">
                  <span className="font-semibold text-neutral-900">Semester & Batch:</span>
                  <span className="text-neutral-700">
                    {primaryStudent.semester} {primaryStudent.batch && `(${primaryStudent.batch})`}
                  </span>
                </div>
              )}
            </>
          )}

          {submissionDate && (
            <div className="grid grid-cols-[130px_1fr] items-baseline text-xs text-neutral-500 pt-1">
              <span>Date:</span>
              <span className="font-medium text-neutral-700">{submissionDate}</span>
            </div>
          )}
        </div>
      );
    };

    return (
      <div
        ref={ref}
        id="cover-page-print-area"
        className={`relative overflow-hidden transition-all duration-300 ${activeFont}`}
        style={{
          width: printMode ? '210mm' : '794px', // standard A4 at 96 DPI preview
          height: printMode ? '297mm' : '1123px',
          backgroundColor: paperBgColor,
          color: textColor,
          boxShadow: printMode ? 'none' : '0 15px 35px -5px rgba(0,0,0,0.3)',
          transform: !printMode && scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: 'top center',
        }}
      >
        {/* Subtle Watermark if enabled */}
        {showWatermark && logoUrl && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
            style={{ opacity: watermarkOpacity }}
          >
            <img
              src={logoUrl}
              alt="Watermark"
              className="w-[450px] h-[450px] object-contain filter grayscale"
            />
          </div>
        )}

        {/* ----------------- THEME 1: FCUB SIGNATURE RIBBON (Exact attached photo) ----------------- */}
        {themeId === 'fcub-ribbon' && (
          <div className="relative w-full h-full flex flex-col justify-between p-10 z-10">
            {/* Corner Swoops */}
            {hasCornerRibbons && (
              <>
                <FcubCornerRibbon
                  primaryColor={primaryColor}
                  accentColor={accentColor}
                  position="top-left"
                />
                <FcubCornerRibbon
                  primaryColor={primaryColor}
                  accentColor={accentColor}
                  position="bottom-right"
                />
              </>
            )}

            {/* Inset Outer Border (Dark Green) */}
            <div
              className="absolute inset-8 pointer-events-none rounded-[1px]"
              style={{
                border: `${borderWidth}px solid ${primaryColor}`,
              }}
            />

            {/* Main Content Container inside border */}
            <div className="relative z-10 w-full h-full flex flex-col justify-between pt-8 pb-6 px-8 text-center">
              {/* Top Section: Logo */}
              <div className="w-full flex flex-col items-center">
                {renderLogo()}

                {/* Assignment Heading with dashes */}
                <div className="flex items-center justify-center gap-3 w-full my-1">
                  <div
                    className="h-[1.5px] w-12"
                    style={{ backgroundColor: textColor }}
                  />
                  <h2
                    className="text-[26px] font-serif font-bold italic tracking-wide"
                    style={{ color: textColor }}
                  >
                    {assignmentType}
                  </h2>
                  <div
                    className="h-[1.5px] w-12"
                    style={{ backgroundColor: textColor }}
                  />
                </div>

                {/* Course Code */}
                {courseCode && (
                  <p className="text-[17px] font-bold tracking-wider uppercase mt-2 text-neutral-800">
                    {courseCode}
                  </p>
                )}

                {/* Subject Name / Topic (Default: THE GARDEN PARTY) */}
                <h1
                  className="text-[32px] sm:text-[36px] font-extrabold uppercase tracking-wide mt-4 max-w-[620px] leading-tight"
                  style={{ color: primaryColor }}
                >
                  {subjectName}
                </h1>

                {/* Optional Subtitle */}
                {topicSubtitle && (
                  <p className="text-[14px] text-neutral-600 italic mt-1 max-w-[500px]">
                    {topicSubtitle}
                  </p>
                )}

                {/* 3-Diamond divider ornament */}
                <DiamondDivider primaryColor={primaryColor} accentColor={accentColor} />
              </div>

              {/* Middle Section: Submitted To, Submitted By, ID */}
              <div className="w-full my-auto text-left">
                {renderSubmissionDetails()}
              </div>

              {/* Footer Section: Department & University Name */}
              <div className="w-full flex flex-col items-center text-center mt-auto pt-4 pb-2">
                <h3
                  className="text-[20px] font-bold tracking-wide"
                  style={{ color: primaryColor }}
                >
                  {departmentName}
                </h3>
                <p className="text-[16px] font-medium text-neutral-900 mt-1">
                  {universityName}
                </p>
                {session && (
                  <p className="text-[12px] text-neutral-500 mt-0.5 font-medium">
                    Session: {session}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ----------------- THEME 2: ROYAL IVY CREST ----------------- */}
        {themeId === 'royal-crest' && (
          <div className="relative w-full h-full flex flex-col justify-between p-10 z-10">
            {/* Double gilded border */}
            <div
              className="absolute inset-6 pointer-events-none"
              style={{ border: `3px double ${accentColor}` }}
            />
            <div
              className="absolute inset-8 pointer-events-none"
              style={{ border: `1px solid ${primaryColor}40` }}
            />

            {/* Classical Corner Ornaments */}
            <ClassicalCornerOrnaments color={accentColor} position="top-left" />
            <ClassicalCornerOrnaments color={accentColor} position="top-right" />
            <ClassicalCornerOrnaments color={accentColor} position="bottom-left" />
            <ClassicalCornerOrnaments color={accentColor} position="bottom-right" />

            <div className="relative z-10 w-full h-full flex flex-col justify-between py-10 px-10 text-center">
              <div>
                {/* University Name Header in classical small-caps */}
                <h4
                  className="text-[14px] uppercase font-bold tracking-[0.25em] mb-4"
                  style={{ color: primaryColor }}
                >
                  {universityName}
                </h4>

                {renderLogo()}

                <div className="w-24 h-[1px] mx-auto my-3" style={{ backgroundColor: accentColor }} />

                <span
                  className="text-xs uppercase tracking-[0.3em] font-semibold block my-1"
                  style={{ color: accentColor }}
                >
                  {assignmentType}
                </span>

                {courseCode && (
                  <p className="text-sm font-semibold tracking-widest uppercase text-neutral-700 mt-1">
                    Course: {courseCode}
                  </p>
                )}

                <h1
                  className="text-[32px] font-serif font-bold uppercase tracking-wider mt-4 leading-tight"
                  style={{ color: primaryColor }}
                >
                  {subjectName}
                </h1>

                {topicSubtitle && (
                  <p className="text-xs italic text-neutral-600 mt-1.5 max-w-[450px] mx-auto">
                    {topicSubtitle}
                  </p>
                )}

                <div className="flex items-center justify-center gap-2 mt-4 text-xs" style={{ color: accentColor }}>
                  <span>✦</span>
                  <span className="w-16 h-[1px]" style={{ backgroundColor: accentColor }} />
                  <span>✦</span>
                </div>
              </div>

              <div className="w-full my-auto text-left">
                {renderSubmissionDetails()}
              </div>

              <div className="text-center pt-4">
                <p className="text-[17px] font-serif font-bold" style={{ color: primaryColor }}>
                  {departmentName}
                </p>
                {facultyName && (
                  <p className="text-xs text-neutral-600 mt-0.5">{facultyName}</p>
                )}
                {session && (
                  <p className="text-[11px] text-neutral-500 mt-1 tracking-wider uppercase">
                    Academic Year / Session: {session}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ----------------- THEME 3: MODERN MINIMALIST ----------------- */}
        {themeId === 'modern-minimal' && (
          <div className="relative w-full h-full flex z-10">
            {/* Left Accent Spine */}
            <div
              className="w-4 h-full shrink-0 flex flex-col justify-between py-8 items-center"
              style={{ backgroundColor: primaryColor }}
            >
              <div className="w-1.5 h-12 rounded-full" style={{ backgroundColor: accentColor }} />
              <div className="w-1.5 h-12 rounded-full" style={{ backgroundColor: accentColor }} />
            </div>

            {/* Inner Content with hairline border */}
            <div className="flex-1 flex flex-col justify-between p-12 text-left">
              <div>
                <div className="flex justify-between items-start border-b border-neutral-200 pb-6 mb-8">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                      {universityName}
                    </h3>
                    <p className="text-sm font-semibold mt-1" style={{ color: primaryColor }}>
                      {departmentName}
                    </p>
                  </div>
                  {showLogo && (
                    <div className="shrink-0 ml-4">
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt="Logo"
                          className="h-16 object-contain"
                        />
                      ) : (
                        <AcademicSealSvg primaryColor={primaryColor} size={50} />
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-8 space-y-2">
                  <div className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
                    {assignmentType}
                  </div>
                  {courseCode && (
                    <p className="text-sm font-mono font-bold tracking-wider text-neutral-600 pt-1">
                      {courseCode}
                    </p>
                  )}
                  <h1
                    className="text-[34px] font-bold tracking-tight text-neutral-900 leading-tight pt-2"
                  >
                    {subjectName}
                  </h1>
                  {topicSubtitle && (
                    <p className="text-sm text-neutral-600 pt-1 max-w-[500px]">
                      {topicSubtitle}
                    </p>
                  )}
                </div>
              </div>

              <div className="my-auto">
                {renderSubmissionDetails()}
              </div>

              <div className="border-t border-neutral-200 pt-4 flex justify-between items-center text-xs text-neutral-500">
                <span>{facultyName || departmentName}</span>
                <span>{session ? `Session: ${session}` : submissionDate}</span>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- THEME 4: TECH & ENGINEERING GRID ----------------- */}
        {themeId === 'tech-engineer' && (
          <div className="relative w-full h-full flex flex-col justify-between p-10 z-10">
            {/* Tech Corner Crosshairs */}
            <div className="absolute top-6 left-6 text-neutral-400 font-mono text-[10px] select-none">
              + [0,0]
            </div>
            <div className="absolute top-6 right-6 text-neutral-400 font-mono text-[10px] select-none">
              + [A4_PORTRAIT]
            </div>
            <div className="absolute bottom-6 left-6 text-neutral-400 font-mono text-[10px] select-none">
              + [ISO_216]
            </div>
            <div className="absolute bottom-6 right-6 text-neutral-400 font-mono text-[10px] select-none">
              + [210x297]
            </div>

            {/* Inner Tech Border */}
            <div
              className="absolute inset-10 pointer-events-none"
              style={{ border: `1.5px solid ${primaryColor}60` }}
            />

            <div className="relative z-10 w-full h-full flex flex-col justify-between py-8 px-8 text-center">
              <div>
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-6">
                  <span className="font-mono text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                    SPEC_CODE: {courseCode || 'N/A'}
                  </span>
                  <span
                    className="font-mono text-[11px] font-bold uppercase px-2 py-0.5 rounded text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {assignmentType}
                  </span>
                </div>

                {renderLogo()}

                <h4 className="text-[13px] font-mono uppercase tracking-widest text-neutral-600 mb-1">
                  {universityName}
                </h4>

                <h1
                  className="text-[32px] font-extrabold uppercase tracking-tight mt-4 leading-tight"
                  style={{ color: primaryColor }}
                >
                  {subjectName}
                </h1>

                {topicSubtitle && (
                  <p className="text-xs font-mono text-neutral-600 mt-2 max-w-[500px] mx-auto">
                    // {topicSubtitle}
                  </p>
                )}

                <div className="w-16 h-1 mx-auto my-4 rounded-full" style={{ backgroundColor: accentColor }} />
              </div>

              <div className="my-auto text-left">
                {renderSubmissionDetails()}
              </div>

              <div className="border-t border-neutral-200 pt-3 flex justify-between items-center text-xs font-mono text-neutral-600">
                <span className="font-semibold">{departmentName}</span>
                <span>{session ? `SESSION: ${session}` : `DATE: ${submissionDate}`}</span>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- THEME 5: NATIONAL EMERALD & CRIMSON ----------------- */}
        {themeId === 'national-emerald' && (
          <div className="relative w-full h-full flex flex-col justify-between z-10">
            {/* Top Emerald & Crimson Header Ribbon */}
            <div className="w-full flex h-5">
              <div className="w-2/3 h-full" style={{ backgroundColor: primaryColor }} />
              <div className="w-1/3 h-full" style={{ backgroundColor: accentColor }} />
            </div>

            {/* Inset Border */}
            <div
              className="absolute inset-8 top-10 bottom-10 pointer-events-none"
              style={{ border: `2px solid ${primaryColor}50` }}
            />

            <div className="relative z-10 flex-1 flex flex-col justify-between py-8 px-14 text-center">
              <div>
                <h4
                  className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-neutral-600"
                >
                  {universityName}
                </h4>

                {renderLogo()}

                <div className="inline-block border-y-2 border-neutral-900 py-1 px-8 my-2">
                  <span className="text-xl font-serif font-bold uppercase tracking-widest">
                    {assignmentType}
                  </span>
                </div>

                {courseCode && (
                  <p className="text-sm font-bold tracking-wider text-neutral-700 mt-2">
                    {courseCode}
                  </p>
                )}

                <h1
                  className="text-[34px] font-serif font-extrabold uppercase mt-4 leading-tight"
                  style={{ color: primaryColor }}
                >
                  {subjectName}
                </h1>

                <DiamondDivider primaryColor={primaryColor} accentColor={accentColor} />
              </div>

              <div className="my-auto text-left">
                {renderSubmissionDetails()}
              </div>

              <div className="text-center pt-2">
                <h3 className="text-lg font-bold" style={{ color: primaryColor }}>
                  {departmentName}
                </h3>
                <p className="text-sm font-medium text-neutral-800">{universityName}</p>
                {session && (
                  <p className="text-xs text-neutral-500 mt-0.5">Session: {session}</p>
                )}
              </div>
            </div>

            {/* Bottom Emerald & Crimson Footer Ribbon */}
            <div className="w-full flex h-5">
              <div className="w-1/3 h-full" style={{ backgroundColor: accentColor }} />
              <div className="w-2/3 h-full" style={{ backgroundColor: primaryColor }} />
            </div>
          </div>
        )}

        {/* ----------------- THEME 6: EXECUTIVE BUSINESS REPORT ----------------- */}
        {themeId === 'executive-report' && (
          <div className="relative w-full h-full flex flex-col justify-between z-10">
            {/* Top Solid Corporate Banner */}
            <div
              className="w-full p-8 text-white flex justify-between items-center"
              style={{ backgroundColor: primaryColor }}
            >
              <div>
                <h2 className="text-xs uppercase tracking-widest font-semibold opacity-90">
                  {universityName}
                </h2>
                <h3 className="text-sm font-bold mt-0.5">{departmentName}</h3>
              </div>
              <div
                className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded"
                style={{ backgroundColor: accentColor, color: '#FFFFFF' }}
              >
                {assignmentType}
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between p-12 text-left">
              <div>
                {showLogo && (
                  <div className="mb-6">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt="Logo"
                        className="h-16 object-contain"
                      />
                    ) : (
                      <AcademicSealSvg primaryColor={primaryColor} size={60} />
                    )}
                  </div>
                )}

                {courseCode && (
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
                    Course Code: {courseCode}
                  </span>
                )}

                <h1 className="text-[34px] font-bold text-neutral-900 mt-2 leading-tight">
                  {subjectName}
                </h1>

                {topicSubtitle && (
                  <p className="text-sm text-neutral-600 mt-2 border-l-2 pl-3 py-0.5" style={{ borderColor: accentColor }}>
                    {topicSubtitle}
                  </p>
                )}

                <div className="w-full h-px bg-neutral-200 mt-6" />
              </div>

              <div className="my-auto">
                {renderSubmissionDetails()}
              </div>

              <div className="border-t border-neutral-200 pt-4 flex justify-between items-center text-xs text-neutral-500">
                <span>{universityName}</span>
                <span>{session ? `Academic Session: ${session}` : submissionDate}</span>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- THEME 7: CREATIVE PRESENTATION & GROUP ----------------- */}
        {themeId === 'creative-portfolio' && (
          <div className="relative w-full h-full flex flex-col justify-between p-12 z-10">
            {/* Top Geometric Corner Accents */}
            <div
              className="absolute top-0 right-0 w-44 h-44 pointer-events-none"
              style={{
                background: `linear-gradient(135deg, transparent 50%, ${primaryColor}15 50%)`,
              }}
            />

            <div className="flex justify-between items-start">
              <div>
                <span
                  className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest text-white rounded-md mb-2"
                  style={{ backgroundColor: primaryColor }}
                >
                  {assignmentType}
                </span>
                <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  {universityName}
                </h4>
              </div>

              {renderLogo()}
            </div>

            <div className="my-auto text-left">
              {courseCode && (
                <p className="text-sm font-mono font-bold tracking-wider" style={{ color: accentColor }}>
                  {courseCode}
                </p>
              )}
              <h1 className="text-[36px] font-black text-neutral-900 mt-1 leading-tight tracking-tight">
                {subjectName}
              </h1>
              {topicSubtitle && (
                <p className="text-base text-neutral-600 mt-2 max-w-[550px]">
                  {topicSubtitle}
                </p>
              )}

              <div className="w-20 h-1.5 rounded-full my-6" style={{ backgroundColor: accentColor }} />

              {renderSubmissionDetails()}
            </div>

            <div className="border-t-2 border-neutral-100 pt-4 flex justify-between items-center text-xs text-neutral-600">
              <span className="font-bold" style={{ color: primaryColor }}>
                {departmentName}
              </span>
              <span>{session ? `Session: ${session}` : submissionDate}</span>
            </div>
          </div>
        )}

        {/* ----------------- THEME 8: MEDICAL & LIFE SCIENCES ----------------- */}
        {themeId === 'medical-science' && (
          <div className="relative w-full h-full flex flex-col justify-between p-10 z-10">
            {/* Double Teal Frame */}
            <div
              className="absolute inset-8 pointer-events-none"
              style={{ border: `1.5px solid ${primaryColor}` }}
            />
            <div
              className="absolute inset-10 pointer-events-none"
              style={{ border: `0.5px solid ${accentColor}80` }}
            />

            <div className="relative z-10 w-full h-full flex flex-col justify-between py-8 px-10 text-center">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-600 mb-2">
                  {universityName}
                </h3>
                <h4 className="text-sm font-semibold" style={{ color: primaryColor }}>
                  {facultyName || departmentName}
                </h4>

                <div className="my-4">
                  {renderLogo()}
                </div>

                <div className="w-12 h-0.5 mx-auto mb-3" style={{ backgroundColor: accentColor }} />

                <span
                  className="text-xs uppercase tracking-widest font-bold px-3 py-1 rounded-full border inline-block"
                  style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
                >
                  {assignmentType}
                </span>

                {courseCode && (
                  <p className="text-xs font-mono font-bold tracking-widest text-neutral-600 uppercase mt-2">
                    COURSE: {courseCode}
                  </p>
                )}

                <h1
                  className="text-[32px] font-bold uppercase mt-4 leading-tight"
                  style={{ color: primaryColor }}
                >
                  {subjectName}
                </h1>

                {topicSubtitle && (
                  <p className="text-xs italic text-neutral-600 mt-2 max-w-[500px] mx-auto">
                    {topicSubtitle}
                  </p>
                )}

                <DiamondDivider primaryColor={primaryColor} accentColor={accentColor} />
              </div>

              <div className="my-auto text-left">
                {renderSubmissionDetails()}
              </div>

              <div className="border-t border-neutral-200 pt-3 text-center">
                <p className="text-sm font-bold" style={{ color: primaryColor }}>
                  {departmentName}
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {universityName} {session && `• Session: ${session}`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

CoverPreview.displayName = 'CoverPreview';
