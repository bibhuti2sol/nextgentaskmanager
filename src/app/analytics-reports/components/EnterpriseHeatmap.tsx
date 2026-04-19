'use client';

import React from 'react';

interface UserUtilization {
  name: string;
  weeks: number[]; // Percentages
}

interface EnterpriseHeatmapProps {
  data: UserUtilization[];
}

const EnterpriseHeatmap = ({ data }: EnterpriseHeatmapProps) => {
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'];

  const getCellColor = (value: number) => {
    if (value >= 80) return 'bg-red-500/80 text-white';
    if (value >= 60) return 'bg-orange-400 text-white';
    if (value >= 40) return 'bg-yellow-400 text-foreground';
    if (value >= 20) return 'bg-green-400 text-foreground';
    return 'bg-green-500 text-white';
  };

  return (
    <div className="bg-white border border-border rounded-lg p-6 h-full shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h3 className="font-heading font-bold text-base">Resource Utilization Heatmap</h3>
           <p className="text-xs text-muted-foreground">% of hours billed against tasks</p>
        </div>
        <div className="text-[10px] text-muted-foreground font-medium uppercase">Weeks / Months</div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left py-2 px-3 text-[10px] font-semibold text-muted-foreground uppercase bg-muted/20 w-[120px]">Team</th>
              {weeks.map(w => (
                <th key={w} className="text-center py-2 px-2 text-[10px] font-semibold text-muted-foreground uppercase bg-muted/20">{w}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((user, idx) => (
              <tr key={idx} className="hover:bg-muted/5 transition-colors">
                <td className="py-3 px-3">
                  <span className="text-xs font-medium text-foreground">{user.name}</span>
                </td>
                {user.weeks.map((val, wIdx) => (
                  <td key={wIdx} className="p-0.5">
                    <div className={`h-8 flex items-center justify-center rounded-sm text-[10px] font-bold ${getCellColor(val)} transition-all hover:scale-[1.05]`}>
                      {val}%
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 flex justify-end items-center gap-4 border-t border-border pt-4">
         <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm bg-green-500" />
            <span className="text-[9px] font-medium text-muted-foreground">Optimal</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm bg-orange-400" />
            <span className="text-[9px] font-medium text-muted-foreground">Warning</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm bg-red-500" />
            <span className="text-[9px] font-medium text-muted-foreground">Critical</span>
         </div>
      </div>
    </div>
  );
};

export default EnterpriseHeatmap;
