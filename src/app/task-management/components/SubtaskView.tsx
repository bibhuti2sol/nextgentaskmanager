import React from "react";
import { Subtask } from "./types";

interface SubtaskViewProps {
  subtasks: Subtask[];
  onEdit: (subtask: Subtask) => void;
}

const SubtaskView = ({ subtasks, onEdit }: SubtaskViewProps) => {
  const getStatusColor = (status: Subtask["status"]) => {
    switch (status) {
      case "To Do":
        return "text-muted-foreground bg-muted";
      case "In Progress":
        return "text-primary bg-primary/10";
      case "Review":
        return "text-warning bg-warning/10";
      case "Completed":
        return "text-success bg-success/10";
    }
  };

  return (
    <div className="space-y-2">
      {subtasks.length > 0 ? (
        subtasks.map((subtask) => (
          <div key={subtask.id} className="flex items-center gap-4 py-1 border-b border-border">
            <span className="font-caption text-sm text-foreground">{subtask.title}</span>
            <span className={`font-caption text-xs px-2 py-1 rounded ${getStatusColor(subtask.status)}`}>{subtask.status}</span>
            <button
              type="button"
              aria-label="Edit subtask"
              className="p-1 rounded text-muted-foreground hover:text-primary hover:bg-muted transition-smooth"
              onClick={() => onEdit(subtask)}
            >
              ✏️
            </button>
          </div>
        ))
      ) : (
        <div className="font-caption text-xs text-muted-foreground">No subtasks available.</div>
      )}
    </div>
  );
};

export default SubtaskView;