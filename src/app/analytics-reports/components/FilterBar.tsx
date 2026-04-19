'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FilterBarProps {
  onApplyFilters: (filters: any) => void;
}

const API_BASE = 'http://43.205.137.114:8080/api/v1';
const API_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYXJlbmRyYS5tb2RpQGV4YW1wbGUuY29tIiwiaWQiOjM5LCJhdXRob3JpdGllcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9BRE1JTiJ9XSwiaWF0IjoxNzc2MTQ5NDkwLCJleHAiOjE3Nzg3NDE0OTB9.1YBLYJP5OKWGx-qgBllPTaqjae5ShbDrgOw-rr5wRTs';

const FilterBar = ({ onApplyFilters }: FilterBarProps) => {
  const [filters, setFilters] = useState({
    project: '',
    team: '',
    department: '',
    period: 'last-30-days',
    priority: '',
    status: '',
    role: '',
  });

  const [options, setOptions] = useState({
    projects: [] as any[],
    teams: [] as any[],
    departments: [] as any[],
    priorities: ['HIGH', 'MEDIUM', 'LOW'],
    statuses: ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'],
    roles: [] as string[],
  });

  // Status display labels
  const statusLabels: Record<string, string> = {
    'TODO': 'To Do',
    'IN_PROGRESS': 'In Progress',
    'REVIEW': 'Review',
    'DONE': 'Done',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, deptsRes, usersRes] = await Promise.all([
          fetch(`${API_BASE}/projects?page=0&size=500&sort=id,desc`, { headers: { Authorization: API_TOKEN } }),
          fetch(`${API_BASE}/departments?size=100`, { headers: { Authorization: API_TOKEN } }),
          fetch(`${API_BASE}/users?size=1000`, { headers: { Authorization: API_TOKEN } }),
        ]);

        const updates: any = {};

        if (projectsRes.ok) {
          const projects = await projectsRes.json();
          updates.projects = projects.content || [];
        }
        if (deptsRes.ok) {
          const depts = await deptsRes.json();
          updates.departments = depts.content || [];
        }
        if (usersRes.ok) {
          const users = await usersRes.json();
          const uniqueRoles = Array.from(new Set(
            (users.content || []).flatMap((u: any) => u.roles || [])
          )).map((r: any) => r.replace('ROLE_', ''));
          updates.roles = uniqueRoles;
        }

        setOptions(prev => ({ ...prev, ...updates }));
      } catch (err) {
        console.error('Failed to pre-fetch filters:', err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchTeams = async () => {
      if (!filters.department) {
        setOptions(prev => ({ ...prev, teams: [] }));
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/teams/department/${filters.department}`, {
          headers: { Authorization: API_TOKEN }
        });
        if (res.ok) {
          const data = await res.json();
          setOptions(prev => ({ ...prev, teams: data || [] }));
        }
      } catch (err) {
        console.error('Failed to fetch teams:', err);
      }
    };
    fetchTeams();
  }, [filters.department]);

  const handleChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    const resetFilters = { project: '', team: '', department: '', period: 'last-30-days', priority: '', status: '', role: '' };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  return (
    <div className="bg-card border-b border-border px-8 py-3 flex flex-wrap items-center gap-x-4 gap-y-3">
      {/* Project */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-muted-foreground uppercase px-1">Project</label>
        <select
          value={filters.project}
          onChange={(e) => handleChange('project', e.target.value)}
          className="px-3 py-1.5 bg-background border border-border rounded-md text-xs font-medium focus:ring-1 focus:ring-primary min-w-[140px]"
        >
          <option value="">All Projects</option>
          {options.projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {/* Department */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-muted-foreground uppercase px-1">Department</label>
        <select
          value={filters.department}
          onChange={(e) => handleChange('department', e.target.value)}
          className="px-3 py-1.5 bg-background border border-border rounded-md text-xs font-medium focus:ring-1 focus:ring-primary min-w-[140px]"
        >
          <option value="">All Departments</option>
          {options.departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      {/* Team (depends on Department) */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-muted-foreground uppercase px-1">Team</label>
        <select
          value={filters.team}
          onChange={(e) => handleChange('team', e.target.value)}
          className="px-3 py-1.5 bg-background border border-border rounded-md text-xs font-medium focus:ring-1 focus:ring-primary min-w-[140px]"
          disabled={!filters.department}
        >
          <option value="">{filters.department ? 'All Teams' : 'Select Dept first'}</option>
          {options.teams.map(t => <option key={t.id} value={t.id}>{t.teamName}</option>)}
        </select>
      </div>

      {/* Time Period */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-muted-foreground uppercase px-1">Time Period</label>
        <div className="flex items-center bg-background border border-border rounded-md px-2 py-1.5 min-w-[140px]">
           <select
             value={filters.period}
             onChange={(e) => handleChange('period', e.target.value)}
             className="bg-transparent text-xs font-medium outline-none flex-1"
           >
             <option value="last-7-days">Last 7 Days</option>
             <option value="last-30-days">Last 30 Days</option>
             <option value="last-90-days">Last 90 Days</option>
           </select>
           <Icon name="CalendarIcon" size={14} variant="outline" className="text-muted-foreground ml-2" />
        </div>
      </div>

      {/* Task Priority */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-muted-foreground uppercase px-1">Priority</label>
        <select
          value={filters.priority}
          onChange={(e) => handleChange('priority', e.target.value)}
          className="px-3 py-1.5 bg-background border border-border rounded-md text-xs font-medium focus:ring-1 focus:ring-primary"
        >
          <option value="">All Priorities</option>
          {options.priorities.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* Task Status */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-muted-foreground uppercase px-1">Status</label>
        <select
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="px-3 py-1.5 bg-background border border-border rounded-md text-xs font-medium focus:ring-1 focus:ring-primary"
        >
          <option value="">All Statuses</option>
          {options.statuses.map(s => <option key={s} value={s}>{statusLabels[s] || s}</option>)}
        </select>
      </div>

      {/* User Role */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-muted-foreground uppercase px-1">Role</label>
        <select
          value={filters.role}
          onChange={(e) => handleChange('role', e.target.value)}
          className="px-3 py-1.5 bg-background border border-border rounded-md text-xs font-medium focus:ring-1 focus:ring-primary"
        >
          <option value="">All Roles</option>
          {options.roles.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Actions */}
      <div className="ml-auto mt-auto mb-1 flex items-center gap-2">
        <button
          onClick={handleReset}
          className="px-4 py-1.5 bg-muted text-muted-foreground rounded-md text-xs font-bold hover:bg-muted/80 transition-smooth border border-border"
        >
          Reset
        </button>
        <button
          onClick={handleApply}
          className="px-5 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-bold hover:bg-primary/90 transition-smooth shadow-sm flex items-center gap-2"
        >
          <Icon name="FunnelIcon" size={14} variant="outline" />
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterBar;