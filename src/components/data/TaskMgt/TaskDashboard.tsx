import React from 'react';
import { Calendar } from 'lucide-react';

import { Task } from '@/src/types/tasksMgt';
import { TaskEmployeeAvatars } from './TaskEmployeeAvatar';
import { TaskActionsDropdown } from './TaskActionsDropdown';

interface TaskDashboardProps {
  tasks: Task[];
  allUsers: Array<{
    id: number;
    name: string;
    avatar: string;
    department: string;
  }>;
  isLoading?: boolean;
  onEditTask?: (id: number) => void;
  onMarkInProgress?: (id: number) => void;
  onMarkCompleted?: (id: number) => void;
  setTasks?: (tasks: Task[]) => void;
  onTaskClick?: (id: number) => void;
}

export default function TaskDashBoard({
  tasks,
  allUsers,
  setTasks,
  onEditTask,
  onMarkInProgress,
  onMarkCompleted,
  onTaskClick,
}: TaskDashboardProps) {
  const columns = [
    { id: 'todo', title: 'To do', status: 'todo' },
    { id: 'progress', title: 'In Progress', status: 'in progress' },
    { id: 'completed', title: 'Completed', status: 'completed' },
  ];

  const handleRowClick = (taskId: number, event: React.MouseEvent) => {
    onTaskClick?.(taskId);
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-600 border-red-200';
      case 'Medium':
        return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'Low':
        return 'bg-green-100 text-green-600 border-green-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getPriorityDotColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500';
      case 'Medium':
        return 'bg-orange-400';
      case 'Low':
        return 'bg-green-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  const TaskCard = ({ task }) => (
    <div
      className="bg-white rounded-lg shadow-sm cursor-pointer border border-gray-200 p-4 mb-4"
      onClick={(e) => handleRowClick(task.id, e)}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityStyles(
            task.priority
          )}`}
        >
          <div
            className={`w-2 h-2 rounded-full ${getPriorityDotColor(
              task.priority
            )}`}
          ></div>
          <span>{task.priority}</span>
        </div>
        <TaskActionsDropdown
          taskId={task.id}
          onEditTask={onEditTask}
          onMarkInProgress={onMarkInProgress}
          onMarkCompleted={onMarkCompleted}
        />
      </div>

      <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
      <p className="text-sm text-gray-600 mb-4">{task.description}</p>

      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Calendar size={14} />
          <div className="flex items-center flex-col gap-1 mb-4">
            <span>Start Date</span>
            <span className="text-xs font-medium text-gray-900">
              {task.dueDate}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Calendar size={14} />
          <div className="flex items-center flex-col gap-1 mb-4">
            <span>Due Date</span>
            <span className="text-xs font-medium text-gray-900">
              {task.dueDate}
            </span>
          </div>
        </div>
      </div>

      {task.progress > 0 && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${task.progress}%`,
                backgroundColor: '#692E9F',
              }}
            ></div>
          </div>
        </div>
      )}
      <div onClick={(e) => e.stopPropagation()}>
        <TaskEmployeeAvatars assignees={task.assignees} allUsers={allUsers} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.status);
          return (
            <div
              key={column.id}
              style={{ backgroundColor: '#FAFAFA' }}
              className=" border border-[#8888884d] rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800">
                  {column.title} - {columnTasks.length}
                </h2>
              </div>
              <div className="space-y-4">
                {columnTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
