import React, { useState } from "react";
import { Subtask } from "./types";

interface EditSubtaskProps {
  subtask: Subtask;
  onSave: (updated: Subtask) => void;
  onClose: () => void;
}

const EditSubtask = ({ subtask, onSave, onClose }: EditSubtaskProps) => {
  const [title, setTitle] = useState(subtask?.title || "");
  const [status, setStatus] = useState<Subtask["status"]>(subtask?.status || "To Do");
  const [assignee, setAssignee] = useState(subtask?.assignee || "");
  const [startDate, setStartDate] = useState(subtask?.startDate || "");
  const [endDate, setEndDate] = useState(subtask?.endDate || "");

  const handleSave = () => {
    onSave({
      id: subtask?.id || "", // Ensure id is not undefined
      title,
      status,
      assignee,
      startDate,
      endDate,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-fade-in">
        <button className="absolute top-3 right-3 text-xl text-muted-foreground hover:text-primary" onClick={onClose}>&times;</button>
        <h3 className="text-2xl font-bold text-primary mb-4 text-center">Edit Subtask</h3>
        <form className="flex flex-col gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Subtask Name"
            className="border border-border rounded-lg px-4 py-2 w-full"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Subtask["status"])}
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

export default EditSubtask;