import React, { useState, useEffect } from "react";

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

  const handleAddComment = (newComment: string) => {
    if (status !== "Completed" && newComment.trim() !== "") {
      const timestamp = new Date().toLocaleString();
      const updatedComments = `${comments}\n[${timestamp}] ${newComment}`;
      setComments(updatedComments);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-card rounded-2xl shadow-2xl p-8 max-w-2xl w-full relative animate-fade-in mt-16">
        <button className="absolute top-3 right-3 text-xl text-muted-foreground hover:text-primary" onClick={onClose}>&times;</button>
        <h3 className="text-2xl font-bold text-primary mb-4 text-center">Edit Task</h3>
        <form className="grid grid-cols-2 gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task Title"
            className="col-span-2 border border-border rounded-lg px-4 py-2 w-full bg-background text-foreground"
          />
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
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as "High" | "Medium" | "Low")}
            className="border border-border rounded-lg px-4 py-2 w-full bg-background text-foreground"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
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
          <div className="flex flex-col">
            <label className="text-sm text-muted-foreground mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-border rounded-lg px-4 py-2 w-full bg-background text-foreground"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-muted-foreground mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-border rounded-lg px-4 py-2 w-full bg-background text-foreground"
            />
          </div>
          <input
            type="number"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            placeholder="Progress (%)"
            className="border border-border rounded-lg px-4 py-2 w-full bg-background text-foreground"
          />
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
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="col-span-2 border border-border rounded-lg px-4 py-2 w-full h-24 resize-none bg-background text-foreground"
          />
          <div className="col-span-2">
            <label className="block text-sm font-medium text-muted-foreground mb-1">Comments</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Previous comments will appear here. Add a new comment below."
              className="border border-border rounded-lg px-4 py-2 w-full h-24 resize-none bg-background text-foreground"
              readOnly
            />
            <textarea
              onChange={(e) => handleAddComment(e.target.value)}
              placeholder="Add a new comment"
              className="border border-border rounded-lg px-4 py-2 w-full h-24 resize-none bg-background text-foreground mt-2"
            />
          </div>
          <div className="col-span-2 flex justify-end gap-4">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:bg-muted"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="bg-gradient-to-r from-primary to-accent text-white font-bold px-6 py-2 rounded-lg hover:scale-105 transition"
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTask;