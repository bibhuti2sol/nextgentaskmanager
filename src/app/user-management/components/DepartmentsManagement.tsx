'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

export interface Department {
  id: string;
  name: string;
  description: string;
  headOfDepartment: string; // Added property to match
  head: string;
  teamCount: number;
  employeeCount: number;
  status: 'Active' | 'Inactive';
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

  useEffect(() => {
    const mockDepartments: Department[] = [
      {
        id: '1',
        name: 'Product Development',
        head: 'Sarah Chen',
        teamCount: 3,
        employeeCount: 25,
        status: 'Active',
        description: 'Product development and engineering',
        headOfDepartment: 'Sarah Chen' // Added property to match
      },
      {
        id: '2',
        name: 'Creative',
        head: 'Emily Watson',
        teamCount: 2,
        employeeCount: 15,
        status: 'Active',
        description: 'Design and creative services',
        headOfDepartment: 'Emily Watson' // Added property to match
      },
      {
        id: '3',
        name: 'Growth',
        head: 'Alex Thompson',
        teamCount: 2,
        employeeCount: 12,
        status: 'Active',
        description: 'Marketing and business growth',
        headOfDepartment: 'Alex Thompson' // Added property to match
      },
      {
        id: '4',
        name: 'Executive',
        head: 'Bibhuti',
        teamCount: 1,
        employeeCount: 5,
        status: 'Active',
        description: 'Executive leadership and management',
        headOfDepartment: 'Bibhuti' // Added property to match
      }
    ];
    setDepartments(mockDepartments);
    setFilteredDepartments(mockDepartments);
  }, []);

  useEffect(() => {
    let filtered = departments;
    if (searchQuery) {
      filtered = filtered.filter(
        (dept) =>
          dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dept.head.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredDepartments(filtered);
  }, [searchQuery, departments]);

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

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      head: department.head,
      headOfDepartment: department.head, // Added property
      teamCount: department.teamCount,
      employeeCount: department.employeeCount,
      status: department.status,
      description: department.description
    });
    setIsFormOpen(true);
  };

  const handleDeleteDepartment = (departmentId: string) => {
    if (confirm('Are you sure you want to delete this department?')) {
      const updatedDepartments = departments.filter((d) => d.id !== departmentId);
      setDepartments(updatedDepartments);
      onDepartmentUpdate?.(updatedDepartments);
    }
  };

  const handleSaveDepartment = () => {
    if (editingDepartment) {
      const updatedDepartments = departments.map((d) =>
        d.id === editingDepartment.id ? { ...d, ...formData } : d
      );
      setDepartments(updatedDepartments);
      onDepartmentUpdate?.(updatedDepartments);
    } else {
      const newDepartment: Department = {
        ...formData,
        id: Date.now().toString(),
        headOfDepartment: formData.head // Added property to match
      };
      const updatedDepartments = [...departments, newDepartment];
      setDepartments(updatedDepartments);
      onDepartmentUpdate?.(updatedDepartments);
    }
    setIsFormOpen(false);
    setEditingDepartment(null);
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
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-caption font-medium text-sm hover:bg-primary/90 transition-smooth"
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
                    <span className="font-caption text-sm text-foreground">{department.head}</span>
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
                <input
                  type="text"
                  value={formData.head}
                  onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Enter department head name"
                />
              </div>
              <div>
                <label className="block font-caption font-medium text-sm text-foreground mb-2">
                  Team Count
                </label>
                <input
                  type="number"
                  value={formData.teamCount}
                  onChange={(e) => setFormData({ ...formData, teamCount: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Enter team count"
                />
              </div>
              <div>
                <label className="block font-caption font-medium text-sm text-foreground mb-2">
                  Employee Count
                </label>
                <input
                  type="number"
                  value={formData.employeeCount}
                  onChange={(e) => setFormData({ ...formData, employeeCount: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Enter employee count"
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
                className="px-4 py-2 border border-border rounded-lg font-caption font-medium text-sm text-foreground hover:bg-muted transition-smooth"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDepartment}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-caption font-medium text-sm hover:bg-primary/90 transition-smooth"
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