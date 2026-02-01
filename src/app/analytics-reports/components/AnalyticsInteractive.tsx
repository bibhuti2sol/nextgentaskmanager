'use client';

import { useState, useEffect } from 'react';
import NavigationSidebar from '@/components/common/NavigationSidebar';
import UserRoleIndicator from '@/components/common/UserRoleIndicator';
import ThemeToggle from '@/components/common/ThemeToggle';
import MetricCard from './MetricCard';
import ChartContainer from './ChartContainer';
import ProductivityChart from './ProductivityChart';
import TrendLineChart from './TrendLineChart';
import ReportTemplate from './ReportTemplate';
import RecentReportItem from './RecentReportItem';

import FilterBar from './FilterBar';
import ExportOptions from './ExportOptions';

interface MetricData {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: string;
  trend: 'up' | 'down' | 'neutral';
}

interface ProductivityData {
  name: string;
  completed: number;
  inProgress: number;
  overdue: number;
}

interface TrendData {
  date: string;
  velocity: number;
  efficiency: number;
}

interface ReportTemplateData {
  id: string;
  title: string;
  description: string;
  icon: string;
  lastGenerated: string;
}

interface RecentReportData {
  id: string;
  name: string;
  type: string;
  generatedDate: string;
  size: string;
  status: 'completed' | 'processing' | 'scheduled';
}

interface PredictiveInsightData {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
  confidence: number;
}

const AnalyticsInteractive = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentRole, setCurrentRole] = useState<'Admin' | 'Manager' | 'Associate'>('Manager');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const metricsData: MetricData[] = [
    {
      title: 'Task Completion Rate',
      value: '87.5%',
      change: 12.3,
      changeLabel: 'vs last month',
      icon: '✓',
      trend: 'up',
    },
    {
      title: 'Average Time per Task',
      value: '4.2h',
      change: -8.5,
      changeLabel: 'vs last month',
      icon: '⏱',
      trend: 'up',
    },
    {
      title: 'Project Velocity',
      value: '42',
      change: 15.7,
      changeLabel: 'vs last sprint',
      icon: '⚡',
      trend: 'up',
    },
    {
      title: 'Team Productivity',
      value: '94%',
      change: 5.2,
      changeLabel: 'vs last week',
      icon: '📊',
      trend: 'up',
    },
  ];

  const productivityData: ProductivityData[] = [
    { name: 'Engineering', completed: 145, inProgress: 32, overdue: 8 },
    { name: 'Design', completed: 98, inProgress: 24, overdue: 5 },
    { name: 'Marketing', completed: 112, inProgress: 28, overdue: 3 },
    { name: 'Sales', completed: 87, inProgress: 19, overdue: 12 },
    { name: 'Support', completed: 156, inProgress: 41, overdue: 7 },
  ];

  const trendData: TrendData[] = [
    { date: '01/20', velocity: 35, efficiency: 82 },
    { date: '01/21', velocity: 38, efficiency: 85 },
    { date: '01/22', velocity: 42, efficiency: 88 },
    { date: '01/23', velocity: 39, efficiency: 86 },
    { date: '01/24', velocity: 45, efficiency: 91 },
    { date: '01/25', velocity: 48, efficiency: 93 },
    { date: '01/26', velocity: 42, efficiency: 94 },
  ];

  const reportTemplates: ReportTemplateData[] = [
    {
      id: '1',
      title: 'Weekly Timesheet Report',
      description: 'Comprehensive time tracking summary with billable hours breakdown and project allocation',
      icon: 'ClockIcon',
      lastGenerated: '01/20/2026',
    },
    {
      id: '2',
      title: 'Project Health Assessment',
      description: 'Overall project status including milestones, risks, and resource utilization metrics',
      icon: 'ChartBarIcon',
      lastGenerated: '01/18/2026',
    },
    {
      id: '3',
      title: 'OKR Progress Tracker',
      description: 'Objectives and Key Results tracking with team alignment and achievement percentages',
      icon: 'FlagIcon',
      lastGenerated: '01/15/2026',
    },
    {
      id: '4',
      title: 'Team Performance Review',
      description: 'Individual and team productivity metrics with comparative analysis and trends',
      icon: 'UsersIcon',
      lastGenerated: '01/22/2026',
    },
  ];

  const recentReports: RecentReportData[] = [
    {
      id: '1',
      name: 'Q4 2025 Performance Summary',
      type: 'PDF',
      generatedDate: '01/26/2026',
      size: '2.4 MB',
      status: 'completed',
    },
    {
      id: '2',
      name: 'January Sprint Analytics',
      type: 'Excel',
      generatedDate: '01/25/2026',
      size: '1.8 MB',
      status: 'completed',
    },
    {
      id: '3',
      name: 'Weekly Team Timesheet',
      type: 'PDF',
      generatedDate: '01/27/2026',
      size: '856 KB',
      status: 'processing',
    },
    {
      id: '4',
      name: 'Monthly OKR Report',
      type: 'PDF',
      generatedDate: '02/01/2026',
      size: '-',
      status: 'scheduled',
    },
  ];

  const predictiveInsights: PredictiveInsightData[] = [
    {
      id: '1',
      title: 'Project Alpha Delay Risk',
      description: 'Based on current velocity and remaining tasks, Project Alpha has a 78% probability of missing the February 15th deadline by 4-6 days.',
      impact: 'high',
      recommendation: 'Consider reallocating 2 additional team members from Project Beta or extending the deadline by one week to maintain quality standards.',
      confidence: 78,
    },
    {
      id: '2',
      title: 'Team Workload Imbalance',
      description: 'Engineering team is operating at 112% capacity while Design team is at 67% capacity, creating potential bottlenecks in the development pipeline.',
      impact: 'medium',
      recommendation: 'Redistribute 3-4 tasks from Engineering to Design team or consider cross-training opportunities to balance workload distribution.',
      confidence: 85,
    },
    {
      id: '3',
      title: 'Productivity Optimization Opportunity',
      description: 'Analysis shows that task completion rates increase by 23% when team members work on similar task types consecutively rather than context switching.',
      impact: 'low',
      recommendation: 'Implement task batching strategy where team members focus on similar task categories during dedicated time blocks.',
      confidence: 92,
    },
  ];

  const handleDateRangeChange = (range: string) => {
    console.log('Date range changed:', range);
  };

  const handleTeamChange = (team: string) => {
    console.log('Team changed:', team);
  };

  const handleProjectChange = (project: string) => {
    console.log('Project changed:', project);
  };

  const handleGenerateReport = (templateId: string) => {
    console.log('Generating report:', templateId);
  };

  const handleDownloadReport = (reportId: string) => {
    console.log('Downloading report:', reportId);
  };

  const handleShareReport = (reportId: string) => {
    console.log('Sharing report:', reportId);
  };

  const handleExport = (format: string, options: any) => {
    console.log('Exporting report:', format, options);
  };

  if (!isHydrated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar
        isCollapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      <div
        className={`transition-smooth ${
          sidebarCollapsed ? 'ml-[60px]' : 'ml-[240px]'
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 bg-card border-b border-border">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground mb-1">
                  Analytics & Reports
                </h1>
                <p className="font-caption text-sm text-muted-foreground">
                  Comprehensive insights and data-driven decision making
                </p>
              </div>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <UserRoleIndicator
                  currentRole={currentRole}
                  userName="Sarah Johnson"
                  onRoleChange={setCurrentRole}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8">
          {/* Filter Bar */}
          <div className="mb-8">
            <FilterBar
              onDateRangeChange={handleDateRangeChange}
              onTeamChange={handleTeamChange}
              onProjectChange={handleProjectChange}
            />
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricsData.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartContainer
              title="Team Productivity Overview"
              subtitle="Task completion status by department"
              actions={
                <ExportOptions onExport={handleExport} />
              }
            >
              <ProductivityChart data={productivityData} />
            </ChartContainer>

            <ChartContainer
              title="Project Velocity Trends"
              subtitle="7-day performance and efficiency metrics"
            >
              <TrendLineChart data={trendData} />
            </ChartContainer>
          </div>

          {/* Report Templates & Recent Reports */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Report Templates */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-heading font-bold text-foreground mb-1">
                    Report Templates
                  </h2>
                  <p className="font-caption text-sm text-muted-foreground">
                    Pre-built reports for quick generation
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTemplates.map((template) => (
                  <ReportTemplate
                    key={template.id}
                    {...template}
                    onGenerate={() => handleGenerateReport(template.id)}
                  />
                ))}
              </div>
            </div>

            {/* Recent Reports */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-heading font-bold text-foreground mb-1">
                    Recent Reports
                  </h2>
                  <p className="font-caption text-sm text-muted-foreground">
                    Generated and scheduled reports
                  </p>
                </div>
              </div>
              <div className="bg-card rounded-lg border border-border p-4 space-y-2">
                {recentReports.map((report) => (
                  <RecentReportItem
                    key={report.id}
                    {...report}
                    onDownload={() => handleDownloadReport(report.id)}
                    onShare={() => handleShareReport(report.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsInteractive;