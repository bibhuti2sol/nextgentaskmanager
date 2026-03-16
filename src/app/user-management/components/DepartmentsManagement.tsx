'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import axios, { AxiosError } from 'axios';

export interface Department {
  id: string;
  name: string;
  description: string;
  headOfDepartment: string; // Added property to match
  head: string;
  teamCount: number;
  employeeCount: number;
  status: 'Active' | 'Inactive';
  departmentHeadName?: string; // Added property to match API response
}

interface DepartmentsManagementProps {
  onDepartmentUpdate?: (departments: Department[]) => void;
}

const DepartmentsManagement = ({ onDepartmentUpdate }: DepartmentsManagementProps) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState<Omit<Department, 'id'>>({
    name: '',
    head: '',
    headOfDepartment: '', // Added property
    teamCount: 0,
    employeeCount: 0,
    status: 'Active',
    description: ''
  });
  const [departmentHeads, setDepartmentHeads] = useState<{ id: string; name: string }[]>([]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://43.205.137.114:8080/api/v1/departments', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyYWh1bC5nYW5kaGlAZXhhbXBsZS5jb20iLCJpZCI6OCwiYXV0aG9yaXRpZXMiOlt7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc3MzQ3NzY1OCwiZXhwIjoxNzc0MDgyNDU4fQ.nVsbZc2q9Cyl1IQD_iIj8LTv5zwOP0CbOyhEknz8f5o',
        },
      });

      if (response.status === 200 && Array.isArray(response.data)) {
        setDepartments(response.data);
        setFilteredDepartments(response.data);
        onDepartmentUpdate?.(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  useEffect(() => {
    fetchDepartments(); // Ensure departments are fetched on component mount
  }, []);

  useEffect(() => {
    let filtered = departments;
    if (searchQuery) {
      filtered = departments.filter(
        (dept: Department) =>
          dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dept.head.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredDepartments(filtered);
  }, [searchQuery, departments]);

  const fetchDepartmentHeads = async (): Promise<{ id: string; name: string }[]> => {
    try {
      const response = await axios.get('http://43.205.137.114:8080/api/v1/departments/heads/eligible', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyYWh1bC5nYW5kaGlAZXhhbXBsZS5jb20iLCJpZCI6OCwiYXV0aG9yaXRpZXMiOlt7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc3MzQ3NzY1OCwiZXhwIjoxNzc0MDgyNDU4fQ.nVsbZc2q9Cyl1IQD_iIj8LTv5zwOP0CbOyhEknz8f5o',
        },
      });

      if (response.status === 200 && Array.isArray(response.data)) {
        return response.data.map((head: any) => ({
          id: head.id,
          name: head.fullName, // Updated to use fullName for dropdown display
        }));
      } else {
        console.error('Unexpected response format:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching department heads:', error);
      return [];
    }
  };

  const loadDepartmentHeads = async () => {
    try {
      const heads = await fetchDepartmentHeads();
      setDepartmentHeads(heads);
    } catch (error) {
      console.error('Error loading department heads:', error);
    }
  };

  useEffect(() => {
    if (isFormOpen) {
      loadDepartmentHeads();
    }
  }, [isFormOpen]);

  const handleAddDepartment = () => {
    setEditingDepartment(null);
    setFormData({
      name: '',
      head: '',
      headOfDepartment: '', // Added property
      teamCount: 0,
      employeeCount: 0,
      status: 'Active',
      description: ''
    });
    setIsFormOpen(true);
  };

  const handleEditDepartment = async (department: Department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      head: department.departmentHeadName || '',
      headOfDepartment: department.departmentHeadName || '',
      teamCount: department.teamCount,
      employeeCount: department.employeeCount,
      status: department.status,
      description: department.description,
    });

    // Fetch department heads when editing a department
    await loadDepartmentHeads();

    setIsFormOpen(true);
  };

  const handleDeleteDepartment = async (departmentId: string) => {
    if (!departmentId) {
      console.error('Invalid department ID. Cannot proceed with deletion.');
      alert('Invalid department ID. Please try again.');
      return;
    }

    if (confirm('Are you sure you want to delete this department?')) {
      try {
        console.log(`Attempting to delete department with ID: ${departmentId}`);
        const response = await axios.delete(`http://43.205.137.114:8080/api/v1/departments/${departmentId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyYWh1bC5nYW5kaGlAZXhhbXBsZS5jb20iLCJpZCI6OCwiYXV0aG9yaXRpZXMiOlt7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc3MzQ3NzY1OCwiZXhwIjoxNzc0MDgyNDU4fQ.nVsbZc2q9Cyl1IQD_iIj8LTv5zwOP0CbOyhEknz8f5o',
          },
        });

        if (response.status === 200 || response.status === 204) {
          console.log(`Department with ID: ${departmentId} deleted successfully.`);
          await fetchDepartments(); // Auto-refresh after delete
        } else {
          console.error(`Failed to delete department. Status: ${response.status}, Response:`, response.data);
          alert('Failed to delete the department. Please try again later.');
        }
      } catch (error) {
        console.error('Error deleting department:', error);
        alert('An error occurred while deleting the department. Please try again later.');
      }
    }
  };

  const handleSaveDepartment = async () => {
    const missingFields = [];

    if (!formData.name) missingFields.push('Name');
    if (!formData.head) missingFields.push('Department Head');
    if (!formData.status) missingFields.push('Status');

    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }

    const departmentData = {
      name: formData.name,
      description: formData.description,
      status: formData.status.toUpperCase(),
      departmentHeadId: departmentHeads.find((head) => head.name === formData.head)?.id || null,
      departmentHeadName: formData.head,
    };

    try {
      if (editingDepartment) {
        // Update existing department
        const response = await axios.put(
          `http://43.205.137.114:8080/api/v1/departments/${editingDepartment.id}`,
          departmentData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyYWh1bC5nYW5kaGlAZXhhbXBsZS5jb20iLCJpZCI6OCwiYXV0aG9yaXRpZXMiOlt7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc3MzQ3NzY1OCwiZXhwIjoxNzc0MDgyNDU4fQ.nVsbZc2q9Cyl1IQD_iIj8LTv5zwOP0CbOyhEknz8f5o',
            },
          }
        );

        if (response.status === 200) {
          await fetchDepartments(); // Auto-refresh after update
        }
      } else {
        // Add new department
        const response = await axios.post(
          'http://43.205.137.114:8080/api/v1/departments',
          departmentData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyYWh1bC5nYW5kaGlAZXhhbXBsZS5jb20iLCJpZCI6OCwiYXV0aG9yaXRpZXMiOlt7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImlhdCI6MTc3MzQ3NzY1OCwiZXhwIjoxNzc0MDgyNDU4fQ.nVsbZc2q9Cyl1IQD_iIj8LTv5zwOP0CbOyhEknz8f5o',
            },
          }
        );

        if (response.status === 201) {
          await fetchDepartments(); // Auto-refresh after add
        }
      }
    } catch (error) {
      console.error('Error saving department:', error);
    }

    setIsFormOpen(false);
    setEditingDepartment(null);
  };

  const handleDropdownFocus = async () => {
    if (departmentHeads.length === 0) {
      await loadDepartmentHeads();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-semibold text-xl text-foreground">All Departments</h2>
          <p className="font-caption text-sm text-muted-foreground mt-1">
            {filteredDepartments.length} department{filteredDepartments.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <button
          onClick={handleAddDepartment}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg font-caption font-medium text-sm hover:opacity-90 transition-smooth"
        >
          <Icon name="PlusIcon" size={18} variant="outline" />
          Add Department
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
          placeholder="Search by department name or head..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Departments Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Department Name
                </th>
                <th className="px-6 py-3 text-left font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Department Head
                </th>
                <th className="px-6 py-3 text-left font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Teams
                </th>
                <th className="px-6 py-3 text-left font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Employees
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
              {filteredDepartments.map((department) => (
                <tr key={department.id} className="hover:bg-muted/30 transition-smooth">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-caption font-medium text-sm text-foreground">
                        {department.name}
                      </div>
                      <div className="font-caption text-xs text-muted-foreground mt-0.5">
                        {department.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-caption text-sm text-foreground">
                      {department.departmentHeadName || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-caption text-sm text-foreground">{department.teamCount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-caption text-sm text-foreground">{department.employeeCount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full font-caption font-medium text-xs ${
                        department.status === 'Active' ?'bg-success/10 text-success' :'bg-muted text-muted-foreground'
                      }`}
                    >
                      {department.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditDepartment(department)}
                        className="p-1.5 text-primary hover:bg-primary/10 rounded transition-smooth"
                        aria-label="Edit department"
                      >
                        <Icon name="PencilIcon" size={16} variant="outline" />
                      </button>
                      <button
                        onClick={() => handleDeleteDepartment(department.id)}
                        className="p-1.5 text-error hover:bg-error/10 rounded transition-smooth"
                        aria-label="Delete department"
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
                {editingDepartment ? 'Edit Department' : 'Add New Department'}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block font-caption font-medium text-sm text-foreground mb-2">
                  Department Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Enter department name"
                />
              </div>
              <div>
                <label className="block font-caption font-medium text-sm text-foreground mb-2">
                  Department Head
                </label>
                <select
                  value={formData.head}
                  onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                  onFocus={handleDropdownFocus}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Select department head</option>
                  {departmentHeads.map((head) => (
                    <option key={head.id} value={head.name}>
                      {head.name}
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
                  placeholder="Enter department description"
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
                  setEditingDepartment(null);
                }}
                className="px-4 py-2 border border-border rounded-lg font-caption font-medium text-sm text-muted-foreground hover:bg-muted/80 transition-smooth"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDepartment}
                className="px-4 py-2 bg-accent text-accent-foreground rounded-lg font-caption font-medium text-sm hover:bg-accent/90 transition-smooth"
              >
                {editingDepartment ? 'Update Department' : 'Add Department'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentsManagement;