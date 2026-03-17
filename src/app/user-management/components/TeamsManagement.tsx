'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { Department } from './DepartmentsManagement';
import { User } from './UserManagementInteractive';

export interface Team {
  id: string;
  name: string;
  department: string;
  teamLead: string;
  memberCount: number;
  status: 'Active' | 'Inactive';
  description: string;
}

interface TeamsManagementProps {
  onTeamUpdate?: (teams: Team[]) => void;
  departments?: Department[];
  users?: User[];
}

const TeamsManagement = ({ onTeamUpdate, departments = [], users = [] }: TeamsManagementProps) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState<Omit<Team, 'id'>>({
    name: '',
    department: '',
    teamLead: '',
    memberCount: 0,
    status: 'Active',
    description: ''
  });
  const [fetchedDepartments, setFetchedDepartments] = useState<Department[]>([]);
  const [teamLeads, setTeamLeads] = useState<{ id: string; name: string }[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    const mockTeams: Team[] = [
      {
        id: '1',
        name: 'Engineering',
        department: 'Product Development',
        teamLead: 'Sarah Chen',
        memberCount: 12,
        status: 'Active',
        description: 'Core product development team'
      },
      {
        id: '2',
        name: 'Design',
        department: 'Creative',
        teamLead: 'Emily Watson',
        memberCount: 8,
        status: 'Active',
        description: 'UI/UX and visual design team'
      },
      {
        id: '3',
        name: 'Marketing',
        department: 'Growth',
        teamLead: 'Alex Thompson',
        memberCount: 6,
        status: 'Active',
        description: 'Marketing and growth team'
      },
      {
        id: '4',
        name: 'Leadership',
        department: 'Executive',
        teamLead: 'Bibhuti',
        memberCount: 3,
        status: 'Active',
        description: 'Executive leadership team'
      }
    ];
    setTeams(mockTeams);
    setFilteredTeams(mockTeams);
  }, []);

  useEffect(() => {
    let filtered = teams;
    if (searchQuery) {
      filtered = filtered.filter(
        (team) =>
          team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          team.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredTeams(filtered);
  }, [searchQuery, teams]);

  const fetchDepartments = async () => {
    try {
      const response = await fetch('http://43.205.137.114:8080/api/v1/departments', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyYWh1bC5nYW5kaGlAZXhhbXBsZS5jb20iLCJpZCI6OCwiYXV0aG9yaXRpZXMiOlt7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc3MzQ3NzY1OCwiZXhwIjoxNzc0MDgyNDU4fQ.nVsbZc2q9Cyl1IQD_iIj8LTv5zwOP0CbOyhEknz8f5o',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const activeDepartments = data.map((dept: any) => ({ id: dept.id, name: dept.name }));
        setFetchedDepartments(activeDepartments);
      } else {
        console.error('Failed to fetch departments:', response.status);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  useEffect(() => {
    fetchDepartments(); // Fetch departments on component mount
  }, []);

  const fetchTeamLeads = async (departmentId: string) => {
    try {
      const response = await fetch(`http://43.205.137.114:8080/api/v1/teams/leads/eligible`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyYWh1bC5nYW5kaGlAZXhhbXBsZS5jb20iLCJpZCI6OCwiYXV0aG9yaXRpZXMiOlt7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc3MzQ3NzY1OCwiZXhwIjoxNzc0MDgyNDU4fQ.nVsbZc2q9Cyl1IQD_iIj8LTv5zwOP0CbOyhEknz8f5o',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const leads = data.map((user: any) => ({ id: user.id, name: user.fullName }));
        setTeamLeads(leads);
      } else {
        console.error('Failed to fetch team leads:', response.status);
      }
    } catch (error) {
      console.error('Error fetching team leads:', error);
    }
  };

  useEffect(() => {
    if (formData.department) {
      const selectedDepartment = fetchedDepartments.find(
        (dept) => dept.name === formData.department
      );
      if (selectedDepartment) {
        fetchTeamLeads(selectedDepartment.id);
      }
    }
  }, [formData.department]);

  const handleAddTeam = () => {
    setEditingTeam(null);
    setFormData({
      name: '',
      department: '',
      teamLead: '',
      memberCount: 0,
      status: 'Active',
      description: ''
    });
    setIsFormOpen(true);
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      department: team.department,
      teamLead: team.teamLead,
      memberCount: team.memberCount,
      status: team.status,
      description: team.description
    });
    setIsFormOpen(true);
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (confirm('Are you sure you want to delete this team?')) {
      try {
        const response = await fetch(`http://43.205.137.114:8080/api/v1/teams/${teamId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyYWh1bC5nYW5kaGlAZXhhbXBsZS5jb20iLCJpZCI6OCwiYXV0aG9yaXRpZXMiOlt7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc3MzQ3NzY1OCwiZXhwIjoxNzc0MDgyNDU4fQ.nVsbZc2q9Cyl1IQD_iIj8LTv5zwOP0CbOyhEknz8f5o',
          },
        });

        if (response.ok) {
          await fetchAllTeams(); // Refresh teams after deletion
        } else {
          console.error('Failed to delete team:', response.status);
        }
      } catch (error) {
        console.error('Error deleting team:', error);
      }
    }
  };

  const fetchAllTeams = async (search = '', status = '', page = 0, size = 10, sort = 'id,desc') => {
    try {
      const queryParams = new URLSearchParams({
        search,
        status,
        page: page.toString(),
        size: size.toString(),
        sort,
      });

      const response = await fetch(`http://43.205.137.114:8080/api/v1/teams?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyYWh1bC5nYW5kaGlAZXhhbXBsZS5jb20iLCJpZCI6OCwiYXV0aG9yaXRpZXMiOlt7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc3MzQ3NzY1OCwiZXhwIjoxNzc0MDgyNDU4fQ.nVsbZc2q9Cyl1IQD_iIj8LTv5zwOP0CbOyhEknz8f5o',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.content && Array.isArray(data.content)) {
          const formattedTeams = data.content.map((team: any) => {
            const department = team.departmentName || 'Unknown';
            const teamLead = team.teamLeadName || 'Unknown';

            return {
              id: team.id,
              name: team.name,
              department,
              teamLead,
              memberCount: team.memberCount || 0, // Default to 0 if not provided
              status: team.status,
              description: team.description,
            };
          });
          setTeams(formattedTeams);
          setFilteredTeams(formattedTeams);
          setTotalPages(data.totalPages || 0); // Update total pages
          setTotalRecords(data.totalElements || 0); // Update total record count
          onTeamUpdate?.(formattedTeams);
        } else {
          console.error('Unexpected response format: content is missing or not an array', data);
        }
      } else {
        console.error('Failed to fetch teams:', response.status);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchAllTeams(searchQuery, '', newPage, 10, 'id,desc'); // Fetch teams for the new page with max 10 records
  };

  useEffect(() => {
    fetchAllTeams(searchQuery, '', currentPage, 10, 'id,desc'); // Fetch teams for the current page with max 10 records
  }, [searchQuery, currentPage]);

  const handleSaveTeam = async () => {
    const updatedTeam = {
      name: formData.name,
      description: formData.description,
      status: formData.status.toUpperCase(), // Ensure status is in uppercase
      departmentId: fetchedDepartments.find((dept) => dept.name === formData.department)?.id,
      teamLeadId: teamLeads.find((lead) => lead.name === formData.teamLead)?.id,
    };

    try {
      if (editingTeam) {
        // Update existing team
        const response = await fetch(`http://43.205.137.114:8080/api/v1/teams/${editingTeam.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyYWh1bC5nYW5kaGlAZXhhbXBsZS5jb20iLCJpZCI6OCwiYXV0aG9yaXRpZXMiOlt7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc3MzQ3NzY1OCwiZXhwIjoxNzc0MDgyNDU4fQ.nVsbZc2q9Cyl1IQD_iIj8LTv5zwOP0CbOyhEknz8f5o',
          },
          body: JSON.stringify(updatedTeam),
        });

        if (response.ok) {
          await fetchAllTeams(); // Refresh teams after update
        } else {
          console.error('Failed to update team:', response.status);
        }
      } else {
        // Add new team
        const newTeam = {
          name: formData.name,
          description: formData.description,
          status: formData.status.toUpperCase(), // Ensure status is in uppercase
          departmentId: fetchedDepartments.find((dept) => dept.name === formData.department)?.id,
          teamLeadId: teamLeads.find((lead) => lead.name === formData.teamLead)?.id,
        };

        const response = await fetch('http://43.205.137.114:8080/api/v1/teams', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyYWh1bC5nYW5kaGlAZXhhbXBsZS5jb20iLCJpZCI6OCwiYXV0aG9yaXRpZXMiOlt7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc3MzQ3NzY1OCwiZXhwIjoxNzc0MDgyNDU4fQ.nVsbZc2q9Cyl1IQD_iIj8LTv5zwOP0CbOyhEknz8f5o',
          },
          body: JSON.stringify(newTeam),
        });

        if (response.ok) {
          await fetchAllTeams(); // Refresh teams after adding a new team
        } else {
          console.error('Failed to add team:', response.status);
        }
      }
    } catch (error) {
      console.error('Error saving team:', error);
    }

    setIsFormOpen(false);
    setEditingTeam(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-semibold text-xl text-foreground">All Teams</h2>
          <p className="font-caption text-sm text-muted-foreground mt-1">
            {totalRecords} team{totalRecords !== 1 ? 's' : ''} found
          </p>
        </div>
        <button
          onClick={handleAddTeam}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-2xl font-caption font-semibold text-sm hover:opacity-95 transition-smooth shadow-sm"
        >
          <Icon name="PlusIcon" size={18} variant="outline" />
          Add Team
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Icon
          name="MagnifyingGlassIcon"
          size={20}
          variant="outline"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          placeholder="Search by team name or department..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Teams Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Team Name
                </th>
                <th className="px-6 py-3 text-left font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Team Lead
                </th>
                <th className="px-6 py-3 text-left font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Members
                </th>
                <th className="px-6 py-3 text-left font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTeams.map((team) => (
                <tr key={team.id} className="hover:bg-muted/30 transition-smooth">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-caption font-medium text-sm text-foreground">
                        {team.name}
                      </div>
                      <div className="font-caption text-xs text-muted-foreground mt-0.5">
                        {team.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-caption text-sm text-foreground">{team.department}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-caption text-sm text-foreground">{team.teamLead}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-caption text-sm text-foreground">{team.memberCount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full font-caption font-medium text-xs ${
                        team.status === 'Active' ?'bg-success/10 text-success' :'bg-muted text-muted-foreground'
                      }`}
                    >
                      {team.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditTeam(team)}
                        className="p-1.5 text-primary hover:bg-primary/10 rounded transition-smooth"
                        aria-label="Edit team"
                      >
                        <Icon name="PencilIcon" size={16} variant="outline" />
                      </button>
                      <button
                        onClick={() => handleDeleteTeam(team.id)}
                        className="p-1.5 text-error hover:bg-error/10 rounded transition-smooth"
                        aria-label="Delete team"
                      >
                        <Icon name="TrashIcon" size={16} variant="outline" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Page {currentPage + 1} of {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-caption font-medium text-sm hover:bg-primary/90 transition-smooth disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage + 1 === totalPages}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-caption font-medium text-sm hover:bg-primary/90 transition-smooth disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4">
              <h3 className="font-heading font-semibold text-lg text-foreground">
                {editingTeam ? 'Edit Team' : 'Add New Team'}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block font-caption font-medium text-sm text-foreground mb-2">
                  Team Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Enter team name"
                />
              </div>
              <div>
                <label className="block font-caption font-medium text-sm text-foreground mb-2">
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Select department</option>
                  {fetchedDepartments.map((dept) => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-caption font-medium text-sm text-foreground mb-2">
                  Team Lead
                </label>
                <select
                  value={formData.teamLead}
                  onChange={(e) => setFormData({ ...formData, teamLead: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Select team lead</option>
                  {teamLeads.map((lead, index) => (
                    <option key={`${lead.id}-${index}`} value={lead.name}>
                      {lead.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-caption font-medium text-sm text-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Enter team description"
                />
              </div>
              <div>
                <label className="block font-caption font-medium text-sm text-foreground mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingTeam(null);
                }}
                className="px-4 py-2 border border-border rounded-lg font-caption font-medium text-sm text-foreground hover:bg-muted transition-smooth"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTeam}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-caption font-medium text-sm hover:bg-primary/90 transition-smooth"
              >
                {editingTeam ? 'Update Team' : 'Add Team'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsManagement;