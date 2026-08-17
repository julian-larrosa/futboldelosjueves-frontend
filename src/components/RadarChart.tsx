import React from 'react';
import { PlayerAttributes } from '../types';

interface RadarChartProps {
  attributes: PlayerAttributes;
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ attributes }) => {
  // Attributes: Definición (top), Pase (top-right), Técnica (bottom-right), Mentalidad (bottom-left), Físico (top-left)
  // Max scale is 10
  const maxVal = 10;
  const cx = 50;
  const cy = 50;
  const r = 40; // max radius

  // Angles for 5 points (pentagon starting at top -90 deg):
  // 0: Definición (-90 deg = 50, 10)
  // 1: Pase (-18 deg = 50 + r*cos(-18°), 50 + r*sin(-18°)) -> approx (88, 37.6)
  // 2: Técnica (54 deg = 50 + r*cos(54°), 50 + r*sin(54°)) -> approx (73.5, 82.4)
  // 3: Mentalidad (126 deg = 50 + r*cos(126°), 50 + r*sin(126°)) -> approx (26.5, 82.4)
  // 4: Físico (198 deg = 50 + r*cos(198°), 50 + r*sin(198°)) -> approx (12, 37.6)

  const getCoordinates = (val: number, angleDeg: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    const currentR = (val / maxVal) * r;
    const x = cx + currentR * Math.cos(rad);
    const y = cy + currentR * Math.sin(rad);
    return { x, y };
  };

  const p0 = getCoordinates(attributes.definicion, -90);
  const p1 = getCoordinates(attributes.pase, -18);
  const p2 = getCoordinates(attributes.tecnica, 54);
  const p3 = getCoordinates(attributes.mentalidad, 126);
  const p4 = getCoordinates(attributes.fisico, 198);

  const polygonPoints = `${p0.x},${p0.y} ${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`;

  // Guide pentagons at 100% and 50%
  const g100 = [
    getCoordinates(10, -90),
    getCoordinates(10, -18),
    getCoordinates(10, 54),
    getCoordinates(10, 126),
    getCoordinates(10, 198),
  ].map((p) => `${p.x},${p.y}`).join(' ');

  const g50 = [
    getCoordinates(5, -90),
    getCoordinates(5, -18),
    getCoordinates(5, 54),
    getCoordinates(5, 126),
    getCoordinates(5, 198),
  ].map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="relative w-full max-w-[280px] mx-auto aspect-square flex items-center justify-center">
      {/* Background Guides */}
      <svg className="w-full h-full absolute inset-0 overflow-visible text-[#DCD6C8] opacity-60" viewBox="0 0 100 100">
        <polygon fill="none" points={g100} stroke="currentColor" strokeWidth="0.75" />
        <polygon fill="none" points={g50} stroke="currentColor" strokeWidth="0.75" />
        {/* Axes */}
        <line x1="50" y1="50" x2={getCoordinates(10, -90).x} y2={getCoordinates(10, -90).y} stroke="currentColor" strokeWidth="0.5" />
        <line x1="50" y1="50" x2={getCoordinates(10, -18).x} y2={getCoordinates(10, -18).y} stroke="currentColor" strokeWidth="0.5" />
        <line x1="50" y1="50" x2={getCoordinates(10, 54).x} y2={getCoordinates(10, 54).y} stroke="currentColor" strokeWidth="0.5" />
        <line x1="50" y1="50" x2={getCoordinates(10, 126).x} y2={getCoordinates(10, 126).y} stroke="currentColor" strokeWidth="0.5" />
        <line x1="50" y1="50" x2={getCoordinates(10, 198).x} y2={getCoordinates(10, 198).y} stroke="currentColor" strokeWidth="0.5" />
      </svg>

      {/* Data Polygon with glow and dots */}
      <svg className="w-full h-full absolute inset-0 overflow-visible z-10 drop-shadow-xs" viewBox="0 0 100 100">
        <polygon
          points={polygonPoints}
          className="fill-[#7B8B6F] text-[#7B8B6F]"
          style={{ fillOpacity: 0.28, strokeWidth: '2.5px', stroke: '#5A5A40', strokeLinejoin: 'round' }}
        />
        <circle cx={p0.x} cy={p0.y} r="3" className="fill-[#5A5A40] stroke-white stroke-1" />
        <circle cx={p1.x} cy={p1.y} r="3" className="fill-[#5A5A40] stroke-white stroke-1" />
        <circle cx={p2.x} cy={p2.y} r="3" className="fill-[#5A5A40] stroke-white stroke-1" />
        <circle cx={p3.x} cy={p3.y} r="3" className="fill-[#5A5A40] stroke-white stroke-1" />
        <circle cx={p4.x} cy={p4.y} r="3" className="fill-[#5A5A40] stroke-white stroke-1" />
      </svg>

      {/* Metric Labels with exact values */}
      <div className="absolute w-full h-full pointer-events-none">
        <span className="absolute top-[-4%] left-1/2 -translate-x-1/2 font-mono text-[11px] font-bold text-[#5A5A40] whitespace-nowrap bg-white/95 px-2 py-0.5 rounded-full shadow-xs border border-[#EBE7DF]">
          Definición ({attributes.definicion})
        </span>
        <span className="absolute top-[32%] right-[-14%] translate-x-1/2 font-mono text-[11px] font-bold text-[#5A5A40] whitespace-nowrap bg-white/95 px-2 py-0.5 rounded-full shadow-xs border border-[#EBE7DF]">
          Pase ({attributes.pase})
        </span>
        <span className="absolute bottom-[-4%] right-[4%] font-mono text-[11px] font-bold text-[#5A5A40] whitespace-nowrap bg-white/95 px-2 py-0.5 rounded-full shadow-xs border border-[#EBE7DF]">
          Técnica ({attributes.tecnica})
        </span>
        <span className="absolute bottom-[-4%] left-[4%] font-mono text-[11px] font-bold text-[#5A5A40] whitespace-nowrap bg-white/95 px-2 py-0.5 rounded-full shadow-xs border border-[#EBE7DF]">
          Mentalidad ({attributes.mentalidad})
        </span>
        <span className="absolute top-[32%] left-[-14%] -translate-x-1/2 font-mono text-[11px] font-bold text-[#5A5A40] whitespace-nowrap bg-white/95 px-2 py-0.5 rounded-full shadow-xs border border-[#EBE7DF]">
          Físico ({attributes.fisico})
        </span>
      </div>
    </div>
  );
};
