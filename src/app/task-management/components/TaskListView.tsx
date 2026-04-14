"use client";

import React from 'react';
import { useEffect, useState } from 'react';
import SubtaskView from "./SubtaskView";
import EditSubtask from "./EditSubtask";
import EditTask from "./EditTask";
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface Subtask {
  id: string;
  title: string;
  status: 'To Do' | 'In Progress' | 'Review' | 'Completed';
  assignee?: string;
  startDate?: string;
  endDate?: string;
}

interface SubtaskEditModalProps {
  subtask: Subtask | null;
  onSave: (updated: Subtask) => void;
  onClose: () => void;
}

const SubtaskEditModal = ({ subtask, onSave, onClose }: SubtaskEditModalProps) => {
  const [title, setTitle] = useState(subtask?.title || '');
  const [status, setStatus] = useState<Subtask['status']>(subtask?.status || 'To Do');
  const [assignee, setAssignee] = useState(subtask?.assignee || '');
  const [startDate, setStartDate] = useState(subtask?.startDate || '');
  const [endDate, setEndDate] = useState(subtask?.endDate || '');

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ id: subtask?.id || '', title, status, assignee, startDate, endDate });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full relative">
        <button className="absolute top-3 right-3 text-xl text-muted-foreground hover:text-primary" onClick={onClose}>&times;</button>
        <h3 className="text-2xl font-bold text-primary mb-4 text-center">Edit Subtask</h3>
        <form className="flex flex-col gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Subtask Title"
            className="border border-border rounded-lg px-4 py-2 w-full"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Subtask['status'])}
            className="border border-border rounded-lg px-4 py-2 w-full"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Completed">Completed</option>
          </select>
          <input
            type="text"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            placeholder="Assignee"
            className="border border-border rounded-lg px-4 py-2 w-full"
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-border rounded-lg px-4 py-2 w-full"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-border rounded-lg px-4 py-2 w-full"
          />
          <button
            type="button"
            className="bg-gradient-to-r from-primary to-accent text-white font-bold px-6 py-2 rounded-lg hover:scale-105 transition"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

interface Task {
  id: string;
  title: string;
  assignee: {
    name: string;
    avatar: string;
    alt: string;
  };
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'Review' | 'Completed';
  startDate: string;
  endDate: string;
  progress: number;
  project: string;
  subtasks: number;
  completedSubtasks: number;
  subtaskList?: Subtask[];
  description: string; // Added property
  comments: string; // Added property
  timeTracked: string;
  estimatedTime: string;
}

interface TaskListViewProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
  onEditTask?: (taskId: string) => void;
  onTaskUpdate: (updatedTask: Task) => void;
}

const TaskListView = ({ tasks, onTaskClick, onStatusChange, onEditTask, onTaskUpdate }: TaskListViewProps) => {
  const [sortColumn, setSortColumn] = useState<keyof Task | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [editingSubtask, setEditingSubtask] = useState<Subtask | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  
  const totalElements = tasks.length;
  const totalPages = Math.ceil(totalElements / pageSize) || 1;

  const paginatedTasks = tasks.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  // Reset to first page when tasks array changes (e.g., due to search filters)
  useEffect(() => {
    setCurrentPage(0);
  }, [tasks]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const assigneeOptions = ["John Doe", "Jane Smith", "Alice Johnson", "Bob Brown"];
  const projectOptions = ["Website Redesign", "Mobile App", "API Integration", "Marketing Campaign"];

  const handleSort = (column: keyof Task) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSelectTask = (taskId: string) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter((id) => id !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedTasks.length === tasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(tasks.map((task) => task.id));
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'High':
        return 'text-error bg-error/10';
      case 'Medium':
        return 'text-warning bg-warning/10';
      case 'Low':
        return 'text-success bg-success/10';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'To Do':
        return 'text-muted-foreground bg-muted';
      case 'In Progress':
        return 'text-primary bg-primary/10';
      case 'Review':
        return 'text-warning bg-warning/10';
      case 'Completed':
        return 'text-success bg-success/10';
    }
  };

  const handleEditSubtask = (subtask: Subtask, taskId: string) => {
    setEditingSubtask(subtask);
    setEditingTaskId(taskId);
  };

  const handleEditTask = (taskId: string) => {
    setEditingTaskId(taskId);
    setEditingSubtask(null); // Ensure subtask editing is not active
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {selectedTasks.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-primary/5 border-b border-border">
          <span className="font-caption text-sm text-foreground">
            {selectedTasks.length} task{selectedTasks.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-md text-xs font-caption font-medium text-foreground hover:bg-muted transition-smooth">
              <Icon name="ArrowPathIcon" size={14} variant="outline" />
              Change Status
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-md text-xs font-caption font-medium text-foreground hover:bg-muted transition-smooth">
              <Icon name="UserGroupIcon" size={14} variant="outline" />
              Reassign
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-error/10 border border-error/20 rounded-md text-xs font-caption font-medium text-error hover:bg-error/20 transition-smooth">
              <Icon name="TrashIcon" size={14} variant="outline" />
              Delete
            </button>
          </div>
        </div>
      )}
      {/* Desktop/Tablet Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedTasks.length === tasks.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                />
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('title')}
                  className="flex items-center gap-2 font-caption font-medium text-xs text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Title
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('assignee')}
                  className="flex items-center gap-2 font-caption font-medium text-xs text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Assignee
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('priority')}
                  className="flex items-center gap-2 font-caption font-medium text-xs text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Priority
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-2 font-caption font-medium text-xs text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Status
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('startDate')}
                  className="flex items-center gap-2 font-caption font-medium text-xs text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Start Date
                </button>
              </th>
              <th className="px-4 py-3 text-left hidden lg:table-cell">
                <button
                  onClick={() => handleSort('endDate')}
                  className="flex items-center gap-2 font-caption font-medium text-xs text-muted-foreground hover:text-foreground transition-smooth"
                >
                  End Date
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="font-caption font-medium text-xs text-muted-foreground">Overdue Tasks</span>
              </th>
              <th className="px-4 py-3 text-left hidden lg:table-cell">
                <span className="font-caption font-medium text-xs text-muted-foreground">Progress</span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="font-caption font-medium text-xs text-muted-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedTasks.map((task) => {
              const today = new Date();
              const endDate = new Date(task.endDate);
              const isOverdue = endDate < today && task.status !== "Completed";
              return (
                <React.Fragment key={task.id}>
                  <tr>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(task.id)}
                        onChange={() => handleSelectTask(task.id)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label={expandedTaskId === task.id ? 'Collapse subtasks' : 'Expand subtasks'}
                          className={`transition-transform duration-200 ${expandedTaskId === task.id ? 'rotate-90' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedTaskId(expandedTaskId === task.id ? null : task.id);
                          }}
                        >
                          <span style={{ display: 'inline-block', transform: `rotate(${expandedTaskId === task.id ? 90 : 0}deg)` }}>&#9654;</span>
                        </button>
                        <div>
                          <p className="font-caption font-medium text-sm text-foreground">{task.title}</p>
                          <p className="font-caption text-xs text-muted-foreground mt-0.5">
                            {task.project} • {task.completedSubtasks}/{task.subtasks} subtasks
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-caption text-sm text-foreground">{task.assignee.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-caption font-medium ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-caption text-xs font-medium ${getStatusColor(task.status)}`}>{task.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      {new Date(task.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {new Date(task.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      {isOverdue ? <span className="font-caption text-xs text-error font-bold">Overdue</span> : <span className="font-caption text-xs text-muted-foreground">-</span>}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <span className="font-caption text-sm font-medium text-foreground">{task.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="bg-gradient-to-r from-primary to-accent text-white font-bold px-4 py-2 rounded-lg hover:scale-105 transition"
                        onClick={() => handleEditTask(task.id)}
                      >
                        Edit Task
                      </button>
                    </td>
                  </tr>
                  {expandedTaskId === task.id && (
                    <tr className="bg-muted/5">
                      <td colSpan={10} className="pl-12 py-2">
                        <SubtaskView
                          subtasks={task.subtaskList || []}
                          onEdit={(subtask) => handleEditSubtask(subtask, task.id)}
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-280px)]">
        {paginatedTasks.map((task) => {
          const today = new Date();
          const endDate = new Date(task.endDate);
          const isOverdue = endDate < today && task.status !== "Completed";

          return (
            <div key={task.id} className="p-4 bg-muted/20 border border-border rounded-xl space-y-3 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
                {isOverdue && <span className="text-[10px] text-error font-bold flex items-center gap-1">
                  <Icon name="ExclamationTriangleIcon" size={12} />
                  Overdue
                </span>}
              </div>

              <div>
                <h4 className="font-heading font-bold text-base text-foreground mb-1">{task.title}</h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="bg-primary/5 px-2 py-0.5 rounded">{task.project}</span>
                  <span>•</span>
                  <span>{task.completedSubtasks}/{task.subtasks} subtasks</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-primary">
                      {task.assignee.name.charAt(0)}
                    </span>
                  </div>
                  <span className="text-xs text-foreground font-medium">{task.assignee.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleEditTask(task.id)}
                  className="p-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-smooth"
                >
                  <Icon name="PencilSquareIcon" size={16} variant="outline" />
                </button>
              </div>
            </div>
          );
        })}
        {paginatedTasks.length === 0 && (
          <div className="text-center py-10">
            <Icon name="InboxIcon" size={48} className="mx-auto text-muted-foreground opacity-20 mb-3" />
            <p className="text-muted-foreground font-caption">No tasks found</p>
          </div>
        )}
      </div>

      {/* Footer Pagination */}
      {totalElements > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20 hidden md:flex">
          <p className="font-caption text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{currentPage * pageSize + 1}</span> to{' '}
            <span className="font-medium text-foreground">{Math.min((currentPage + 1) * pageSize, totalElements)}</span> of{' '}
            <span className="font-medium text-foreground">{totalElements}</span> tasks
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg font-caption font-medium text-xs text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
            >
              <Icon name="ChevronLeftIcon" size={14} variant="outline" />
              Previous
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg font-caption text-xs font-semibold transition-smooth ${
                    currentPage === i
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
              className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg font-caption font-medium text-xs text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
            >
              Next
              <Icon name="ChevronRightIcon" size={14} variant="outline" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Pagination */}
      {totalElements > 0 && (
        <div className="md:hidden flex flex-col items-center gap-3 p-4 border-t border-border bg-muted/20 mt-auto">
           <p className="font-caption text-xs text-muted-foreground">
            {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements}
          </p>
          <div className="flex items-center justify-center w-full gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="flex-1 flex justify-center items-center gap-1 px-3 py-2 border border-border rounded-lg font-caption font-medium text-xs text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
            >
              <Icon name="ChevronLeftIcon" size={14} variant="outline" />
              Prev
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage + 1 === totalPages}
              className="flex-1 flex justify-center items-center gap-1 px-3 py-2 border border-border rounded-lg font-caption font-medium text-xs text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
            >
              Next
              <Icon name="ChevronRightIcon" size={14} variant="outline" />
            </button>
          </div>
        </div>
      )}

      {editingSubtask && (
        <EditSubtask
          subtask={editingSubtask}
          onSave={(updated) => {
            if (!editingTaskId) return;
            const updatedTasks = tasks.map((task) => {
              if (task.id === editingTaskId) {
                return {
                  ...task,
                  subtaskList: task.subtaskList?.map((st) =>
                    st.id === updated.id ? updated : st
                  ),
                };
              }
              return task;
            });
            setEditingSubtask(null);
            setEditingTaskId(null);
            console.log("Updated tasks:", updatedTasks);
          }}
          onClose={() => {
            setEditingSubtask(null);
            setEditingTaskId(null);
          }}
        />
      )}
      {editingTaskId && !editingSubtask && (
        <EditTask
          task={{
            ...tasks.find((task) => task.id === editingTaskId)!,
            assignee: tasks.find((task) => task.id === editingTaskId)?.assignee?.name || '',
            description: tasks.find((task) => task.id === editingTaskId)?.description || '',
            comments: tasks.find((task) => task.id === editingTaskId)?.comments || '',
          }}
          assigneeOptions={assigneeOptions}
          projectOptions={projectOptions}
          onSave={(updatedTask) => {
            onTaskUpdate(updatedTask);
            setEditingTaskId(null);
          }}
          onClose={() => setEditingTaskId(null)}
        />
      )}
    </div>
  );
};

export default TaskListView;