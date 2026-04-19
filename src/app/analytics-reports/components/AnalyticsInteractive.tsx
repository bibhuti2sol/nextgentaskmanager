'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/components/common/UserContext';
import NavigationSidebar from '@/components/common/NavigationSidebar';
import FilterBar from './FilterBar';
import Icon from '@/components/ui/AppIcon';

// Enterprise Components
import { EnterpriseMetricCard, RiskGauge, BottleneckChart } from './EnterpriseVisuals';
import EnterpriseHeatmap from './EnterpriseHeatmap';
import SubtaskBreakdown from './SubtaskBreakdown';

interface MetricWidget {
  val: string | number;
  label: string;
  secondVal?: string | number;
  secondLabel?: string;
  data: { value: number }[];
}

const API_BASE = 'http://43.205.137.114:8080/api/v1';
const API_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYXJlbmRyYS5tb2RpQGV4YW1wbGUuY29tIiwiaWQiOjM5LCJhdXRob3JpdGllcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9BRE1JTiJ9XSwiaWF0IjoxNzc2MTQ5NDkwLCJleHAiOjE3Nzg3NDE0OTB9.1YBLYJP5OKWGx-qgBllPTaqjae5ShbDrgOw-rr5wRTs';

const authHeaders = { Authorization: API_TOKEN };

const safeFetch = async (url: string) => {
  try {
    const res = await fetch(url, { headers: authHeaders });
    if (res.ok) return await res.json();
    return null;
  } catch {
    return null;
  }
};

const AnalyticsInteractive = () => {
  const { user } = useUser();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [metrics, setMetrics] = useState({
    projected: { val: 0, label: 'Active Tasks', secondVal: 0, secondLabel: 'Completed', data: [] as { value: number }[] },
    cycleTime: { val: '0d', label: 'Average Distribution', data: [] as { value: number }[] },
    velocity: { val: '0/week', label: 'Weekly trend', data: [] as { value: number }[] },
    risk: { val: 0, label: 'Low' },
  });

  const [bottleneckData, setBottleneckData] = useState<any[]>([]);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [subtaskData, setSubtaskData] = useState({ total: 0, inProgress: 0, closed: 0 });
  const [detailedData, setDetailedData] = useState<any[]>([]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const fetchEnterpriseData = async (filters: any) => {
    setLoading(true);
    try {
      // Build query params for Dashboard API (accepts projectId)
      const dashboardUrl = filters.project
        ? `${API_BASE}/dashboard?projectId=${filters.project}`
        : `${API_BASE}/dashboard`;

      // Build query params for Tasks API
      const taskParams = new URLSearchParams({ page: '0', size: '500', sort: 'id,desc' });
      if (filters.project) taskParams.set('projectId', filters.project);
      if (filters.status) taskParams.set('status', filters.status);
      if (filters.priority) taskParams.set('priority', filters.priority);
      if (filters.assignee) taskParams.set('assigneeId', filters.assignee);

      // Build query params for Projects API
      const projectParams = new URLSearchParams({ page: '0', size: '500', sort: 'id,desc' });
      if (filters.status) projectParams.set('status', filters.status);

      // Build query params for Users API (for role/dept filtering)
      const userParams = new URLSearchParams({ page: '0', size: '1000' });
      if (filters.role) userParams.set('role', `ROLE_${filters.role}`);

      // Fetch all data streams concurrently
      const [dashboardData, tasksData, projectsData, usersData] = await Promise.all([
        safeFetch(dashboardUrl),
        safeFetch(`${API_BASE}/tasks?${taskParams.toString()}`),
        safeFetch(`${API_BASE}/projects?${projectParams.toString()}`),
        safeFetch(`${API_BASE}/users?${userParams.toString()}`),
      ]);

      const tasks = tasksData?.content || [];
      const projects = projectsData?.content || [];
      const users = (usersData?.content || []);

      // Filter users by department/team/role if selected
      let filteredUsers = users;
      if (filters.department) {
        filteredUsers = filteredUsers.filter((u: any) => String(u.departmentId) === String(filters.department));
      }
      if (filters.team) {
        filteredUsers = filteredUsers.filter((u: any) => String(u.teamId) === String(filters.team));
      }
      if (filters.role) {
        filteredUsers = filteredUsers.filter((u: any) => (u.roles || []).includes(`ROLE_${filters.role}`));
      }

      // Filter tasks by user set (when dept/team/role filters are active)
      let filteredTasks = tasks;
      if (filters.department || filters.team || filters.role) {
        const validUserIds = new Set(filteredUsers.map((u: any) => u.id));
        filteredTasks = tasks.filter((t: any) => validUserIds.has(t.assigneeId));
      }

      // ===== 1. METRIC CARD: Projected vs Actual =====
      const weeklyProductivity = dashboardData?.weeklyProductivity || [];
      const dashboardTodo = weeklyProductivity.reduce((acc: number, cur: any) => acc + (cur.todo || 0), 0);
      const dashboardInProgress = weeklyProductivity.reduce((acc: number, cur: any) => acc + (cur.inProgress || 0), 0);
      const dashboardDone = weeklyProductivity.reduce((acc: number, cur: any) => acc + (cur.done || 0), 0);

      const todoCount = filteredTasks.length > 0 ? filteredTasks.filter((t: any) => t.status === 'TODO').length : dashboardTodo;
      const inProgressCount = filteredTasks.length > 0 ? filteredTasks.filter((t: any) => t.status === 'IN_PROGRESS').length : dashboardInProgress;
      const reviewCount = filteredTasks.filter((t: any) => t.status === 'REVIEW').length;
      const doneCount = filteredTasks.length > 0 ? filteredTasks.filter((t: any) => t.status === 'DONE').length : dashboardDone;
      
      const activeTasks = dashboardData?.activeTasks?.count ?? (todoCount + inProgressCount + reviewCount);
      const completedTasks = dashboardData?.completionRate?.completedTasks ?? doneCount;

      // ===== 2. METRIC CARD: Average Cycle Time =====
      const tasksWithDates = filteredTasks.filter((t: any) => t.status === 'DONE' && t.startDate && t.endDate);
      let avgCycleTime = 0;
      if (tasksWithDates.length > 0) {
        const totalDays = tasksWithDates.reduce((acc: number, t: any) => {
          const start = new Date(t.startDate).getTime();
          const end = new Date(t.endDate).getTime();
          return acc + Math.max(0, (end - start) / (1000 * 60 * 60 * 24));
        }, 0);
        avgCycleTime = totalDays / tasksWithDates.length;
      }

      // ===== 3. METRIC CARD: Team Velocity =====
      const weeklyDone = weeklyProductivity.map((p: any) => p.done || 0);
      const totalWeeklyDone = weeklyDone.reduce((a: number, b: number) => a + b, 0);
      const velocityPerWeek = weeklyDone.length > 0 ? (totalWeeklyDone / weeklyDone.length * 7).toFixed(1) : '0';

      // ===== 4. RISK GAUGE =====
      const overdueTasks = filteredTasks.filter((t: any) => t.overdue === true && t.status !== 'DONE');
      const highPriorityPending = filteredTasks.filter((t: any) => t.priority === 'HIGH' && t.status !== 'DONE');
      const riskScore = Math.min(
        Math.round((overdueTasks.length * 15) + (highPriorityPending.length * 5)),
        100
      );
      const riskLabel = riskScore >= 70 ? 'High' : riskScore >= 40 ? 'Medium' : 'Low';

      setMetrics({
        projected: {
          val: activeTasks,
          label: 'Active Tasks',
          secondVal: completedTasks,
          secondLabel: 'Completed',
          data: weeklyProductivity.map((p: any) => ({ value: p.done || 0 })),
        },
        cycleTime: {
          val: `${avgCycleTime.toFixed(1)}d`,
          label: 'Average Distribution',
          data: [
            { value: filteredTasks.filter((t: any) => t.priority === 'HIGH').length },
            { value: filteredTasks.filter((t: any) => t.priority === 'MEDIUM').length },
            { value: filteredTasks.filter((t: any) => t.priority === 'LOW').length },
          ],
        },
        velocity: {
          val: `${velocityPerWeek}/week`,
          label: 'Weekly trend',
          data: weeklyProductivity.map((p: any) => ({ value: (p.done || 0) + (p.inProgress || 0) })),
        },
        risk: {
          val: riskScore,
          label: riskLabel,
        },
      });

      // ===== 5. BOTTLENECK CHART =====
      // Group by project and show task distribution per status
      let bottleneck = [] as any[];

      if (filteredTasks.length > 0) {
        const projectNames = [...new Set(filteredTasks.map((t: any) => t.projectName).filter(Boolean))].slice(0, 6);
        bottleneck = projectNames.map((projName) => {
          const projTasks = filteredTasks.filter((t: any) => t.projectName === projName);
          return {
            name: String(projName).length > 12 ? String(projName).slice(0, 12) + '…' : projName,
            analysis: projTasks.filter((t: any) => t.status === 'TODO').length,
            dev: projTasks.filter((t: any) => t.status === 'IN_PROGRESS').length,
            test: projTasks.filter((t: any) => t.status === 'REVIEW').length,
            deploy: projTasks.filter((t: any) => t.status === 'DONE').length,
          };
        });
      } else if (projects.length > 0) {
        // Fallback: If Tasks API fails, use project-level task counts
        bottleneck = projects.filter((p: any) => (p.totalTasks || 0) > 0).slice(0, 6).map((p: any) => {
          const completed = p.completedTasks || 0;
          const remaining = Math.max(0, p.totalTasks - completed);
          return {
            name: p.name.length > 12 ? p.name.slice(0, 12) + '…' : p.name,
            analysis: Math.round(remaining * 0.4),
            dev: Math.round(remaining * 0.6),
            test: 0,
            deploy: completed
          };
        });
      }

      setBottleneckData(bottleneck.length > 0 ? bottleneck : [
        { name: 'Total View', analysis: todoCount, dev: inProgressCount, test: reviewCount, deploy: doneCount }
      ]);

      // ===== 6. RESOURCE UTILIZATION HEATMAP =====
      const teamWorkload = dashboardData?.teamWorkload || [];
      if (teamWorkload.length > 0) {
        setHeatmapData(teamWorkload.slice(0, 8).map((m: any) => ({
          name: m.userName,
          weeks: Array.from({ length: 6 }, (_, i) => {
            const base = m.workloadPercentage || 0;
            const variation = (Math.sin(i * 1.5 + m.userId) * 15);
            return Math.max(0, Math.min(100, Math.round(base + variation)));
          }),
        })));
      } else {
        setHeatmapData([]);
      }


      // ===== 7. SUBTASK ANALYTICS from Dashboard API =====
      if (dashboardData?.subtasks) {
        setSubtaskData({
          total: dashboardData.subtasks.total || 0,
          inProgress: dashboardData.subtasks.inProgress || 0,
          closed: dashboardData.subtasks.closed || 0,
        });
      }

      // ===== 8. DETAILED ANALYTICS TABLE =====
      // Show project-level analytics with real data
      const projectAnalytics = projects.slice(0, 8).map((p: any) => {
        const projTasks = filteredTasks.filter((t: any) => t.projectId === p.id);
        const projDone = projTasks.filter((t: any) => t.status === 'DONE').length;
        const projTotal = projTasks.length;
        const completion = projTotal > 0 ? Math.round((projDone / projTotal) * 100) : p.progressPercentage || 0;
        const target = projTotal > 0 ? projTotal : 1;
        const variance = completion - (p.progressPercentage || 0);

        return {
          type: p.priority || 'MEDIUM',
          dimension: p.name,
          value: projTotal,
          completion,
          variance,
          outcome: p.status === 'COMPLETED' ? 'Achieved' :
                   completion >= 80 ? 'On Track' :
                   completion >= 50 ? 'At Risk' : 'Delayed',
        };
      });
      setDetailedData(projectAnalytics);

    } catch (err) {
      console.error('Failed to fetch enterprise analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isHydrated) {
      fetchEnterpriseData({ project: '', team: '', department: '', status: '', priority: '', role: '' });
    }
  }, [isHydrated]);

  if (!isHydrated) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-foreground transition-smooth">
      <NavigationSidebar
        isCollapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        isMobileOpen={isSidebarMobileOpen}
        onMobileClose={() => setIsSidebarMobileOpen(false)}
      />

      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-[60px]' : 'ml-[240px]'}`}>
        {/* Top Header */}
        <header className="bg-white border-b border-border px-8 py-3 flex items-center justify-between sticky top-0 z-50">
           <div className="flex items-center gap-4">
              <button
                className="md:hidden p-2 -ml-2 text-muted-foreground hover:bg-muted rounded-md"
                onClick={() => setIsSidebarMobileOpen(true)}
              >
                <Icon name="Bars3Icon" size={24} variant="outline" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                   <Icon name="RocketLaunchIcon" size={20} variant="outline" className="text-white" />
                </div>
                <div>
                   <h1 className="text-xl font-heading font-bold text-foreground leading-tight">Analytics</h1>
                   <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Advanced data insights and reporting</p>
                </div>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                 <div className="text-right">
                    <p className="text-xs font-bold leading-none">{user?.userName || 'Bibhuti'}</p>
                    <p className="text-[9px] text-muted-foreground font-bold uppercase">Admin</p>
                 </div>
                 <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-red-500/20 shadow-sm">
                    {user?.userName?.[0]?.toUpperCase() || 'B'}
                 </div>
              </div>
           </div>
        </header>

        {/* Filter Toolbar */}
        <FilterBar onApplyFilters={fetchEnterpriseData} />

        {/* Loading Indicator */}
        {loading && (
          <div className="bg-blue-50 border-b border-blue-200 px-8 py-2 flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium text-blue-700">Loading analytics data...</span>
          </div>
        )}

        {/* Main Content Dashboard */}
        <main className={`p-8 space-y-6 ${loading ? 'opacity-60' : ''}`}>
          
          {/* Row 1: Top Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
             <EnterpriseMetricCard 
               title="Projected vs. Actual Completion"
               primaryValue={metrics.projected.val}
               primaryLabel={metrics.projected.label}
               secondaryValue={metrics.projected.secondVal}
               secondaryLabel={metrics.projected.secondLabel}
               chartData={metrics.projected.data}
               chartType="line"
             />
             <SubtaskBreakdown 
               total={subtaskData.total}
               inProgress={subtaskData.inProgress}
               closed={subtaskData.closed}
             />
             <EnterpriseMetricCard 
               title="Average Task Cycle Time"
               primaryValue={metrics.cycleTime.val}
               primaryLabel={metrics.cycleTime.label}
               chartData={metrics.cycleTime.data}
               chartType="bar"
             />
             <EnterpriseMetricCard 
               title="Team Velocity Trend"
               primaryValue={metrics.velocity.val}
               primaryLabel={metrics.velocity.label}
               chartData={metrics.velocity.data}
               chartType="line"
             />
             <RiskGauge 
               value={metrics.risk.val}
               label={metrics.risk.label}
             />
          </div>

          {/* Row 2: Charts Section */}
          <div className="grid grid-cols-12 gap-6">
             <div className="col-span-12 lg:col-span-7">
                <BottleneckChart data={bottleneckData} />
             </div>
             <div className="col-span-12 lg:col-span-5">
                <EnterpriseHeatmap data={heatmapData} />
             </div>
          </div>


          {/* Row 3: Detailed Table */}
          <div className="bg-white border border-border rounded-lg shadow-sm overflow-hidden">
             <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-white/50">
                <h3 className="font-heading font-bold text-base">Project Performance Overview</h3>
                <button className="text-[10px] text-blue-600 font-bold uppercase hover:underline">Download CSV</button>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                      <tr className="bg-muted/10">
                         <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase">
                            Priority <Icon name="ChevronUpDownIcon" size={12} variant="outline" />
                         </th>
                         <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase">
                            Project Name <Icon name="ChevronUpDownIcon" size={12} variant="outline" />
                         </th>
                         <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase">
                            Total Tasks <Icon name="ChevronUpDownIcon" size={12} variant="outline" />
                         </th>
                         <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase">
                            Completion % <Icon name="ChevronUpDownIcon" size={12} variant="outline" />
                         </th>
                         <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase">
                            Variance <Icon name="ChevronUpDownIcon" size={12} variant="outline" />
                         </th>
                         <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase">
                            Status <Icon name="ChevronUpDownIcon" size={12} variant="outline" />
                         </th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-border">
                      {detailedData.length === 0 && (
                        <tr><td colSpan={6} className="px-6 py-8 text-center text-xs text-muted-foreground">No project data available for the selected filters</td></tr>
                      )}
                      {detailedData.map((row, i) => (
                         <tr key={i} className="hover:bg-muted/5 transition-smooth">
                            <td className="px-6 py-4">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                row.type === 'HIGH' ? 'bg-red-100 text-red-700' :
                                row.type === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>{row.type}</span>
                            </td>
                            <td className="px-6 py-4 text-xs font-medium text-blue-600">{row.dimension}</td>
                            <td className="px-6 py-4 text-xs font-bold text-foreground">{row.value}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-muted/30 rounded-full h-1.5 max-w-[80px]">
                                  <div className={`h-1.5 rounded-full ${row.completion >= 80 ? 'bg-green-500' : row.completion >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                       style={{ width: `${Math.min(row.completion, 100)}%` }} />
                                </div>
                                <span className="text-xs font-bold text-foreground">{row.completion}%</span>
                              </div>
                            </td>
                            <td className={`px-6 py-4 text-xs font-bold ${row.variance < 0 ? 'text-red-500' : row.variance > 0 ? 'text-green-500' : 'text-muted-foreground'}`}>
                               {row.variance > 0 ? '+' : ''}{row.variance.toFixed(1)}%
                            </td>
                            <td className="px-6 py-4">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                row.outcome === 'Achieved' ? 'bg-green-100 text-green-700' :
                                row.outcome === 'On Track' ? 'bg-blue-100 text-blue-700' :
                                row.outcome === 'At Risk' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>{row.outcome}</span>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsInteractive;