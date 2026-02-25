// Define the Subtask type.
export interface Subtask {
  id: string;
  title: string;
  status: 'To Do' | 'In Progress' | 'Review' | 'Completed';
  assignee: string;
  startDate: string;
  endDate: string;
}