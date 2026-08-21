import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { RechartsTooltip } from './recharts-tooltip';
import { useIsMobile } from '../../hooks/useIsMobile';

export interface BarPoint {
  label: string;
  value: number;
  playerId?: number;
}

interface MonoRoundedBarChartProps {
  data: BarPoint[];
  height?: number;
  onBarClick?: (entry: BarPoint) => void;
}

const BAR_COLORS = ['#5A5A40', '#7B8B6F', '#D2B48C'];

export function MonoRoundedBarChart({ data, height = 220, onBarClick }: MonoRoundedBarChartProps) {
  const isMobile = useIsMobile();

  const handleBarClick = (entry: unknown) => {
    if (!onBarClick) return;
    const payload = (entry as { payload?: BarPoint } | null)?.payload;
    if (payload) {
      onBarClick(payload);
    }
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 12, right: 12, left: -22, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="2 2"
            vertical={false}
            stroke="rgba(90,90,64,0.06)"
          />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#8D8D7E' }}
            interval={0}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#8D8D7E' }}
          />
          <Tooltip content={<RechartsTooltip indicator="dot" />} cursor={{ fill: 'rgba(90,90,64,0.04)' }} />
          <Bar
            dataKey="value"
            name="Goles"
            radius={[8, 8, 8, 8]}
            barSize={onBarClick ? 22 : 16}
            isAnimationActive={!isMobile}
            animationDuration={isMobile ? 0 : 800}
            onClick={onBarClick ? handleBarClick : undefined}
            className={onBarClick ? 'cursor-pointer' : undefined}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={BAR_COLORS[index % BAR_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}