import React, { useState, useEffect } from "react";
import Icon from '@/components/ui/AppIcon';

interface EditTaskProps {
  task: {
    id: string;
    title: string;
    assignee: string;
    priority: "High" | "Medium" | "Low";
    status: "To Do" | "In Progress" | "Review" | "Completed";
    startDate: string;
    endDate: string;
    progress: number;
    project: string;
    description: string;
    comments: string;
  };
  onSave: (updated: any) => void;
  onClose: () => void;
  assigneeOptions: string[];
  projectOptions: string[];
}

const EditTask = ({ task, onSave, onClose, assigneeOptions, projectOptions }: EditTaskProps) => {
  const [title, setTitle] = useState(task?.title || "");
  const [assignee, setAssignee] = useState(task?.assignee || "");
  const [priority, setPriority] = useState(task?.priority || "Low");
  const [status, setStatus] = useState(task?.status || "To Do");
  const [startDate, setStartDate] = useState(task?.startDate || "");
  const [endDate, setEndDate] = useState(task?.endDate || "");
  const [progress, setProgress] = useState(task?.progress || 0);
  const [project, setProject] = useState(task?.project || "");
  const [description, setDescription] = useState(task?.description || "");
  const [comments, setComments] = useState(task?.comments || "");
  const [taskId, setTaskId] = useState(task?.id || "");
  const [newComment, setNewComment] = useState(""); // Separate state for new comment

  const handleSave = () => {
    onSave({
      ...task,
      id: taskId,
      title,
      assignee,
      priority,
      status,
      startDate,
      endDate,
      progress,
      project,
      description,
      comments,
    });
    onClose();
  };

  const handleAddComment = () => {
    if (status !== "Completed" && newComment.trim() !== "") {
      const updatedComments = `${comments}\n${newComment}`;
      setComments(updatedComments);
      setNewComment(""); // Clear the new comment field after adding
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-[2000] transition-smooth"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-[2001] pointer-events-none p-4">
        <div className="w-full max-w-4xl bg-card border border-border rounded-lg shadow-elevation-3 overflow-hidden flex flex-col max-h-[90vh] pointer-events-auto">
          <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
            <div>
              <h2 className="font-heading font-bold text-xl text-foreground">Edit Task</h2>
              <p className="font-caption text-sm text-muted-foreground mt-1">Update task details and progress</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted transition-smooth"
              aria-label="Close panel"
            >
              <Icon name="XMarkIcon" size={20} variant="outline" className="text-muted-foreground" />
            </button>
          </div>

          <form className="p-6 grid grid-cols-4 gap-4 overflow-y-auto">
          <div className="col-span-4">
            <label className="block text-sm font-medium text-muted-foreground mb-1">Task Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task Title"
              className="border border-border rounded-lg px-4 py-2 w-full bg-background text-foreground"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-muted-foreground mb-1">Assignee</label>
            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="border border-border rounded-lg px-4 py-2 w-full bg-background text-foreground"
            >
              <option value="">Select Assignee</option>
              {assigneeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as "High" | "Medium" | "Low")}
              className="border border-border rounded-lg px-4 py-2 w-full bg-background text-foreground"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "To Do" | "In Progress" | "Review" | "Completed")}
              className="border border-border rounded-lg px-4 py-2 w-full bg-background text-foreground"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-border rounded-lg px-4 py-2 w-full bg-background text-foreground"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-border rounded-lg px-4 py-2 w-full bg-background text-foreground"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1">Progress (%)</label>
            <input
              type="number"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              placeholder="Progress (%)"
              className="border border-border rounded-lg px-4 py-2 w-full bg-background text-foreground"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1">Project</label>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="border border-border rounded-lg px-4 py-2 w-full bg-background text-foreground"
            >
              <option value="">Select Project</option>
              {projectOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-4">
            <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="border border-border rounded-lg px-4 py-2 w-full h-20 resize-none bg-background text-foreground"
            />
          </div>
          <div className="col-span-4">
            <label className="block text-sm font-medium text-muted-foreground mb-1">Comments</label>
            <textarea
              value={comments}
              placeholder="Previous comments will appear here."
              className="border border-border rounded-lg px-4 py-2 w-full h-20 resize-none bg-background text-foreground"
              readOnly
            />
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a new comment"
              className="border border-border rounded-lg px-4 py-2 w-full h-20 resize-none bg-background text-foreground mt-2"
            />
            <button
              type="button"
              className="mt-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark"
              onClick={handleAddComment}
            >
              Add Comment
            </button>
          </div>
          <div className="col-span-4 flex gap-3 pt-4 mt-2 border-t border-border shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-background border border-border rounded-md font-caption text-sm font-medium text-foreground hover:bg-muted transition-smooth"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-md font-caption text-sm font-medium hover:opacity-90 transition-smooth flex items-center justify-center gap-2"
            >
              <Icon name="PencilIcon" size={18} variant="outline" />
              Save Changes
            </button>
          </div>
        </form>
        </div>
      </div>
    </>
  );
};

export default EditTask;