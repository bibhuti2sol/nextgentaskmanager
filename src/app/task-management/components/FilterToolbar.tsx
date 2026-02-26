'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FilterToolbarProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  priority: string[];
  assignee: string[];
  project: string[];
  status: string[];
  dateRange: { start: string; end: string } | null;
}

const FilterToolbar = ({ onFilterChange }: FilterToolbarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priority: [],
    assignee: [],
    project: [],
    status: [],
    dateRange: null,
  });

  const priorities = ['High', 'Medium', 'Low'];
  const assignees = ['Sarah Chen', 'Michael Rodriguez', 'Emily Watson', 'David Kim'];
  const projects = ['Website Redesign', 'Mobile App', 'API Integration', 'Marketing Campaign'];
  const statuses = ['To Do', 'In Progress', 'Review', 'Completed'];

  const handleFilterToggle = (category: keyof Omit<FilterState, 'dateRange'>, value: string) => {
    const newFilters = { ...filters };
    const currentValues = newFilters[category];
    
    if (currentValues.includes(value)) {
      newFilters[category] = currentValues.filter((v) => v !== value);
    } else {
      newFilters[category] = [...currentValues, value];
    }
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const emptyFilters: FilterState = {
      priority: [],
      assignee: [],
      project: [],
      status: [],
      dateRange: null,
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const activeFilterCount = 
    filters.priority.length + 
    filters.assignee.length + 
    filters.project.length + 
    filters.status.length +
    (filters.dateRange ? 1 : 0);

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-foreground hover:text-primary transition-smooth"
        >
          <Icon name="FunnelIcon" size={20} variant="outline" />
          <span className="font-caption font-medium text-sm">Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs font-caption font-medium px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
          <Icon 
            name={isExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'} 
            size={16} 
            variant="outline" 
          />
        </button>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-xs font-caption text-muted-foreground hover:text-foreground transition-smooth"
          >
            Clear All
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          <div>
            <h4 className="font-caption font-medium text-sm text-foreground mb-2">Priority</h4>
            <div className="flex flex-wrap gap-2">
              {priorities.map((priority) => (
                <button
                  key={priority}
                  onClick={() => handleFilterToggle('priority', priority)}
                  className={`px-3 py-1.5 rounded-md text-xs font-caption font-medium transition-smooth ${
                    filters.priority.includes(priority)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-caption font-medium text-sm text-foreground mb-2">Assignee</h4>
            <div className="flex flex-wrap gap-2">
              {assignees.map((assignee) => (
                <button
                  key={assignee}
                  onClick={() => handleFilterToggle('assignee', assignee)}
                  className={`px-3 py-1.5 rounded-md text-xs font-caption font-medium transition-smooth ${
                    filters.assignee.includes(assignee)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  {assignee}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-caption font-medium text-sm text-foreground mb-2">Project</h4>
            <div className="flex flex-wrap gap-2">
              {projects.map((project) => (
                <button
                  key={project}
                  onClick={() => handleFilterToggle('project', project)}
                  className={`px-3 py-1.5 rounded-md text-xs font-caption font-medium transition-smooth ${
                    filters.project.includes(project)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  {project}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-caption font-medium text-sm text-foreground mb-2">Status</h4>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => handleFilterToggle('status', status)}
                  className={`px-3 py-1.5 rounded-md text-xs font-caption font-medium transition-smooth ${
                    filters.status.includes(status)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterToolbar;