import React, { useEffect } from 'react';

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface SubtaskBoxProps {
  subtasks: Subtask[] | any; // Allow for flexibility in the type of subtasks
}

const SubtaskBox: React.FC<SubtaskBoxProps> = ({ subtasks }) => {
  // Debugging: Log the subtasks prop to inspect its structure
  useEffect(() => {
    console.log('Subtasks prop:', subtasks);
  }, [subtasks]);

  // Ensure subtasks is an array and handle cases where it's not
  const parsedSubtasks: Subtask[] = Array.isArray(subtasks) ? subtasks : [];
  const totalSubtasks = parsedSubtasks.length;

  return (
    <div className="p-4 bg-white shadow rounded-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-lg font-medium">Subtasks</span>
        </div>
        <span className="text-sm text-gray-500">{totalSubtasks} total</span>
      </div>
      {totalSubtasks > 0 ? (
        <ul className="mt-2">
          {parsedSubtasks.map((subtask) => (
            <li key={subtask.id} className="flex items-center justify-between py-1">
              <span>{subtask.title || 'Untitled'}</span>
              <span>{subtask.completed ? '✔️' : '❌'}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 mt-2">No subtasks available</p>
      )}
    </div>
  );
};

export default SubtaskBox;