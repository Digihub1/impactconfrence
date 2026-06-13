import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = '', size = 80 }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        className="text-white drop-shadow-[0_4px_10px_rgba(239,68,68,0.3)] transition-transform duration-300 hover:scale-105"
        aria-label="Deliverance Church International Logo"
      >
        <circle cx="100" cy="100" r="95" fill="#0b132b" stroke="#e11d48" strokeWidth="4" />
        <circle cx="100" cy="100" r="85" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
        
        {/* Curved text for top */}
        <path
          id="top-curve"
          d="M 25 100 A 75 75 0 0 1 175 100"
          fill="none"
          stroke="none"
        />
        <text className="font-sans text-[11px] font-bold tracking-[0.08em] fill-white uppercase">
          <textPath href="#top-curve" startOffset="50%" textAnchor="middle">
            Deliverance Church International
          </textPath>
        </text>

        {/* Circular Banner Overlay */}
        <circle cx="100" cy="100" r="50" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="2" />
        
        {/* Cross Icon */}
        <g stroke="#ef4444" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Vertical line of cross */}
          <line x1="100" y1="70" x2="100" y2="125" />
          {/* Horizontal line of cross */}
          <line x1="82" y1="88" x2="118" y2="88" />
          {/* Arching canopy resembling the logo outline */}
          <path d="M 80,123 L 100,103 L 120,123" stroke="#f59e0b" strokeWidth="3" />
        </g>

        {/* Luke 4:18 text */}
        <text
          x="100"
          y="150"
          textAnchor="middle"
          className="font-sans text-[11px] font-extrabold tracking-wider fill-amber-400"
        >
          LUKE 4:18
        </text>

        {/* Curved text for bottom */}
        <path
          id="bottom-curve"
          d="M 175 100 A 75 75 0 0 1 25 100"
          fill="none"
          stroke="none"
        />
        <text className="font-sans text-[10px] font-bold tracking-[0.14em] fill-amber-400 uppercase">
          <textPath href="#bottom-curve" startOffset="50%" textAnchor="middle">
            The Church of Choice
          </textPath>
        </text>
      </svg>
      <div className="flex flex-col">
        <span className="font-serif text-sm font-black tracking-widest text-[#ef4444] leading-tight sm:text-base">
          DELIVERANCE
        </span>
        <span className="font-sans text-[10px] font-bold tracking-[0.25em] text-slate-600 leading-none">
          CHURCH INTERNATIONAL
        </span>
      </div>
    </div>
  );
}
