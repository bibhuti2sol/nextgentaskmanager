'use client';

import { useState, useEffect } from 'react';
import UserTable from './UserTable';
import UserFilters from './UserFilters';
import UserFormPanel from './UserFormPanel';
import DeleteConfirmModal from './DeleteConfirmModal';
import TeamsManagement from './TeamsManagement';
import DepartmentsManagement from './DepartmentsManagement';
import Icon from '@/components/ui/AppIcon';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Associate';
  team: string;
  department: string;
  reportsTo: string;
  status: 'Active' | 'Inactive';
  lastActivity: string;
  avatar: string;
  avatarAlt: string;
}

// Update the `Department` interface to include `head` and `teamCount`.
export interface Department {
  id: string;
  name: string;
  description: string;
  headOfDepartment: string; // Existing property
  head: string; // Added property
  teamCount: number; // Added property
  employeeCount: number;
  status: 'Active' | 'Inactive';
}

type TabType = 'users' | 'teams' | 'departments';

const UserManagementInteractive = () => {
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [teamFilter, setTeamFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    // Fetch users from the API
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://dummyjson.com/users');
        const data = await response.json();
        const apiUsers: User[] = data.users.map((user: any) => ({
          id: user.id.toString(),
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: 'Associate', // Default role as 'Associate'
          team: 'General', // Default team
          department: 'General', // Default department
          reportsTo: 'None', // Default reportsTo
          status: user.isActive ? 'Active' : 'Inactive',
          lastActivity: 'Unknown', // Default last activity
          avatar: user.image,
          avatarAlt: `${user.firstName} ${user.lastName} profile picture`
        }));

        setUsers(apiUsers);
        setFilteredUsers(apiUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();

    // Initialize departments with mock data
    const mockDepartments: Department[] = [
      {
        id: '1',
        name: 'Product Development',
        description: 'Core product development and engineering',
        headOfDepartment: 'Sarah Chen',
        head: 'Sarah Chen',
        teamCount: 3,
        employeeCount: 25,
        status: 'Active'
      },
      {
        id: '2',
        name: 'Creative',
        description: 'Design and creative services',
        headOfDepartment: 'Emily Watson',
        head: 'Emily Watson',
        teamCount: 2,
        employeeCount: 15,
        status: 'Active'
      },
      {
        id: '3',
        name: 'Growth',
        description: 'Marketing and business growth',
        headOfDepartment: 'Alex Thompson',
        head: 'Alex Thompson',
        teamCount: 2,
        employeeCount: 12,
        status: 'Active'
      },
      {
        id: '4',
        name: 'Executive',
        description: 'Executive leadership and management',
        headOfDepartment: 'Bibhuti',
        head: 'Bibhuti',
        teamCount: 1,
        employeeCount: 5,
        status: 'Active'
      }
    ];
    setDepartments(mockDepartments);
  }, []);

  useEffect(() => {
    let filtered = users;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply role filter
    if (roleFilter !== 'All') {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Apply team filter
    if (teamFilter !== 'All') {
      filtered = filtered.filter((user) => user.team === teamFilter);
    }

    // Apply status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [searchQuery, roleFilter, teamFilter, statusFilter, users]);

  const handleAddUser = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter((u) => u.id !== userToDelete));
      setSelectedUsers(selectedUsers.filter((id) => id !== userToDelete));
    }
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleBulkDelete = () => {
    if (selectedUsers.length > 0) {
      setUsers(users.filter((u) => !selectedUsers.includes(u.id)));
      setSelectedUsers([]);
    }
  };

  const handleBulkStatusChange = (newStatus: 'Active' | 'Inactive') => {
    setUsers(
      users.map((u) =>
      selectedUsers.includes(u.id) ? { ...u, status: newStatus } : u
      )
    );
    setSelectedUsers([]);
  };

  const handleSaveUser = (userData: Omit<User, 'id' | 'lastActivity' | 'avatar' | 'avatarAlt'>) => {
    if (editingUser) {
      // Update existing user
      setUsers(
        users.map((u) =>
        u.id === editingUser.id ?
        { ...u, ...userData, lastActivity: 'Just now' } :
        u
        )
      );
    } else {
      // Add new user
      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        lastActivity: 'Just now',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        avatarAlt: `${userData.name} profile picture`
      };
      setUsers([...users, newUser]);
    }
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const tabs = [
    { id: 'users' as TabType, label: 'Users', icon: 'UserIcon' },
    { id: 'teams' as TabType, label: 'Teams', icon: 'UsersIcon' },
    { id: 'departments' as TabType, label: 'Departments', icon: 'BuildingOfficeIcon' }
  ];

  return (
    <div className="space-y-6" suppressHydrationWarning>
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-caption font-medium text-sm transition-smooth relative ${
                activeTab === tab.id
                  ? 'text-primary' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab.icon as any} size={18} variant="outline" />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'users' && (
        <>
          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-semibold text-xl text-foreground">All Users</h2>
              <p className="font-caption text-sm text-muted-foreground mt-1">
                {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <button
              onClick={handleAddUser}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-caption font-medium text-sm hover:bg-primary/90 transition-smooth">

              <Icon name="PlusIcon" size={18} variant="outline" />
              Add User
            </button>
          </div>

          {/* Filters */}
          <UserFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            roleFilter={roleFilter}
            onRoleFilterChange={setRoleFilter}
            teamFilter={teamFilter}
            onTeamFilterChange={setTeamFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter} />


          {/* Bulk Actions */}
          {selectedUsers.length > 0 &&
          <div className="flex items-center justify-between px-4 py-3 bg-primary/5 border border-primary/20 rounded-lg">
              <span className="font-caption text-sm text-foreground">
                {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <button
                onClick={() => handleBulkStatusChange('Active')}
                className="flex items-center gap-2 px-3 py-1.5 bg-success/10 border border-success/20 rounded-md text-xs font-caption font-medium text-success hover:bg-success/20 transition-smooth">

                  <Icon name="CheckCircleIcon" size={14} variant="outline" />
                  Activate
                </button>
                <button
                onClick={() => handleBulkStatusChange('Inactive')}
                className="flex items-center gap-2 px-3 py-1.5 bg-warning/10 border border-warning/20 rounded-md text-xs font-caption font-medium text-warning hover:bg-warning/20 transition-smooth">

                  <Icon name="XCircleIcon" size={14} variant="outline" />
                  Deactivate
                </button>
                <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-3 py-1.5 bg-error/10 border border-error/20 rounded-md text-xs font-caption font-medium text-error hover:bg-error/20 transition-smooth">

                  <Icon name="TrashIcon" size={14} variant="outline" />
                  Delete
                </button>
              </div>
            </div>
          }

          {/* User Table */}
          <UserTable
            users={filteredUsers}
            selectedUsers={selectedUsers}
            onSelectUsers={setSelectedUsers}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser} />


          {/* User Form Panel */}
          <UserFormPanel
            isOpen={isFormOpen}
            onClose={() => {
              setIsFormOpen(false);
              setEditingUser(null);
            }}
            onSave={handleSaveUser}
            editingUser={editingUser}
            existingUsers={users} />


          {/* Delete Confirmation Modal */}
          <DeleteConfirmModal
            isOpen={deleteModalOpen}
            onClose={() => {
              setDeleteModalOpen(false);
              setUserToDelete(null);
            }}
            onConfirm={confirmDelete}
            userName={users.find((u) => u.id === userToDelete)?.name || ''} />

        </>
      )}

      {/* Teams Tab */}
      {activeTab === 'teams' && <TeamsManagement departments={departments} users={users} />}

      {/* Departments Tab */}
      {activeTab === 'departments' && (
        <DepartmentsManagement onDepartmentUpdate={setDepartments} />
      )}
    </div>);

};

export default UserManagementInteractive;