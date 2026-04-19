'use client';

import React from 'react';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// 1. Enterprise Metric Card with Sparkline
interface EnterpriseMetricCardProps {
  title: string;
  primaryValue: string | number;
  primaryLabel: string;
  secondaryValue?: string | number;
  secondaryLabel?: string;
  chartData: any[];
  chartType: 'line' | 'bar';
}

export const EnterpriseMetricCard = ({ 
  title, 
  primaryValue, 
  primaryLabel, 
  secondaryValue, 
  secondaryLabel, 
  chartData, 
  chartType 
}: EnterpriseMetricCardProps) => (
  <div className="bg-white border border-border rounded-lg p-5 flex flex-col h-full shadow-sm">
    <h3 className="font-caption text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider">{title}</h3>
    <div className="flex justify-between items-end gap-4 mb-4">
      <div>
        <div className="text-3xl font-heading font-bold text-foreground">{primaryValue}</div>
        <div className="text-[10px] text-muted-foreground font-medium uppercase">{primaryLabel}</div>
      </div>
      {secondaryValue && (
        <div className="text-right">
          <div className="text-3xl font-heading font-bold text-foreground">{secondaryValue}</div>
          <div className="text-[10px] text-muted-foreground font-medium uppercase">{secondaryLabel}</div>
        </div>
      )}
    </div>
    <div className="flex-1 min-h-[60px]">
      <ResponsiveContainer width="100%" height="80%">
        {chartType === 'line' ? (
          <LineChart data={chartData}>
            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
          </LineChart>
        ) : (
          <BarChart data={chartData}>
            <Bar dataKey="value" fill="#3b82f6" radius={[2, 2, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
      {chartType === 'bar' && <div className="text-[9px] text-muted-foreground text-center mt-1 font-medium">Distribution by Cycle Time</div>}
    </div>
  </div>
);

// 2. Risk Gauge Chart
export const RiskGauge = ({ value, label }: { value: number; label: string }) => {
  const rotation = (value / 100) * 180 - 90;
  return (
    <div className="bg-white border border-border rounded-lg p-5 flex flex-col h-full shadow-sm">
      <h3 className="font-caption text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Resource Overload Risk Index</h3>
      <div className="flex flex-col items-center justify-center flex-1 py-4">
        <div className="relative w-48 h-24 overflow-hidden">
          {/* Gauge Background (Rainbow/Zones) */}
          <div className="absolute top-0 w-48 h-48 rounded-full border-[12px] border-t-transparent border-x-transparent border-b-transparent rotate-45" 
               style={{ background: 'conic-gradient(from 0deg at 50% 100%, #22c55e 0deg 60deg, #eab308 60deg 120deg, #ef4444 120deg 180deg)' }}>
          </div>
          {/* Mask for semi-circle */}
          <div className="absolute top-[12px] left-[12px] w-[168px] h-[168px] bg-white rounded-full z-10" />
          
          {/* Needle */}
          <div className="absolute bottom-0 left-1/2 w-1 h-20 bg-foreground origin-bottom z-20 transition-transform duration-1000 ease-out"
               style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-foreground rounded-full z-30" />
        </div>
        <div className="mt-4 text-center">
           <p className="text-xl font-heading font-bold text-foreground">{label}</p>
           <p className="text-[10px] text-muted-foreground font-medium uppercase">Severity Status</p>
        </div>
      </div>
    </div>
  );
};

// 3. Bottleneck Analysis Chart
export const BottleneckChart = ({ data }: { data: any[] }) => (
  <div className="bg-white border border-border rounded-lg p-6 h-full shadow-sm flex flex-col">
    <div className="flex items-center justify-between mb-8">
      <div>
        <h3 className="font-heading font-bold text-base">Productivity & Bottleneck Analysis</h3>
        <p className="text-xs text-muted-foreground">Task Cycle Time by Stage</p>
      </div>
      <div className="flex gap-2">
         <button className="px-3 py-1 bg-muted rounded text-[10px] font-medium border border-border hover:bg-muted/80">Drill down ▾</button>
         <button className="px-3 py-1 bg-muted rounded text-[10px] font-medium border border-border hover:bg-muted/80">By Team ▾</button>
      </div>
    </div>
    
    <div className="flex-1">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
          <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
          <Bar dataKey="analysis" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
          <Bar dataKey="dev" stackId="a" fill="#2dd4bf" />
          <Bar dataKey="test" stackId="a" fill="#eab308" />
          <Bar dataKey="deploy" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
    <div className="flex justify-center gap-6 mt-6 pb-2">
       {['Analysis', 'Dev', 'Test', 'Deploy'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-sm`} style={{ backgroundColor: ['#3b82f6', '#2dd4bf', '#eab308', '#f43f5e'][i] }} />
            <span className="text-[10px] font-medium text-muted-foreground">{s}</span>
          </div>
       ))}
    </div>
  </div>
);
