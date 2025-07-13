export interface Activity {
  id: number;
  user: string;
  avatar: string;
  action: string;
  from?: string;
  to?: string;
  comment?: string;
  timestamp: string;
  type: 'status' | 'comment';
}

export interface Assignee {
  id: number;
  name: string;
  avatar: string;
  department?: string;
}

export interface TaskOutline {
  id: number;
  text: string;
  completed: boolean;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low'; // must match exactly
  status: 'todo' | 'in progress' | 'completed';
  startDate: string;
  dueDate: string;
  progress: number;

  assignees: Assignee[];

  taskOutlines: TaskOutline[];

  activities: Activity[];
}
