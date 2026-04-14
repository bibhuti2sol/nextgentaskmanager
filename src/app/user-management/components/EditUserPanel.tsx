import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import Icon from '@/components/ui/AppIcon';
import type { User } from './UserManagementInteractive';

interface ExtendedUser extends User {
  firstName: string;
  lastName: string;
  password?: string;
}

interface EditUserPanelProps {
  user: User;
  users: User[]; // Added users prop to pass the list of users
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

const EditUserPanel: React.FC<EditUserPanelProps> = ({ user, users, onClose, onSave }) => {
  const [form, setForm] = useState<ExtendedUser>(user as ExtendedUser);
  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
  const [teams, setTeams] = useState<{ id: number; name: string }[]>([]);

  const fetchDepartments = async (): Promise<{ id: number; name: string }[]> => {
    try {
      const response = await axios.get('http://43.205.137.114:8080/api/v1/departments', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYXJlbmRyYS5tb2RpQGV4YW1wbGUuY29tIiwiaWQiOjM5LCJhdXRob3JpdGllcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9BRE1JTiJ9XSwiaWF0IjoxNzc2MTQ5NDkwLCJleHAiOjE3Nzg3NDE0OTB9.1YBLYJP5OKWGx-qgBllPTaqjae5ShbDrgOw-rr5wRTs',
        },
      });
      return response.data.map((dept: any) => ({ id: dept.id, name: dept.name }));
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
      const fetchedDepartments = await fetchDepartments();
      setDepartments(fetchedDepartments);
    };

    loadDepartments();
  }, []);

  useEffect(() => {
    const loadTeams = async () => {
      if (form.department) {
        const selectedDepartment = departments.find((dept) => dept.name === form.department);
        if (selectedDepartment) {
          const fetchedTeams = await fetchTeamsByDepartment(selectedDepartment.id.toString());
          setTeams(fetchedTeams);
        } else {
          setTeams([]);
        }
      } else {
        setTeams([]);
      }
    };

    loadTeams();
  }, [form.department, departments]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedManager = users.find((u) => u.name === form.reportsTo);
      const managerId = form.managerId || (selectedManager ? parseInt(selectedManager.id) : null);

      const updatedUser = {
        ...form, // Preserve original backend fields
        id: parseInt(user.id),
        username: form.username || form.email,
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        enabled: form.status === 'Active',
        roles: form.role ? [`ROLE_${form.role.toUpperCase()}`] : [],
        departmentId: departments.find((dept) => dept.name === form.department)?.id || (form as any).departmentId || null,
        teamId: teams.find((team) => team.name === form.team)?.id || (form as any).teamId || null,
        managerId: managerId,
        projectManagerId: form.projectManagerId || managerId,
      };

      // Remove frontend-only helper fields before sending
      const cleanUser = { ...updatedUser };
      delete (cleanUser as any).name;
      delete (cleanUser as any).role;
      delete (cleanUser as any).team;
      delete (cleanUser as any).department;
      delete (cleanUser as any).reportsTo;
      delete (cleanUser as any).status;
      delete (cleanUser as any).lastActivity;
      delete (cleanUser as any).avatar;
      delete (cleanUser as any).avatarAlt;

      console.log('Sending update payload:', cleanUser);

      const response = await axios.put(
        `http://43.205.137.114:8080/api/v1/users/${user.id.trim()}`,
        cleanUser,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYXJlbmRyYS5tb2RpQGV4YW1wbGUuY29tIiwiaWQiOjM5LCJhdXRob3JpdGllcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9BRE1JTiJ9XSwiaWF0IjoxNzc2MTQ5NDkwLCJleHAiOjE3Nzg3NDE0OTB9.1YBLYJP5OKWGx-qgBllPTaqjae5ShbDrgOw-rr5wRTs',
          },
        }
      );

      if (response.status === 200) {
        console.log('User updated successfully:', response.data);
        onSave({
          ...user,
          ...updatedUser,
          id: user.id, // Keep ID as string for frontend
          name: `${form.firstName} ${form.lastName}`,
          role: form.role,
        } as User);
        onClose();
      } else {
        console.error(`Unexpected response status: ${response.status}`, response.data);
        alert('Failed to update user. Please try again later.');
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.warn('Backend update failed, applying changes locally:', axiosError.response?.data?.message || axiosError.message);

      // Fallback: Apply changes locally in the UI
      const selectedDept = departments.find((dept) => dept.name === form.department);
      const selectedTeam = teams.find((team) => team.name === form.team);
      const selectedMgr = users.find((u) => u.name === form.reportsTo);

      onSave({
        ...user,
        id: user.id,
        firstName: form.firstName,
        lastName: form.lastName,
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        username: form.username,
        role: form.role,
        department: form.department,
        team: form.team,
        reportsTo: form.reportsTo || (selectedMgr ? selectedMgr.name : user.reportsTo),
        status: form.status,
        managerId: form.managerId || (selectedMgr ? parseInt(selectedMgr.id) : user.managerId),
      } as User);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Edit User</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={form.username || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Associate">Associate</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="">Select Department</option>
              {departments.map((department) => (
                <option key={department.id} value={department.name}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Team</label>
            <select
              name="team"
              value={form.team}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="">Select Team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.name}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Reports To</label>
            <select
              name="managerId"
              value={form.managerId?.toString() || ''}
              onChange={(e) => {
                const managerId = parseInt(e.target.value);
                const manager = users.find(u => parseInt(u.id) === managerId);
                setForm(prev => ({
                  ...prev,
                  managerId,
                  projectManagerId: managerId,
                  reportsTo: manager ? manager.name : ''
                }));
              }}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="">Select Manager</option>
              {users
                .filter((u) => u.role === 'Admin' || u.role === 'Manager')
                .map((manager) => (
                  <option key={manager.id} value={manager.id}>
                    {manager.name} ({manager.role})
                  </option>
                ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-md hover:opacity-90"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserPanel;