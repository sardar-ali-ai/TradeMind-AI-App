import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { MarketData } from '../types';

interface MarketChartProps {
  data: MarketData[];
}

export const MarketChart: React.FC<MarketChartProps> = ({ data }) => {
  return (
    <div className="h-full w-full bg-[#0a0a0a] min-h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00FF41" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#00FF41" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="#1a1a1a" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#333" 
            fontSize={9} 
            tickFormatter={(val) => val.split(':')[1] + ':' + val.split(':')[2]}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#333" 
            fontSize={9} 
            domain={['auto', 'auto']}
            orientation="right"
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#111', 
              border: '1px solid #333', 
              fontSize: '10px', 
              color: '#fff',
              fontFamily: 'monospace'
            }}
            itemStyle={{ color: '#00FF41' }}
            cursor={{ stroke: '#00FF41', strokeWidth: 1 }}
          />
          <Area 
            type="stepAfter" 
            dataKey="price" 
            stroke="#00FF41" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
