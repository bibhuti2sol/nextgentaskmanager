'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FilterBarProps {
  onDateRangeChange: (range: string) => void;
  onTeamChange: (team: string) => void;
  onProjectChange: (project: string) => void;
}

const FilterBar = ({ onDateRangeChange, onTeamChange, onProjectChange }: FilterBarProps) => {
  const [dateRange, setDateRange] = useState('last-30-days');
  const [team, setTeam] = useState('all-teams');
  const [project, setProject] = useState('all-projects');
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    status: 'all',
    priority: 'all',
    customStartDate: '',
    customEndDate: '',
    minTaskCount: '',
    maxTaskCount: '',
  });

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    onDateRangeChange(value);
  };

  const handleTeamChange = (value: string) => {
    setTeam(value);
    onTeamChange(value);
  };

  const handleProjectChange = (value: string) => {
    setProject(value);
    onProjectChange(value);
  };

  const handleApplyAdvancedFilters = () => {
    console.log('Applying advanced filters:', advancedFilters);
    // In a real app, this would trigger data filtering
    setShowMoreFilters(false);
  };

  const handleResetAdvancedFilters = () => {
    setAdvancedFilters({
      status: 'all',
      priority: 'all',
      customStartDate: '',
      customEndDate: '',
      minTaskCount: '',
      maxTaskCount: '',
    });
  };

  return (
    <>
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Icon name="CalendarIcon" size={20} variant="outline" className="text-muted-foreground" />
          <select
            value={dateRange}
            onChange={(e) => handleDateRangeChange(e.target.value)}
            className="px-4 py-2 bg-card border border-border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="today">Today</option>
            <option value="last-7-days">Last 7 Days</option>
            <option value="last-30-days">Last 30 Days</option>
            <option value="last-90-days">Last 90 Days</option>
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="this-quarter">This Quarter</option>
            <option value="this-year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Icon name="UsersIcon" size={20} variant="outline" className="text-muted-foreground" />
          <select
            value={team}
            onChange={(e) => handleTeamChange(e.target.value)}
            className="px-4 py-2 bg-card border border-border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all-teams">All Teams</option>
            <option value="engineering">Engineering</option>
            <option value="design">Design</option>
            <option value="marketing">Marketing</option>
            <option value="sales">Sales</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Icon name="FolderIcon" size={20} variant="outline" className="text-muted-foreground" />
          <select
            value={project}
            onChange={(e) => handleProjectChange(e.target.value)}
            className="px-4 py-2 bg-card border border-border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all-projects">All Projects</option>
            <option value="project-alpha">Project Alpha</option>
            <option value="project-beta">Project Beta</option>
            <option value="project-gamma">Project Gamma</option>
          </select>
        </div>

        <button
          onClick={() => setShowMoreFilters(true)}
          className="ml-auto px-4 py-2 bg-muted text-foreground rounded-md font-caption text-sm font-medium hover:bg-muted/80 transition-smooth flex items-center gap-2"
        >
          <Icon name="FunnelIcon" size={18} variant="outline" />
          More Filters
        </button>
      </div>

      {/* More Filters Modal */}
      {showMoreFilters && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            onClick={() => setShowMoreFilters(false)}
          >
            <div
              className="bg-card rounded-lg shadow-elevation-3 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
                <h3 className="font-heading font-semibold text-lg text-foreground">Advanced Filters</h3>
                <button
                  onClick={() => setShowMoreFilters(false)}
                  className="p-2 hover:bg-muted rounded-md transition-smooth"
                >
                  <Icon name="XMarkIcon" size={20} variant="outline" className="text-muted-foreground" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Status Filter */}
                <div>
                  <label className="font-caption text-sm font-medium text-foreground mb-2 block">
                    Task Status
                  </label>
                  <select
                    value={advancedFilters.status}
                    onChange={(e) => setAdvancedFilters({ ...advancedFilters, status: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Statuses</option>
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>

                {/* Priority Filter */}
                <div>
                  <label className="font-caption text-sm font-medium text-foreground mb-2 block">
                    Priority Level
                  </label>
                  <select
                    value={advancedFilters.priority}
                    onChange={(e) => setAdvancedFilters({ ...advancedFilters, priority: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                {/* Custom Date Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-caption text-sm font-medium text-foreground mb-2 block">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={advancedFilters.customStartDate}
                      onChange={(e) => setAdvancedFilters({ ...advancedFilters, customStartDate: e.target.value })}
                      className="w-full px-4 py-2 bg-background border border-border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="font-caption text-sm font-medium text-foreground mb-2 block">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={advancedFilters.customEndDate}
                      onChange={(e) => setAdvancedFilters({ ...advancedFilters, customEndDate: e.target.value })}
                      className="w-full px-4 py-2 bg-background border border-border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Task Count Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-caption text-sm font-medium text-foreground mb-2 block">
                      Min Task Count
                    </label>
                    <input
                      type="number"
                      value={advancedFilters.minTaskCount}
                      onChange={(e) => setAdvancedFilters({ ...advancedFilters, minTaskCount: e.target.value })}
                      placeholder="0"
                      className="w-full px-4 py-2 bg-background border border-border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="font-caption text-sm font-medium text-foreground mb-2 block">
                      Max Task Count
                    </label>
                    <input
                      type="number"
                      value={advancedFilters.maxTaskCount}
                      onChange={(e) => setAdvancedFilters({ ...advancedFilters, maxTaskCount: e.target.value })}
                      placeholder="100"
                      className="w-full px-4 py-2 bg-background border border-border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex items-center justify-end gap-3">
                <button
                  onClick={handleResetAdvancedFilters}
                  className="px-4 py-2 bg-muted text-foreground rounded-md font-caption text-sm font-medium hover:bg-muted/80 transition-smooth"
                >
                  Reset
                </button>
                <button
                  onClick={handleApplyAdvancedFilters}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-caption text-sm font-medium hover:bg-primary/90 transition-smooth"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default FilterBar;