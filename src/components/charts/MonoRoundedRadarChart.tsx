import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
} from 'recharts';
import { RechartsTooltip } from './recharts-tooltip';
import { useIsMobile } from '../../hooks/useIsMobile';

export interface RadarPoint {
  subject: string;
  metric: number;
}

interface MonoRoundedRadarChartProps {
  data: RadarPoint[];
  height?: number;
}

export function MonoRoundedRadarChart({ data, height = 200 }: MonoRoundedRadarChartProps) {
  const isMobile = useIsMobile();

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="rgba(90,90,64,0.12)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#8D8D7E' }}
          />
          <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
          <Tooltip content={<RechartsTooltip indicator="dot" />} />
          <Radar
            name="Valor"
            dataKey="metric"
            stroke="#5A5A40"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(90,90,64,0.15)"
            isAnimationActive={!isMobile}
            animationDuration={isMobile ? 0 : 800}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}