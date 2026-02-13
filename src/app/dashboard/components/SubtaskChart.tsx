import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface SubtaskChartProps {
  open: number;
  inProgress: number;
  completed: number;
}

const SubtaskChart: React.FC<SubtaskChartProps> = ({ open, inProgress, completed }) => {
  const data = {
    labels: ['Open', 'In Progress', 'Completed', 'Total'],
    datasets: [
      {
        label: 'Subtasks',
        data: [open, inProgress, completed, open + inProgress + completed],
        backgroundColor: ['#f87171', '#60a5fa', '#34d399', '#a78bfa'],
        borderColor: ['#f87171', '#60a5fa', '#34d399', '#a78bfa'],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <Bar data={data} options={options} />
    </div>
  );
};

export default SubtaskChart;