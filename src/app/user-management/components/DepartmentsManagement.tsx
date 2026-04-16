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
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchDepartments = async (search = '', status = '', page = 0, size = 10, sort = 'id,DESC') => {
    try {
      const queryParams = new URLSearchParams({
        search,
        status,
        page: page.toString(),
        size: size.toString(),
        sort,
      });

      const response = await axios.get(`http://43.205.137.114:8080/api/v1/departments?${queryParams.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYXJlbmRyYS5tb2RpQGV4YW1wbGUuY29tIiwiaWQiOjM5LCJhdXRob3JpdGllcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9BRE1JTiJ9XSwiaWF0IjoxNzc2MTQ5NDkwLCJleHAiOjE3Nzg3NDE0OTB9.1YBLYJP5OKWGx-qgBllPTaqjae5ShbDrgOw-rr5wRTs',
        },
      });

      if (response.status === 200) {
        const data = response.data;
        if (data.content && Array.isArray(data.content)) {
          const sortedContent = data.content.sort((a: any, b: any) => b.id - a.id);
          setDepartments(sortedContent);
          setFilteredDepartments(sortedContent);
          setTotalPages(data.totalPages || 0);
          setTotalRecords(data.totalElements || 0);
          onDepartmentUpdate?.(sortedContent);
        } else if (Array.isArray(data)) {
          // Fallback if the API returns a simple array (non-paginated)
          const sortedData = data.sort((a: any, b: any) => b.id - a.id);
          setDepartments(sortedData);
          setFilteredDepartments(sortedData);
          setTotalPages(Math.ceil(data.length / 10)); // Calculate total pages correctly
          setTotalRecords(data.length);
          onDepartmentUpdate?.(sortedData);
        }
      } else {
        console.error('Unexpected response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchDepartments(searchQuery, '', newPage, 10, 'id,DESC');
  };

  useEffect(() => {
    fetchDepartments(searchQuery, '', currentPage, 10, 'id,DESC');
  }, [searchQuery, currentPage]);

  useEffect(() => {
    let filtered = departments;
    if (searchQuery) {
      filtered = departments.filter(
        (dept: Department) =>
          dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (dept.head?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      );
    }
    setFilteredDepartments(filtered);
  }, [searchQuery, departments]);

  const fetchDepartmentHeads = async (): Promise<{ id: string; name: string }[]> => {
    try {
      const response = await axios.get('http://43.205.137.114:8080/api/v1/departments/heads/eligible', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYXJlbmRyYS5tb2RpQGV4YW1wbGUuY29tIiwiaWQiOjM5LCJhdXRob3JpdGllcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9BRE1JTiJ9XSwiaWF0IjoxNzc2MTQ5NDkwLCJleHAiOjE3Nzg3NDE0OTB9.1YBLYJP5OKWGx-qgBllPTaqjae5ShbDrgOw-rr5wRTs',
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
    setFormErrors({});
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

    setFormErrors({});
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

    const department = departments.find(d => d.id === departmentId);
    if (department && (department.teamCount > 0 || department.employeeCount > 0)) {
      alert(`Cannot delete department "${department.name}" because it still has active teams (${department.teamCount}) or employees (${department.employeeCount}). Please reassign or remove them before deleting the department.`);
      return;
    }

    if (confirm('Are you sure you want to delete this department?')) {
      try {
        console.log(`Attempting to delete department with ID: ${departmentId}`);
        const response = await axios.delete(`http://43.205.137.114:8080/api/v1/departments/${departmentId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYXJlbmRyYS5tb2RpQGV4YW1wbGUuY29tIiwiaWQiOjM5LCJhdXRob3JpdGllcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9BRE1JTiJ9XSwiaWF0IjoxNzc2MTQ5NDkwLCJleHAiOjE3Nzg3NDE0OTB9.1YBLYJP5OKWGx-qgBllPTaqjae5ShbDrgOw-rr5wRTs',
          },
        });

        if (response.status === 200 || response.status === 204) {
          console.log(`Department with ID: ${departmentId} deleted successfully.`);
          await fetchDepartments(searchQuery, '', currentPage, 10, 'id,DESC'); // Auto-refresh after delete
        } else {
          console.error(`Failed to delete department. Status: ${response.status}, Response:`, response.data);
          alert('Failed to delete the department. Please try again later.');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error deleting department:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
          });
          const serverMessage = error.response?.data?.message || error.response?.data?.error || error.message;
          alert(`Failed to delete department: ${serverMessage}`);
        } else {
          console.error('Error deleting department:', error);
          alert('An error occurred while deleting the department.');
        }
      }
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim()) errors.name = 'Department name is required';
    if (!formData.head) errors.head = 'Department head is required';
    if (!formData.status) errors.status = 'Status is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveDepartment = async () => {
    if (!validateForm()) return;

    const departmentData = {
      name: formData.name,
      description: formData.description,
      status: formData.status.toUpperCase(),
      departmentHeadId: departmentHeads.find((head) => head.name === formData.head)?.id ? parseInt(departmentHeads.find((head) => head.name === formData.head)!.id) : null,
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
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYXJlbmRyYS5tb2RpQGV4YW1wbGUuY29tIiwiaWQiOjM5LCJhdXRob3JpdGllcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9BRE1JTiJ9XSwiaWF0IjoxNzc2MTQ5NDkwLCJleHAiOjE3Nzg3NDE0OTB9.1YBLYJP5OKWGx-qgBllPTaqjae5ShbDrgOw-rr5wRTs',
            },
          }
        );

        if (response.status === 200) {
          await fetchDepartments(searchQuery, '', currentPage, 10, 'id,DESC');
        }
      } else {
        // Add new department
        const response = await axios.post(
          'http://43.205.137.114:8080/api/v1/departments',
          departmentData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYXJlbmRyYS5tb2RpQGV4YW1wbGUuY29tIiwiaWQiOjM5LCJhdXRob3JpdGllcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9BRE1JTiJ9XSwiaWF0IjoxNzc2MTQ5NDkwLCJleHAiOjE3Nzg3NDE0OTB9.1YBLYJP5OKWGx-qgBllPTaqjae5ShbDrgOw-rr5wRTs',
            },
          }
        );

        if (response.status === 201 || response.status === 200) {
          await fetchDepartments(searchQuery, '', currentPage, 10, 'id,DESC');
        }
      }
      setIsFormOpen(false);
      setEditingDepartment(null);
    } catch (error) {
       if (axios.isAxiosError(error)) {
        console.error('Error saving department:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          payload: departmentData
        });
        const serverMessage = error.response?.data?.message || error.response?.data?.error || 'Server error occurred while saving.';
        alert(`Failed to save department: ${serverMessage}`);
      } else {
        console.error('Error saving department:', error);
        alert('An unexpected error occurred.');
      }
    }

    setIsFormOpen(false);
    setEditingDepartment(null);
  };

  const handleDropdownFocus = async () => {
    if (departmentHeads.length === 0) {
      await loadDepartmentHeads();
    }
  };

  const handleSelectDepartment = (id: string) => {
    setSelectedDepartments((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((deptId) => deptId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAllDepartments = () => {
    if (selectedDepartments.length === filteredDepartments.length) {
      setSelectedDepartments([]);
    } else {
      setSelectedDepartments(filteredDepartments.map((dept) => dept.id));
    }
  };

  const handleBulkStatusChange = async (newStatus: 'Active' | 'Inactive') => {
    try {
      const promises = selectedDepartments.map((id) =>
        axios.put(
          `http://43.205.137.114:8080/api/v1/departments/${id}/status`,
          { status: newStatus },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYXJlbmRyYS5tb2RpQGV4YW1wbGUuY29tIiwiaWQiOjM5LCJhdXRob3JpdGllcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9BRE1JTiJ9XSwiaWF0IjoxNzc2MTQ5NDkwLCJleHAiOjE3Nzg3NDE0OTB9.1YBLYJP5OKWGx-qgBllPTaqjae5ShbDrgOw-rr5wRTs',
            },
          }
        )
      );
      await Promise.all(promises);
      await fetchDepartments(searchQuery, '', currentPage, 10, 'id,DESC'); // Refresh departments after status update
      setSelectedDepartments([]);
    } catch (error) {
      console.error('Error updating department status:', error);
      alert('An error occurred while updating the status. Please try again later.');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedDepartments.length > 0) {
      const deptsWithChildren = departments.filter(
        d => selectedDepartments.includes(d.id) && (d.teamCount > 0 || d.employeeCount > 0)
      );

      if (deptsWithChildren.length > 0) {
        const names = deptsWithChildren.map(d => d.name).join(', ');
        alert(`Cannot delete the following departments because they still have active teams or employees: ${names}. Please reassign or remove them first.`);
        return;
      }

      if (confirm('Are you sure you want to delete the selected departments?')) {
        try {
          const promises = selectedDepartments.map((id) =>
            axios.delete(`http://43.205.137.114:8080/api/v1/departments/${id}`, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYXJlbmRyYS5tb2RpQGV4YW1wbGUuY29tIiwiaWQiOjM5LCJhdXRob3JpdGllcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9BRE1JTiJ9XSwiaWF0IjoxNzc2MTQ5NDkwLCJleHAiOjE3Nzg3NDE0OTB9.1YBLYJP5OKWGx-qgBllPTaqjae5ShbDrgOw-rr5wRTs',
              },
            })
          );
          await Promise.all(promises);
          await fetchDepartments(searchQuery, '', currentPage, 10, 'id,DESC'); // Refresh departments after deletion
          setSelectedDepartments([]);
        } catch (error) {
          console.error('Error deleting departments:', error);
          if (axios.isAxiosError(error)) {
            const serverMessage = error.response?.data?.message || error.response?.data?.error || error.message;
            alert(`An error occurred while deleting the departments: ${serverMessage}`);
          } else {
            alert('An error occurred while deleting the departments. Please try again later.');
          }
        }
      }
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

      {/* Selected Items Action Bar */}
      {selectedDepartments.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-primary/5 border border-primary/20 rounded-lg">
          <span className="font-caption text-sm text-foreground">
            {selectedDepartments.length} department{selectedDepartments.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkStatusChange('Active')}
              className="flex items-center gap-2 px-3 py-1.5 bg-success/10 border border-success/20 rounded-md text-xs font-caption font-medium text-success hover:bg-success/20 transition-smooth"
            >
              <Icon name="CheckCircleIcon" size={14} variant="outline" />
              Activate
            </button>
            <button
              onClick={() => handleBulkStatusChange('Inactive')}
              className="flex items-center gap-2 px-3 py-1.5 bg-warning/10 border border-warning/20 rounded-md text-xs font-caption font-medium text-warning hover:bg-warning/20 transition-smooth"
            >
              <Icon name="XCircleIcon" size={14} variant="outline" />
              Deactivate
            </button>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-3 py-1.5 bg-error/10 border border-error/20 rounded-md text-xs font-caption font-medium text-error hover:bg-error/20 transition-smooth"
            >
              <Icon name="TrashIcon" size={14} variant="outline" />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Departments Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedDepartments.length === filteredDepartments.length}
                    onChange={handleSelectAllDepartments}
                    className="form-checkbox h-4 w-4 text-primary border-border rounded focus:ring-primary/50"
                  />
                </th>
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
              {filteredDepartments
                .slice(currentPage * 10, (currentPage + 1) * 10)
                .map((department) => (
                  <tr key={department.id} className="hover:bg-muted/30 transition-smooth">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedDepartments.includes(department.id)}
                        onChange={() => handleSelectDepartment(department.id)}
                        className="form-checkbox h-4 w-4 text-primary border-border rounded focus:ring-primary/50"
                      />
                    </td>
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
                        className={`inline-flex items-center px-2.5 py-1 rounded-full font-caption font-medium text-xs ${department.status === 'Active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
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

      {/* Pagination */}
      <div className="flex justify-between items-center px-2">
        <div className="text-sm font-caption text-muted-foreground">
          Showing {currentPage * 10 + 1} to {Math.min((currentPage + 1) * 10, totalRecords)} of {totalRecords} departments
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="flex items-center gap-1 px-3 py-1.5 bg-card border border-border rounded-lg font-caption font-medium text-xs text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
          >
            <Icon name="ChevronLeftIcon" size={14} variant="outline" />
            Previous
          </button>
          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg font-caption text-xs font-semibold transition-smooth ${currentPage === i
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage + 1 === totalPages}
            className="flex items-center gap-1 px-3 py-1.5 bg-card border border-border rounded-lg font-caption font-medium text-xs text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
          >
            Next
            <Icon name="ChevronRightIcon" size={14} variant="outline" />
          </button>
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
                  Department Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                  }}
                  className={`w-full px-3 py-2 bg-background border ${formErrors.name ? 'border-red-500' : 'border-border'} rounded-lg font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50`}
                  placeholder="Enter department name"
                />
                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <label className="block font-caption font-medium text-sm text-foreground mb-2">
                  Department Head <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.head}
                  onChange={(e) => {
                    setFormData({ ...formData, head: e.target.value });
                    if (formErrors.head) setFormErrors({ ...formErrors, head: '' });
                  }}
                  onFocus={handleDropdownFocus}
                  className={`w-full px-3 py-2 bg-background border ${formErrors.head ? 'border-red-500' : 'border-border'} rounded-lg font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50`}
                >
                  <option value="">Select department head</option>
                  {departmentHeads.map((head) => (
                    <option key={head.id} value={head.name}>
                      {head.name}
                    </option>
                  ))}
                </select>
                {formErrors.head && <p className="text-red-500 text-xs mt-1">{formErrors.head}</p>}
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
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => {
                    setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' });
                    if (formErrors.status) setFormErrors({ ...formErrors, status: '' });
                  }}
                  className={`w-full px-3 py-2 bg-background border ${formErrors.status ? 'border-red-500' : 'border-border'} rounded-lg font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50`}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                {formErrors.status && <p className="text-red-500 text-xs mt-1">{formErrors.status}</p>}
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