'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import type { User } from './UserManagementInteractive';
import axios from 'axios';

interface UserFormPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: Omit<User, 'id' | 'lastActivity' | 'avatar' | 'avatarAlt'>) => void;
  editingUser: User | null;
  existingUsers: User[];
}

const UserFormPanel = ({
  isOpen,
  onClose,
  onSave,
  editingUser,
  existingUsers,
}: UserFormPanelProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Associate\' as \'Admin\' | \'Manager\' | \'Associate',
    team: '',
    department: '',
    reportsTo: '',
    status: 'Active\' as \'Active\' | \'Inactive',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
        team: editingUser.team,
        department: editingUser.department,
        reportsTo: editingUser.reportsTo,
        status: editingUser.status,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'Associate',
        team: '',
        department: '',
        reportsTo: '',
        status: 'Active',
      });
    }
    setErrors({});
  }, [editingUser, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.team) {
      newErrors.team = 'Team is required';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    if (!formData.reportsTo) {
      newErrors.reportsTo = 'Reporting manager is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  // Get potential managers (Admin and Manager roles)
  const potentialManagers = existingUsers.filter(
    (u) => (u.role === 'Admin' || u.role === 'Manager') && u.id !== editingUser?.id
  );

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/v1/users', {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiaWJodXRpLm5leHQiLCJpZCI6NjMsImF1dGhvcml0aWVzIjpbeyJhdXRob3JpdHkiOiJST0xFX0FETUlOIn1dLCJpYXQiOjE3NzE4Mzk5ODIsImV4cCI6MTc3MTkyNjM4Mn0.OzqDa6r3QAR6mkeoZ8nni9xXaHTtGTGA4NYXhbM0fdY`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadUsers = async () => {
      const users = await fetchUsers();
      // Update the existingUsers state with the fetched users
      onSave(users);
    };

    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-[2000] transition-smooth"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-card border-l border-border z-[2001] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
              aria-label="Close panel"
            >
              <Icon name="XMarkIcon" size={24} variant="outline" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block font-caption font-medium text-sm text-foreground mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-4 py-2.5 bg-background border rounded-lg font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.name ? 'border-error' : 'border-border'
              }`}
              placeholder="Enter full name"
            />
            {errors.name && (
              <p className="mt-1 font-caption text-xs text-error">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block font-caption font-medium text-sm text-foreground mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-4 py-2.5 bg-background border rounded-lg font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.email ? 'border-error' : 'border-border'
              }`}
              placeholder="user@nextgentask.com"
            />
            {errors.email && (
              <p className="mt-1 font-caption text-xs text-error">{errors.email}</p>
            )}
          </div>

          {/* Role and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-caption font-medium text-sm text-foreground mb-2">
                Role *
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  handleInputChange('role', e.target.value)
                }
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Associate">Associate</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block font-caption font-medium text-sm text-foreground mb-2">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  handleInputChange('status', e.target.value)
                }
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Team and Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-caption font-medium text-sm text-foreground mb-2">
                Team *
              </label>
              <select
                value={formData.team}
                onChange={(e) => handleInputChange('team', e.target.value)}
                className={`w-full px-4 py-2.5 bg-background border rounded-lg font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.team ? 'border-error' : 'border-border'
                }`}
              >
                <option value="">Select team</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Support">Support</option>
              </select>
              {errors.team && (
                <p className="mt-1 font-caption text-xs text-error">{errors.team}</p>
              )}
            </div>

            <div>
              <label className="block font-caption font-medium text-sm text-foreground mb-2">
                Department *
              </label>
              <select
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className={`w-full px-4 py-2.5 bg-background border rounded-lg font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.department ? 'border-error' : 'border-border'
                }`}
              >
                <option value="">Select department</option>
                <option value="Product Development">Product Development</option>
                <option value="Creative">Creative</option>
                <option value="Growth">Growth</option>
                <option value="Operations">Operations</option>
                <option value="Customer Success">Customer Success</option>
              </select>
              {errors.department && (
                <p className="mt-1 font-caption text-xs text-error">{errors.department}</p>
              )}
            </div>
          </div>

          {/* Reports To */}
          <div>
            <label className="block font-caption font-medium text-sm text-foreground mb-2">
              Reports To *
            </label>
            <select
              value={formData.reportsTo}
              onChange={(e) => handleInputChange('reportsTo', e.target.value)}
              className={`w-full px-4 py-2.5 bg-background border rounded-lg font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.reportsTo ? 'border-error' : 'border-border'
              }`}
            >
              <option value="">Select manager</option>
              {potentialManagers.map((manager) => (
                <option key={manager.id} value={manager.name}>
                  {manager.name} ({manager.role})
                </option>
              ))}
            </select>
            {errors.reportsTo && (
              <p className="mt-1 font-caption text-xs text-error">{errors.reportsTo}</p>
            )}
          </div>

          {/* Info Box */}
          <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <Icon
              name="InformationCircleIcon"
              size={20}
              variant="outline"
              className="text-primary flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="font-caption text-sm text-foreground font-medium mb-1">
                User Hierarchy
              </p>
              <p className="font-caption text-xs text-muted-foreground">
                Associates report to Managers or Admins. Managers report to Admins. This
                hierarchy determines access levels and approval workflows.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-muted text-foreground rounded-lg font-caption font-medium text-sm hover:bg-muted/80 transition-smooth"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-caption font-medium text-sm hover:bg-primary/90 transition-smooth"
            >
              {editingUser ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UserFormPanel;