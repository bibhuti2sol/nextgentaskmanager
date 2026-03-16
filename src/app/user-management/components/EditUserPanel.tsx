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
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyYWh1bC5nYW5kaGlAZXhhbXBsZS5jb20iLCJpZCI6OCwiYXV0aG9yaXRpZXMiOlt7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc3MzQ3NzY1OCwiZXhwIjoxNzc0MDgyNDU4fQ.nVsbZc2q9Cyl1IQD_iIj8LTv5zwOP0CbOyhEknz8f5o',
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
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyYWh1bC5nYW5kaGlAZXhhbXBsZS5jb20iLCJpZCI6OCwiYXV0aG9yaXRpZXMiOlt7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc3MzQ3NzY1OCwiZXhwIjoxNzc0MDgyNDU4fQ.nVsbZc2q9Cyl1IQD_iIj8LTv5zwOP0CbOyhEknz8f5o',
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
      const updatedUser = {
        email: form.email,
        firstName: form.firstName, // Use provided value
        lastName: form.lastName, // Use provided value
        roles: [form.role ? `ROLE_${form.role.toUpperCase()}` : ''],
        departmentId: departments.find((dept) => dept.name === form.department)?.id || null,
        teamId: teams.find((team) => team.name === form.team)?.id || null,
        managerId: users.find((user) => user.name === form.reportsTo)?.id || null,
      };

      const response = await axios.put(
        `http://43.205.137.114:8080/api/v1/users/${user.id}`,
        updatedUser,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyYWh1bC5nYW5kaGlAZXhhbXBsZS5jb20iLCJpZCI6OCwiYXV0aG9yaXRpZXMiOlt7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc3MzQ3NzY1OCwiZXhwIjoxNzc0MDgyNDU4fQ.nVsbZc2q9Cyl1IQD_iIj8LTv5zwOP0CbOyhEknz8f5o',
          },
        }
      );

      if (response.status === 200) {
        console.log('User updated successfully:', response.data);
        onSave(response.data);
        onClose();
        window.location.reload(); // Refresh the page after the action
      } else {
        console.error(`Unexpected response status: ${response.status}`, response.data);
        alert('Failed to update user. Please try again later.');
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error updating user:', axiosError);

      if (axiosError.response) {
        console.error('Server responded with:', axiosError.response.data);
        alert(`Failed to update user. Server error: ${axiosError.response.status}`);
      } else {
        console.error('No response received from server:', axiosError.message);
        alert('Failed to update user. Please check your network connection.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Edit User</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary focus:outline-none"
            />
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
              name="reportsTo"
              value={form.reportsTo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="">Select Manager</option>
              {users
                .filter((u) => u.role === 'Admin' || u.role === 'Manager')
                .map((manager) => (
                  <option key={manager.id} value={manager.name}>
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