import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { RechartsTooltip } from './recharts-tooltip';
import { useIsMobile } from '../../hooks/useIsMobile';

export interface LinePoint {
  label: string;
  value: number;
  secondary?: number;
}

interface MonoRoundedLineChartProps {
  data: LinePoint[];
  height?: number;
  yDomain?: [number, number];
}

export function MonoRoundedLineChart({
  data,
  height = 220,
  yDomain = [0, 10],
}: MonoRoundedLineChartProps) {
  const isMobile = useIsMobile();
  const hasSecondary = data.some((point) => point.secondary !== undefined);

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 12, right: 12, left: -22, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="rgba(90,90,64,0.06)"
          />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#8D8D7E' }}
            interval="preserveStartEnd"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            domain={yDomain}
            tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#8D8D7E' }}
          />
          <Tooltip content={<RechartsTooltip indicator="dot" />} />

          {hasSecondary && (
            <Line
              type="monotone"
              dataKey="secondary"
              name="Referencia"
              stroke="#D2B48C"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="4 4"
              dot={false}
              isAnimationActive={!isMobile}
              animationDuration={isMobile ? 0 : 900}
            />
          )}

          <Line
            type="monotone"
            dataKey="value"
            name="Valoración"
            stroke="#5A5A40"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            dot={{
              r: 4,
              fill: '#5A5A40',
              stroke: '#FFFFFF',
              strokeWidth: 2,
            }}
            activeDot={{
              r: 6,
              fill: '#7B8B6F',
              stroke: '#FFFFFF',
              strokeWidth: 2,
            }}
            isAnimationActive={!isMobile}
            animationDuration={isMobile ? 0 : 800}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}