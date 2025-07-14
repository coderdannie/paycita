'use client';

import SearchInput from '@/src/components/ui/SearchInput';
import { useCallback, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import {
  allUsers,
  priorities,
  taskData,
} from '@/src/components/common/constants';
import { CiGrid2V } from 'react-icons/ci';
import { IoListSharp } from 'react-icons/io5';
import TaskDashboard from '@/src/components/data/TaskMgt/TaskDashboard';
import { TaskTableView } from '@/src/components/data/TaskMgt/TaskTable';
import { Task } from '@/src/types/tasksMgt';
import { TaskDetailModal } from '../../../components/modals/TaskModalDetail';

const status = [
  { value: 'all-status', label: 'All Status' },
  { value: 'completed', label: 'Completed' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'to-do', label: 'To-Do' },
];

const TaskMgt = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [tasks, setTasks] = useState<Task[]>(taskData as Task[]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode);
  }, []);

  const handleEditTask = (id: number) => {
    console.log('Edit task:', id);
  };

  const handleMarkInProgress = (id: number) => {
    console.log('Mark as in progress:', id);
    // Update task status
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: 'in progress' } : task
      )
    );
  };

  const handleMarkCompleted = (id: number) => {
    console.log('Mark as completed:', id);
    // Update task status
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: 'completed', progress: 100 } : task
      )
    );
  };

  // New function to handle task click
  const handleTaskClick = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <div>
      <h2 className="text-[#1D2939] font-bold text-lg md:text-2xl mb-10">
        Task Management
      </h2>
      <div className="w-full sm:w-64 h-10">
        <SearchInput
          placeholder="Search Task title"
          value={searchTerm}
          setValue={handleSearchChange}
        />
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center  mt-12 gap-4 mb-6">
        <div className="flex items-center gap-2">
          {viewMode === 'list' && (
            <div className="w-48">
              <Select defaultValue="all-status">
                <SelectTrigger className="w-full bg-white border-gray-200 text-gray-700 font-medium">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {status.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="w-48">
            <Select defaultValue="priority">
              <SelectTrigger className="w-full bg-white border-gray-200 text-gray-700 font-medium">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewModeChange('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <CiGrid2V size={24} />
          </button>
          <button
            onClick={() => handleViewModeChange('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <IoListSharp size={24} />
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <TaskDashboard
          tasks={tasks}
          allUsers={allUsers}
          onEditTask={handleEditTask}
          onMarkInProgress={handleMarkInProgress}
          onMarkCompleted={handleMarkCompleted}
          onTaskClick={handleTaskClick}
          setTasks={setTasks}
        />
      ) : (
        <TaskTableView
          tasks={tasks}
          allUsers={allUsers}
          onEditTask={handleEditTask}
          onMarkInProgress={handleMarkInProgress}
          onMarkCompleted={handleMarkCompleted}
          onTaskClick={handleTaskClick}
        />
      )}

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={selectedTask}
        onMarkCompleted={handleMarkCompleted}
        onMarkInProgress={handleMarkInProgress}
      />
    </div>
  );
};

export default TaskMgt;
