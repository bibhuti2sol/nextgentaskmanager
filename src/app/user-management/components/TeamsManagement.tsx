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

  const handleDeleteTeam = (teamId: string) => {
    if (confirm('Are you sure you want to delete this team?')) {
      const updatedTeams = teams.filter((t) => t.id !== teamId);
      setTeams(updatedTeams);
      onTeamUpdate?.(updatedTeams);
    }
  };

  const handleSaveTeam = () => {
    if (editingTeam) {
      const updatedTeams = teams.map((t) =>
        t.id === editingTeam.id ? { ...t, ...formData } : t
      );
      setTeams(updatedTeams);
      onTeamUpdate?.(updatedTeams);
    } else {
      const newTeam: Team = {
        ...formData,
        id: Date.now().toString()
      };
      const updatedTeams = [...teams, newTeam];
      setTeams(updatedTeams);
      onTeamUpdate?.(updatedTeams);
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
            {filteredTeams.length} team{filteredTeams.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <button
          onClick={handleAddTeam}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-caption font-medium text-sm hover:bg-primary/90 transition-smooth"
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
                  {departments
                    .filter((dept) => dept.status === 'Active')
                    .map((dept) => (
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
                  {users
                    .filter((user) => user.status === 'Active')
                    .map((user) => (
                      <option key={user.id} value={user.name}>
                        {user.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block font-caption font-medium text-sm text-foreground mb-2">
                  Member Count
                </label>
                <input
                  type="number"
                  value={formData.memberCount}
                  onChange={(e) => setFormData({ ...formData, memberCount: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Enter member count"
                />
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