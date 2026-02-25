'use client';

import { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import type { User } from './UserManagementInteractive';

interface UserTableProps {
  users: User[];
  selectedUsers: string[];
  onSelectUsers: (ids: string[]) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

const UserTable = ({
  users,
  selectedUsers,
  onSelectUsers,
  onEditUser,
  onDeleteUser,
}: UserTableProps) => {
  const [sortColumn, setSortColumn] = useState<keyof User | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: keyof User) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      onSelectUsers([]);
    } else {
      onSelectUsers(users.map((u) => u.id));
    }
  };

  const handleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      onSelectUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      onSelectUsers([...selectedUsers, userId]);
    }
  };

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'Admin':
        return 'text-error bg-error/10';
      case 'Manager':
        return 'text-warning bg-warning/10';
      case 'Associate':
        return 'text-success bg-success/10';
    }
  };

  const getStatusColor = (status: User['status']) => {
    return status === 'Active' ?'text-success bg-success/10' :'text-muted-foreground bg-muted';
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden w-full max-w-full">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === users.length && users.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                />
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-2 font-caption font-medium text-xs text-muted-foreground hover:text-foreground transition-smooth"
                >
                  User
                  <Icon name="ChevronUpDownIcon" size={14} variant="outline" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('role')}
                  className="flex items-center gap-2 font-caption font-medium text-xs text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Role
                  <Icon name="ChevronUpDownIcon" size={14} variant="outline" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('team')}
                  className="flex items-center gap-2 font-caption font-medium text-xs text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Team
                  <Icon name="ChevronUpDownIcon" size={14} variant="outline" />
                </button>
              </th> 
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('department')}
                  className="flex items-center gap-2 font-caption font-medium text-xs text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Department
                  <Icon name="ChevronUpDownIcon" size={14} variant="outline" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('reportsTo')}
                  className="flex items-center gap-2 font-caption font-medium text-xs text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Reports To
                  <Icon name="ChevronUpDownIcon" size={14} variant="outline" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-2 font-caption font-medium text-xs text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Status
                  <Icon name="ChevronUpDownIcon" size={14} variant="outline" />
                </button>
              </th>
              
              <th className="px-4 py-3 text-left">
                <span className="font-caption font-medium text-xs text-muted-foreground">
                  Last Activity
                </span>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="font-caption font-medium text-xs text-muted-foreground">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-border hover:bg-muted/30 transition-smooth"
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <AppImage
                      src={user.avatar}
                      alt={user.avatarAlt}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-caption font-medium text-sm text-foreground">
                        {user.name}
                      </p>
                      <p className="font-caption text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full font-caption text-xs font-medium ${
                      getRoleColor(user.role)
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div>
                    <p className="font-caption text-sm text-foreground">{user.team}</p>
                    <p className="font-caption text-xs text-muted-foreground">
                      {user.department}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="font-caption text-sm text-foreground">{user.department || 'N/A'}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="font-caption text-sm text-foreground">{user.reportsTo || 'N/A'}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="font-caption text-sm text-foreground">{user.status}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="font-caption text-sm text-muted-foreground">
                    {user.lastActivity}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEditUser(user)}
                      className="p-2 rounded-md text-primary hover:bg-primary/10 transition-smooth"
                      aria-label="Edit user"
                    >
                      <Icon name="PencilIcon" size={16} variant="outline" />
                    </button>
                    <button
                      onClick={() => onDeleteUser(user.id)}
                      className="p-2 rounded-md text-error hover:bg-error/10 transition-smooth"
                      aria-label="Delete user"
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

      {users.length === 0 && (
        <div className="py-12 text-center">
          <Icon
            name="UsersIcon"
            size={48}
            variant="outline"
            className="mx-auto text-muted-foreground mb-4"
          />
          <p className="font-caption text-sm text-muted-foreground">
            No users found matching your filters
          </p>
        </div>
      )}
    </div>
  );
};

export default UserTable;