'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import axios from 'axios';

interface FilterOptions {
  team: string;
  department: string;
  project: string;
  timePeriod: string;
}

interface WorkloadFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
}

interface TeamData {
  id: number;
  name: string;
}

interface DepartmentData {
  id: number;
  name: string;
}

interface ProjectData {
  id: number;
  name: string;
}

const WorkloadFilters = ({ onFilterChange }: WorkloadFiltersProps) => {
  const [filters, setFilters] = useState<FilterOptions>({
    team: 'all',
    department: 'all',
    project: 'all',
    timePeriod: 'week',
  });

  const [teams, setTeams] = useState<{ value: string, label: string }[]>([{ value: 'all', label: 'All Teams' }]);
  const [departments, setDepartments] = useState<{ value: string, label: string }[]>([{ value: 'all', label: 'All Departments' }]);
  const [projects, setProjects] = useState<{ value: string, label: string }[]>([{ value: 'all', label: 'All Projects' }]);

  useEffect(() => {
    const fetchFiltersData = async () => {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYXJlbmRyYS5tb2RpQGV4YW1wbGUuY29tIiwiaWQiOjM5LCJhdXRob3JpdGllcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9BRE1JTiJ9XSwiaWF0IjoxNzc2MTQ5NDkwLCJleHAiOjE3Nzg3NDE0OTB9.1YBLYJP5OKWGx-qgBllPTaqjae5ShbDrgOw-rr5wRTs',
      };

      try {
        const teamsResponse = await axios.get('http://43.205.137.114:8080/api/v1/teams', { headers });
        let teamsArray: TeamData[] = [];
        if (teamsResponse.status === 200) {
          if (Array.isArray(teamsResponse.data)) {
            teamsArray = teamsResponse.data;
          } else if (teamsResponse.data?.content && Array.isArray(teamsResponse.data.content)) {
            teamsArray = teamsResponse.data.content;
          }
          const teamsOptions = teamsArray.map((t: TeamData) => ({ value: t.id.toString(), label: t.name }));
          setTeams([{ value: 'all', label: 'All Teams' }, ...teamsOptions]);
        }
      } catch (error) {
        console.error('Failed to fetch teams:', error);
      }

      try {
        const departmentsResponse = await axios.get('http://43.205.137.114:8080/api/v1/departments', { headers });
        let deptsArray: DepartmentData[] = [];
        if (departmentsResponse.status === 200) {
          if (Array.isArray(departmentsResponse.data)) {
            deptsArray = departmentsResponse.data;
          } else if (departmentsResponse.data?.content && Array.isArray(departmentsResponse.data.content)) {
            deptsArray = departmentsResponse.data.content;
          }
          const departmentsOptions = deptsArray.map((d: DepartmentData) => ({ value: d.id.toString(), label: d.name }));
          setDepartments([{ value: 'all', label: 'All Departments' }, ...departmentsOptions]);
        }
      } catch (error) {
        console.error('Failed to fetch departments:', error);
      }

      try {
        const queryParams = new URLSearchParams({
          search: '',
          page: '0',
          size: '100',
          sort: 'name,asc'
        });

        const response = await fetch(`http://43.205.137.114:8080/api/v1/projects?${queryParams.toString()}`, {
          method: 'GET',
          headers: headers
        });

        if (response.ok) {
          const data = await response.json();
          let projectsArray: ProjectData[] = [];

          if (Array.isArray(data)) {
            projectsArray = data;
          } else if (data?.content && Array.isArray(data.content)) {
            projectsArray = data.content;
          }

          const projectsOptions = projectsArray.map((p: ProjectData) => ({ value: p.id.toString(), label: p.name }));
          setProjects([{ value: 'all', label: 'All Projects' }, ...projectsOptions]);
        } else {
          console.error('Projects API returned non-OK status:', response.status);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };

    fetchFiltersData();
  }, []);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

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
          <label className="block font-caption text-sm text-muted-foreground mb-2">
            Department
          </label>
          <select
            value={filters.department}
            onChange={(e) => handleFilterChange('department', e.target.value)}
            className="w-full px-4 py-2 bg-background border border-input rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
          >
            {departments.map((dept) => (
              <option key={dept.value} value={dept.value}>
                {dept.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-caption text-sm text-muted-foreground mb-2">Team</label>
          <select
            value={filters.team}
            onChange={(e) => handleFilterChange('team', e.target.value)}
            className="w-full px-4 py-2 bg-background border border-input rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
          >
            {teams.map((team) => (
              <option key={team.value} value={team.value}>
                {team.label}
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
            {projects.map((project) => (
              <option key={project.value} value={project.value}>
                {project.label}
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