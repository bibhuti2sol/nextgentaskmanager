import React from 'react';

interface SubtaskChartProps {
  open: number;
  inProgress: number;
  completed: number;
}

const SubtaskChart: React.FC<SubtaskChartProps> = ({ open, inProgress, completed }) => {
  const totalSubtasks = open + inProgress + completed;

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <p className="text-lg font-semibold">Subtasks</p>
      <p className="text-2xl font-bold">{totalSubtasks} Total</p>
    </div>
  );
};

export default SubtaskChart;