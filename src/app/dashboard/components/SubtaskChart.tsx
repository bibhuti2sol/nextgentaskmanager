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
    labels: ['Open', 'In Progress', 'Completed'],
    datasets: [
      {
        label: 'Subtasks',
        data: [open, inProgress, completed],
        backgroundColor: ['#f87171', '#60a5fa', '#34d399'],
        borderColor: ['#f87171', '#60a5fa', '#34d399'],
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
    <span className="w-full h-full flex justify-center items-center">
      <Bar data={data} options={options} />
    </span>
  );
};

export default SubtaskChart;