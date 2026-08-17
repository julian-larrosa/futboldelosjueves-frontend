import React from 'react';
import { matchesApi } from '../api';
import { useApi } from '../hooks/useApi';

interface YearSelectorProps {
  value?: number;
  onChange: (year?: number) => void;
}

function extractYears(fechaHoras: string[]): number[] {
  const years = new Set<number>();
  for (const fecha of fechaHoras) {
    const year = new Date(fecha).getFullYear();
    if (!Number.isNaN(year)) {
      years.add(year);
    }
  }
  return [...years].sort((a, b) => b - a);
}

export const YearSelector: React.FC<YearSelectorProps> = ({ value, onChange }) => {
  const fetcher = React.useCallback(() => matchesApi.list({ size: 200 }), []);
  const { data } = useApi(fetcher);

  const years = extractYears((data?.content ?? []).map((m) => m.fechaHora));

  const options: Array<{ label: string; value: string }> = [
    { label: 'Histórico', value: 'historico' },
    ...years.map((year) => ({ label: String(year), value: String(year) })),
  ];

  const current = value === undefined ? 'historico' : String(value);

  return (
    <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
      <span className="material-symbols-outlined text-[18px] text-[#7B8B6F]">calendar_month</span>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() =>
            onChange(option.value === 'historico' ? undefined : Number(option.value))
          }
          className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border ${
            current === option.value
              ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-xs'
              : 'bg-white text-[#8D8D7E] border-[#EBE7DF] hover:bg-[#F1EFE7] hover:text-[#5A5A40]'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};