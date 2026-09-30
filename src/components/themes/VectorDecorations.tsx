import React from 'react';

interface CornerRibbonProps {
  primaryColor?: string;
  accentColor?: string;
  className?: string;
  position?: 'top-left' | 'bottom-right';
}

/**
 * Exact reproduction of the signature FCUB corner swoop ribbons from the user's cover demo:
 * Multi-layer curving ribbons in emerald green, crisp white separation, and vibrant red arc.
 */
export const FcubCornerRibbon: React.FC<CornerRibbonProps> = ({
  primaryColor = '#005A36',
  accentColor = '#E31B23',
  className = '',
  position = 'top-left',
}) => {
  const isBottomRight = position === 'bottom-right';

  return (
    <div
      className={`absolute pointer-events-none select-none z-10 ${
        isBottomRight
          ? 'bottom-0 right-0 rotate-180 origin-center'
          : 'top-0 left-0'
      } ${className}`}
      style={{ width: '220px', height: '220px' }}
    >
      <svg
        viewBox="0 0 240 240"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Layer 1: Outermost dark green sweeping solid corner wedge */}
        <path
          d="M0 0 L150 0 C110 35 45 105 0 165 Z"
          fill={primaryColor}
        />

        {/* White separation stripe 1 */}
        <path
          d="M148 0 C108 36 44 106 0 166 L0 173 C46 112 112 41 155 0 Z"
          fill="#FFFFFF"
        />

        {/* Layer 2: Radiant red middle ribbon */}
        <path
          d="M154 0 C111 41 45 112 0 173 L0 200 C55 130 128 49 178 0 Z"
          fill={accentColor}
        />

        {/* White separation stripe 2 */}
        <path
          d="M177 0 C127 49 54 130 0 200 L0 207 C57 136 131 54 184 0 Z"
          fill="#FFFFFF"
        />

        {/* Layer 3: Inner dark green ribbon stripe */}
        <path
          d="M183 0 C130 54 56 136 0 207 L0 220 C60 146 138 60 196 0 Z"
          fill={primaryColor}
        />

        {/* Micro white highlight stripe */}
        <path
          d="M195 0 C137 60 59 146 0 220 L0 223 C61 148 140 62 199 0 Z"
          fill="#FFFFFF"
        />

        {/* Outer fine green tracer thread */}
        <path
          d="M198 0 C139 62 60 148 0 223 L0 228 C62 152 143 65 204 0 Z"
          fill={primaryColor}
          opacity="0.9"
        />
      </svg>
    </div>
  );
};

/**
 * 3-Diamond divider rule matching the user's attached cover image:
 * [Green Diamond] [Red Diamond] [Black Diamond] with horizontal flanking rules
 */
export const DiamondDivider: React.FC<{
  primaryColor?: string;
  accentColor?: string;
  className?: string;
}> = ({ primaryColor = '#005A36', accentColor = '#E31B23', className = '' }) => {
  return (
    <div className={`flex items-center justify-center gap-3 w-full my-4 ${className}`}>
      {/* Left line */}
      <div
        className="h-[1.5px] flex-1 max-w-[120px]"
        style={{ backgroundColor: primaryColor }}
      />

      {/* 3 Diamonds */}
      <div className="flex items-center gap-2">
        <span
          className="inline-block w-2.5 h-2.5 rotate-45 transform transition-transform"
          style={{ backgroundColor: primaryColor }}
        />
        <span
          className="inline-block w-2.5 h-2.5 rotate-45 transform transition-transform"
          style={{ backgroundColor: accentColor }}
        />
        <span
          className="inline-block w-2.5 h-2.5 rotate-45 transform transition-transform bg-neutral-900"
        />
      </div>

      {/* Right line */}
      <div
        className="h-[1.5px] flex-1 max-w-[120px]"
        style={{ backgroundColor: primaryColor }}
      />
    </div>
  );
};

/**
 * Classical Ivy Corner Ornaments for Royal Crest theme
 */
export const ClassicalCornerOrnaments: React.FC<{
  color?: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}> = ({ color = '#C5A059', position }) => {
  const positionClasses = {
    'top-left': 'top-5 left-5',
    'top-right': 'top-5 right-5 rotate-90',
    'bottom-right': 'bottom-5 right-5 rotate-180',
    'bottom-left': 'bottom-5 left-5 -rotate-90',
  };

  return (
    <div className={`absolute pointer-events-none ${positionClasses[position]}`}>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path
          d="M2 46V12C2 6.47715 6.47715 2 12 2H46"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M8 44V14C8 10.6863 10.6863 8 14 8H44"
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="16" cy="16" r="3.5" fill={color} />
        <path
          d="M2 18C10 18 18 10 18 2"
          stroke={color}
          strokeWidth="1"
        />
      </svg>
    </div>
  );
};

/**
 * Universal Academic Crest vector fallback / seal
 */
export const AcademicSealSvg: React.FC<{
  primaryColor?: string;
  size?: number;
  className?: string;
}> = ({ primaryColor = '#005A36', size = 80, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="50" cy="50" r="46" stroke={primaryColor} strokeWidth="3" />
      <circle cx="50" cy="50" r="41" stroke={primaryColor} strokeWidth="1" strokeDasharray="2 2" />
      {/* Shield */}
      <path
        d="M50 16L72 26V46C72 63 62 76 50 82C38 76 28 63 28 46V26L50 16Z"
        fill="white"
        stroke={primaryColor}
        strokeWidth="2.5"
      />
      {/* Open Book */}
      <path
        d="M38 52C42 49 46 50 50 52C54 50 58 49 62 52V62C58 59 54 60 50 62C46 60 42 59 38 62V52Z"
        fill={primaryColor}
        opacity="0.9"
      />
      {/* Torch of Knowledge */}
      <path
        d="M48 30H52V42H48V30Z"
        fill={primaryColor}
      />
      <path
        d="M50 24C52 27 54 28 50 31C46 28 48 27 50 24Z"
        fill="#E31B23"
      />
    </svg>
  );
};
