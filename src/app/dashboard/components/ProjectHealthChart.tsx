'use client';

import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  LabelList,
} from 'recharts';

interface Project {
  id: number;
  name: string;
  healthScore: number;
  tasksCompleted: number;
  totalTasks: number;
  status: 'On Track' | 'At Risk' | 'Delayed';
}

interface ProjectHealthChartProps {
  projects: Project[];
}

const ProjectHealthChart = ({ projects }: ProjectHealthChartProps) => {
  // Transform data for the chart
  const chartData = projects.map((project) => ({
    name: project.name,
    completed: project.tasksCompleted,
    total: project.totalTasks,
    remaining: Math.max(0, project.totalTasks - project.tasksCompleted),
    health: project.healthScore,
    status: project.status,
    healthTrack: 100, // Background track showing 100% capacity
    taskTrack: project.totalTasks, // Background track showing total task goal
  }));

  const getStatusGradient = (status: string) => {
    switch (status) {
      case 'On Track': return 'url(#gradientOnTrack)'; // Modern Indigo/Blue
      case 'At Risk': return 'url(#gradientAtRisk)'; // Modern Amber
      case 'Delayed': return 'url(#gradientDelayed)'; // Modern Rose
      default: return '#94A3B8'; // Slate
    }
  };

  return (
    <div className="w-full h-[380px]" aria-label="Modern Professional Project Health Chart">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          layout="vertical"
          data={chartData}
          margin={{ top: 10, right: 45, left: 10, bottom: 0 }}
          barGap={6}
        >
          <defs>
            <linearGradient id="gradientOnTrack" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#818CF8" />
            </linearGradient>
            <linearGradient id="gradientAtRisk" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#FB7185" />
            </linearGradient>
            <linearGradient id="gradientDelayed" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#E11D48" />
              <stop offset="100%" stopColor="#FB7185" />
            </linearGradient>
            <linearGradient id="gradientProgress" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--color-border)" opacity={0.15} />
          
          <XAxis type="number" xAxisId="tasks" hide />
          <XAxis type="number" xAxisId="health" domain={[0, 100]} hide />

          <YAxis
            dataKey="name"
            type="category"
            width={120}
            tick={{ fill: 'var(--color-foreground)', fontSize: 10, fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
          />
          
          <Tooltip
            cursor={{ fill: 'var(--color-muted)', opacity: 0.1 }}
            contentStyle={{
              backgroundColor: 'rgba(var(--color-card-rgb), 0.9)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              padding: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            }}
          />
          
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ paddingBottom: '20px', fontSize: '10px' }}
            formatter={(value) => <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{value}</span>}
          />
          
          {/* Health Score Component */}
          {/* Background Track (representing 100% goal) - Using a subtle slate-indigo */}
          <Bar
            dataKey="healthTrack"
            xAxisId="health"
            barSize={16}
            fill="#F1F5F9" // slate-100
            radius={[8, 8, 8, 8]}
            isAnimationActive={false}
          />
          <Bar
            dataKey="health"
            name="Health Score"
            xAxisId="health"
            barSize={16}
            radius={[8, 8, 8, 8]}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-health-${index}`} fill={getStatusGradient(entry.status)} />
            ))}
            <LabelList 
              dataKey="health" 
              position="right" 
              formatter={(val: number) => `${val}%`}
              style={{ fill: 'var(--color-foreground)', fontSize: 11, fontWeight: 800 }}
              offset={12}
            />
          </Bar>

          {/* Spacer between metric groups */}
          <Bar dataKey="none" barSize={8} xAxisId="health" />

          {/* Task Progress Component */}
          {/* Background Track (representing Total Tasks goal) - Using a lighter slate */}
          <Bar
            dataKey="taskTrack"
            xAxisId="tasks"
            barSize={10}
            fill="#F8FAFC" // slate-50
            radius={[5, 5, 5, 5]}
            isAnimationActive={false}
          />
          <Bar
            dataKey="completed"
            name="Tasks Completed"
            xAxisId="tasks"
            barSize={10}
            fill="url(#gradientProgress)"
            radius={[5, 5, 5, 5]}
          >
            <LabelList 
              dataKey="completed" 
              position="right" 
              content={(props: any) => {
                const { x, y, value, offset } = props;
                const totalTasks = chartData[props.index].total;
                return (
                  <text x={x + props.width + 12} y={y + 8} fill="var(--color-muted-foreground)" fontSize={10} fontWeight={700}>
                    {value}/{totalTasks}
                  </text>
                );
              }}
            />
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>


  );
};

export default ProjectHealthChart;
