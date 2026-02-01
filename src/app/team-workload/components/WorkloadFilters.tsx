'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FilterOptions {
  team: string;
  department: string;
  project: string;
  timePeriod: string;
}

interface WorkloadFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
}

const WorkloadFilters = ({ onFilterChange }: WorkloadFiltersProps) => {
  const [filters, setFilters] = useState<FilterOptions>({
    team: 'all',
    department: 'all',
    project: 'all',
    timePeriod: 'week',
  });

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const teams = ['All Teams', 'Development', 'Design', 'Marketing', 'Sales'];
  const departments = ['All Departments', 'Engineering', 'Product', 'Operations', 'HR'];
  const projects = ['All Projects', 'Project Alpha', 'Project Beta', 'Project Gamma'];
  const timePeriods = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="FunnelIcon" size={20} variant="outline" className="text-primary" />
        <h3 className="font-heading font-semibold text-lg text-foreground">Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block font-caption text-sm text-muted-foreground mb-2">Team</label>
          <select
            value={filters.team}
            onChange={(e) => handleFilterChange('team', e.target.value)}
            className="w-full px-4 py-2 bg-background border border-input rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
          >
            {teams.map((team, index) => (
              <option key={index} value={team.toLowerCase().replace(' ', '-')}>
                {team}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-caption text-sm text-muted-foreground mb-2">
            Department
          </label>
          <select
            value={filters.department}
            onChange={(e) => handleFilterChange('department', e.target.value)}
            className="w-full px-4 py-2 bg-background border border-input rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
          >
            {departments.map((dept, index) => (
              <option key={index} value={dept.toLowerCase().replace(' ', '-')}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-caption text-sm text-muted-foreground mb-2">Project</label>
          <select
            value={filters.project}
            onChange={(e) => handleFilterChange('project', e.target.value)}
            className="w-full px-4 py-2 bg-background border border-input rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
          >
            {projects.map((project, index) => (
              <option key={index} value={project.toLowerCase().replace(' ', '-')}>
                {project}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-caption text-sm text-muted-foreground mb-2">
            Time Period
          </label>
          <select
            value={filters.timePeriod}
            onChange={(e) => handleFilterChange('timePeriod', e.target.value)}
            className="w-full px-4 py-2 bg-background border border-input rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
          >
            {timePeriods.map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default WorkloadFilters;