"use client";

import React from 'react';
import { useEffect, useState } from 'react';
import SubtaskView from "./SubtaskView";
import EditSubtask from "./EditSubtask";
import EditTask from "./EditTask";

interface Subtask {
  id: string;
  title: string;
  status: 'To Do' | 'In Progress' | 'Review' | 'Completed';
  assignee: string;
  startDate: string;
  endDate: string;
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

  return null; // Placeholder, implement modal UI as needed
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
}

interface TaskListViewProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
  onEditTask?: (taskId: string) => void;
}

const TaskListView = ({ tasks, onTaskClick, onStatusChange, onEditTask }: TaskListViewProps) => {
  const [sortColumn, setSortColumn] = useState<keyof Task | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [editingSubtask, setEditingSubtask] = useState<Subtask | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

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
      <div className="overflow-x-auto">
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
              <th className="px-4 py-3 text-left">
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
              <th className="px-4 py-3 text-left">
                <span className="font-caption font-medium text-xs text-muted-foreground">Progress</span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="font-caption font-medium text-xs text-muted-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
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
                          <span style={{display:'inline-block',transform:`rotate(${expandedTaskId === task.id ? 90 : 0}deg)`}}>&#9654;</span>
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
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                          {/* <AppImage
                            src={task.assignee.avatar}
                            alt={task.assignee.alt}
                            className="w-full h-full object-cover"
                          /> */}
                        </div>
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
                    <td className="px-4 py-3">
                      {new Date(task.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      {isOverdue ? <span className="font-caption text-xs text-error font-bold">Overdue</span> : <span className="font-caption text-xs text-muted-foreground">-</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-caption text-sm font-medium text-foreground">{task.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="bg-gradient-to-r from-primary to-accent text-white font-bold px-4 py-2 rounded-lg hover:scale-105 transition"
                        onClick={() => {
                          setEditingTaskId(task.id);
                        }}
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
                          onEdit={(subtask) => {
                            setEditingSubtask(subtask);
                            setEditingTaskId(task.id);
                          }}
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
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
        {editingTaskId && (
          <EditTask
            task={tasks.find((task) => task.id === editingTaskId)!}
            onSave={(updatedTask) => {
              const updatedTasks = tasks.map((task) =>
                task.id === updatedTask.id ? updatedTask : task
              );
              setEditingTaskId(null);
              console.log("Updated tasks:", updatedTasks);
            }}
            onClose={() => setEditingTaskId(null)}
          />
        )}
      </div>
    </div>
  );
};

export default TaskListView;