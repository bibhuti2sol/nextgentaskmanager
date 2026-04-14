'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import type { User } from './UserManagementInteractive';
import axios, { AxiosError } from 'axios';

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
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    role: ('Admin' | 'Manager' | 'Associate')[]; // Updated to array type
    team: string;
    department: string;
    reportsTo: string;
    managerId?: number | null;
    projectManagerId?: number | null;
    status: 'Active' | 'Inactive';
    password?: string;
    username: string; // Added username field
  }>({
    firstName: '',
    lastName: '',
    email: '',
    role: ['Associate'],
    team: '',
    department: '',
    reportsTo: '',
    managerId: null,
    projectManagerId: null,
    status: 'Active',
    password: '',
    username: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [users, setUsers] = useState<Omit<User, 'id' | 'lastActivity' | 'avatar' | 'avatarAlt'>[]>([]);
  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
  const [teams, setTeams] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    if (editingUser) {
      setFormData({
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        email: editingUser.email,
        role: editingUser.role ? [editingUser.role] : [], // Convert to array
        team: editingUser.team,
        department: editingUser.department,
        reportsTo: editingUser.reportsTo,
        managerId: editingUser.managerId,
        projectManagerId: editingUser.projectManagerId,
        status: editingUser.status,
        password: '',
        username: editingUser.email, // Or editingUser.username if available
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        role: ['Associate'],
        team: '',
        department: '',
        reportsTo: '',
        managerId: null,
        projectManagerId: null,
        status: 'Active',
        password: '',
        username: '',
      });
    }
    setErrors({});
  }, [editingUser, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    /* Username hidden as per user request */

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
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

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const userData = {
          username: formData.username || formData.email, // Use explicit username or fallback to email
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          roles: formData.role.map((role) => `ROLE_${role.toUpperCase()}`),
          departmentId: parseInt(formData.department),
          teamId: parseInt(formData.team),
          managerId: formData.managerId,
          projectManagerId: formData.projectManagerId || formData.managerId,
          team: formData.team,
          department: formData.department,
          reportsTo: formData.reportsTo,
          status: formData.status,
        };

        const response = await axios.post('http://43.205.137.114:8080/api/v1/auth/signup', userData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYXJlbmRyYS5tb2RpQGV4YW1wbGUuY29tIiwiaWQiOjM5LCJhdXRob3JpdGllcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9BRE1JTiJ9XSwiaWF0IjoxNzc2MTQ5NDkwLCJleHAiOjE3Nzg3NDE0OTB9.1YBLYJP5OKWGx-qgBllPTaqjae5ShbDrgOw-rr5wRTs',
          },
        });

        if (response.status === 200 || response.status === 201) {
          console.log('User created successfully:', response.data);
          const savedUser = response.data.data || response.data;
          onSave({
            ...userData,
            id: savedUser.id?.toString(), // Use the real backend ID
            name: `${formData.firstName} ${formData.lastName}`,
            role: formData.role[0] || 'Associate',
          } as any);
          onClose();
        } else {
          console.error(`Unexpected response status: ${response.status}`, response.data);
          alert('Failed to create user. Please try again later.');
        }
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        console.error('Error creating user:', axiosError);

        if (axiosError.response) {
          console.error('Server responded with:', axiosError.response.data);
          const serverMessage = axiosError.response.data?.message || `Server error: ${axiosError.response.status}`;
          alert(`Failed to create user: ${serverMessage}`);
        } else {
          console.error('No response received from server:', axiosError.message);
          alert('Failed to create user. Please check your network connection.');
        }
      }
    }
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  // Get potential managers (Admin and Manager roles)
  const potentialManagers = existingUsers.filter(
    (u) => (u.role === 'Admin' || u.role === 'Manager') && u.id !== editingUser?.id
  );

  const fetchUsers = async (): Promise<Omit<User, 'id' | 'lastActivity' | 'avatar' | 'avatarAlt'>[]> => {
    try {
      // Replace the API call with a placeholder or mock data
      const response = { data: [] }; // Mocked empty data
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  const fetchDepartments = async (): Promise<{ id: number; name: string }[]> => {
    try {
      const response = await axios.get('http://43.205.137.114:8080/api/v1/departments', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYXJlbmRyYS5tb2RpQGV4YW1wbGUuY29tIiwiaWQiOjM5LCJhdXRob3JpdGllcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9BRE1JTiJ9XSwiaWF0IjoxNzc2MTQ5NDkwLCJleHAiOjE3Nzg3NDE0OTB9.1YBLYJP5OKWGx-qgBllPTaqjae5ShbDrgOw-rr5wRTs',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching departments:', error);
      return [];
    }
  };

  const fetchTeamsByDepartment = async (departmentId: string): Promise<{ id: number; name: string }[]> => {
    try {
      const response = await axios.get(`http://43.205.137.114:8080/api/v1/teams/department/${departmentId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYXJlbmRyYS5tb2RpQGV4YW1wbGUuY29tIiwiaWQiOjM5LCJhdXRob3JpdGllcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9BRE1JTiJ9XSwiaWF0IjoxNzc2MTQ5NDkwLCJleHAiOjE3Nzg3NDE0OTB9.1YBLYJP5OKWGx-qgBllPTaqjae5ShbDrgOw-rr5wRTs',
        },
      });
      return response.data.map((team: any) => ({ id: team.id, name: team.name }));
    } catch (error) {
      console.error('Error fetching teams:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const departments = await fetchDepartments();
        setDepartments(departments);
      } catch (error) {
        console.error('Error loading departments:', error);
      }
    };

    if (isOpen) {
      loadDepartments();
    }
  }, [isOpen]);

  useEffect(() => {
    const loadTeams = async () => {
      if (formData.department) {
        try {
          const fetchedTeams = await fetchTeamsByDepartment(formData.department);
          setTeams(fetchedTeams);
        } catch (error) {
          console.error('Error loading teams:', error);
        }
      } else {
        setTeams([]);
      }
    };

    loadTeams();
  }, [formData.department]);

  const handleSave = (users: Omit<User, 'id' | 'lastActivity' | 'avatar' | 'avatarAlt'>[]) => {
    // Update the existingUsers state with the fetched users
    setUsers((prevUsers) => [...prevUsers, ...users]);
  };

  const handleSaveUsers = async () => {
    const users = await fetchUsers();
    handleSave(users); // Pass the entire array to handleSave
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-[2000] transition-smooth"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-[2001] pointer-events-none p-4 sm:p-6">
        <div
          className="w-full max-w-4xl bg-card border border-border rounded-lg shadow-elevation-3 overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] pointer-events-auto mx-auto mt-auto sm:mt-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
            <div>
              <h2 className="font-heading font-bold text-xl text-foreground">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h2>
              <p className="font-caption text-sm text-muted-foreground mt-1">
                {editingUser ? 'Update user details and permissions' : 'Fill in the details to create a new user'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted transition-smooth"
              aria-label="Close panel"
            >
              <Icon name="XMarkIcon" size={20} variant="outline" className="text-muted-foreground" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-y-auto">
            {/* First Name */}
            <div>
              <label className="block font-caption font-medium text-sm text-foreground mb-1">
                First Name *
              </label>
              <input
                type="text"
                value={formData.firstName || ''}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`w-full px-4 py-2 bg-background border rounded-md font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${errors.firstName ? 'border-error' : 'border-border'
                  }`}
                placeholder="Enter first name"
                required
              />
              {errors.firstName && (
                <p className="mt-1 font-caption text-xs text-error">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block font-caption font-medium text-sm text-foreground mb-1">
                Last Name *
              </label>
              <input
                type="text"
                value={formData.lastName || ''}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={`w-full px-4 py-2 bg-background border rounded-md font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${errors.lastName ? 'border-error' : 'border-border'
                  }`}
                placeholder="Enter last name"
                required
              />
              {errors.lastName && (
                <p className="mt-1 font-caption text-xs text-error">{errors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block font-caption font-medium text-sm text-foreground mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-2 bg-background border rounded-md font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${errors.email ? 'border-error' : 'border-border'
                  }`}
                placeholder="user@nextgentask.com"
              />
              {errors.email && (
                <p className="mt-1 font-caption text-xs text-error">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block font-caption font-medium text-sm text-foreground mb-1">
                Password *
              </label>
              <input
                type="password"
                value={formData.password || ''}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full px-4 py-2 bg-background border rounded-md font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${errors.password ? 'border-error' : 'border-border'
                  }`}
                placeholder="Enter password"
                required
              />
              {errors.password && (
                <p className="mt-1 font-caption text-xs text-error">{errors.password}</p>
              )}
            </div>

            {/* Role (Checkboxes) */}
            <div className="sm:col-span-2">
              <label className="block font-caption font-medium text-sm text-foreground mb-1">
                Role *
              </label>
              <div className="flex items-center gap-4 px-4 py-2 bg-background border border-border rounded-md">
                <label className="flex items-center gap-2 font-caption text-sm">
                  <input
                    type="checkbox"
                    checked={formData.role.includes('Admin')}
                    onChange={(e) => {
                      const roles = formData.role.includes('Admin')
                        ? formData.role.filter((r) => r !== 'Admin')
                        : [...formData.role, 'Admin'];
                      handleInputChange('role', roles);
                    }}
                    className="form-checkbox text-primary focus:ring-primary"
                  />
                  Admin
                </label>
                <label className="flex items-center gap-2 font-caption text-sm">
                  <input
                    type="checkbox"
                    checked={formData.role.includes('Manager')}
                    onChange={(e) => {
                      const roles = formData.role.includes('Manager')
                        ? formData.role.filter((r) => r !== 'Manager')
                        : [...formData.role, 'Manager'];
                      handleInputChange('role', roles);
                    }}
                    className="form-checkbox text-primary focus:ring-primary"
                  />
                  Manager
                </label>
                <label className="flex items-center gap-2 font-caption text-sm">
                  <input
                    type="checkbox"
                    checked={formData.role.includes('Associate')}
                    onChange={(e) => {
                      const roles = formData.role.includes('Associate')
                        ? formData.role.filter((r) => r !== 'Associate')
                        : [...formData.role, 'Associate'];
                      handleInputChange('role', roles);
                    }}
                    className="form-checkbox text-primary focus:ring-primary"
                  />
                  Associate
                </label>
              </div>
              {errors.role && (
                <p className="mt-1 font-caption text-xs text-error">{errors.role}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block font-caption font-medium text-sm text-foreground mb-1">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  handleInputChange('status', e.target.value)
                }
                className="w-full px-4 py-2 bg-background border border-border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Reports To */}
            <div>
              <label className="block font-caption font-medium text-sm text-foreground mb-1">
                Reports To *
              </label>
              <select
                value={formData.managerId?.toString() || ''}
                onChange={(e) => {
                  const managerId = parseInt(e.target.value);
                  const manager = potentialManagers.find(m => parseInt(m.id) === managerId);
                  setFormData({
                    ...formData,
                    managerId: managerId,
                    projectManagerId: managerId,
                    reportsTo: manager ? manager.name : ''
                  });
                  if (errors.reportsTo) setErrors({ ...errors, reportsTo: '' });
                }}
                className={`w-full px-4 py-2 bg-background border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${errors.reportsTo ? 'border-error' : 'border-border'
                  }`}
              >
                <option value="">Select manager</option>
                {potentialManagers.map((manager) => (
                  <option key={manager.id} value={manager.id}>
                    {manager.name} ({manager.role})
                  </option>
                ))}
              </select>
              {errors.reportsTo && (
                <p className="mt-1 font-caption text-xs text-error">{errors.reportsTo}</p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="block font-caption font-medium text-sm text-foreground mb-1">
                Department *
              </label>
              <select
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className={`w-full px-4 py-2 bg-background border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${errors.department ? 'border-error' : 'border-border'
                  }`}
              >
                <option value="">Select department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="mt-1 font-caption text-xs text-error">{errors.department}</p>
              )}
            </div>

            {/* Team */}
            <div>
              <label className="block font-caption font-medium text-sm text-foreground mb-1">
                Team *
              </label>
              <select
                value={formData.team}
                onChange={(e) => handleInputChange('team', e.target.value)}
                className={`w-full px-4 py-2 bg-background border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${errors.team ? 'border-error' : 'border-border'
                  }`}
              >
                <option value="">Select team</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
              {errors.team && (
                <p className="mt-1 font-caption text-xs text-error">{errors.team}</p>
              )}
            </div>

            {/* Info Box */}
            <div className="sm:col-span-2 lg:col-span-4 flex items-start gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <Icon
                name="InformationCircleIcon"
                size={20}
                variant="outline"
                className="text-primary flex-shrink-0 mt-0.5"
              />
              <div>
                <p className="font-caption text-sm text-foreground font-medium mb-0.5">
                  User Hierarchy
                </p>
                <p className="font-caption text-xs text-muted-foreground">
                  Associates report to Managers or Admins. Managers report to Admins. This
                  hierarchy determines access levels and approval workflows.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sm:col-span-2 lg:col-span-4 flex flex-col sm:flex-row gap-3 pt-4 mt-2 border-t border-border shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-background border border-border rounded-md font-caption text-sm font-medium text-foreground hover:bg-muted transition-smooth"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-md font-caption text-sm font-medium hover:opacity-90 transition-smooth flex items-center justify-center gap-2"
              >
                <Icon name={editingUser ? "PencilIcon" : "PlusIcon"} size={18} variant="outline" />
                {editingUser ? 'Update User' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserFormPanel;
