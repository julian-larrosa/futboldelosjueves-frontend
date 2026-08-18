import React from 'react';

export interface RechartsTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  indicator?: 'dot' | 'line' | 'dashed';
  formatter?: (value: any, name: string) => React.ReactNode;
}

export function RechartsTooltip({
  active,
  payload,
  label,
  indicator = 'dot',
  formatter,
}: RechartsTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="px-3 py-2 rounded-xl text-xs shadow-2xl backdrop-blur-md border transition-all pointer-events-none font-mono z-50 bg-white/95 border-[#EBE7DF] text-[#4A4A3F]">
      {label && (
        <div className="font-bold mb-1.5 pb-1 border-b border-[#EBE7DF] tracking-tight text-[#5A5A40]">
          {label}
        </div>
      )}
      <div className="flex flex-col gap-1">
        {payload.map((item, idx) => {
          const color = item.color || item.fill || '#5A5A40';
          const valueDisplay = formatter
            ? formatter(item.value, item.name)
            : typeof item.value === 'number'
            ? item.value.toLocaleString('es-AR')
            : item.value;

          return (
            <div key={idx} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                {indicator === 'dot' && (
                  <span
                    className="w-2 h-2 rounded-full ring-1 ring-white/30"
                    style={{ backgroundColor: color }}
                  />
                )}
                {indicator === 'line' && (
                  <span
                    className="w-2.5 h-0.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                )}
                <span className="font-normal text-[#8D8D7E]">
                  {item.name || item.dataKey}:
                </span>
              </div>
              <span className="font-bold tabular-nums text-[#5A5A40]">
                {valueDisplay}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}