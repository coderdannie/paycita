import React, { useState } from 'react';
import { X, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import { TaskEmployeeAvatars } from '../data/TaskMgt/TaskEmployeeAvatar';
import { Activity, Task, TaskOutline } from '@/src/types/tasksMgt';

// Types

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onMarkCompleted?: (id: number) => void;
  onMarkInProgress?: (id: number) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  onClose,
  task,
  onMarkCompleted,
  onMarkInProgress,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'comments'>('comments');
  const [newComment, setNewComment] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('');
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [activities, setActivities] = useState<Activity[]>(
    task?.activities || []
  );
  const [taskOutlines, setTaskOutlines] = useState<TaskOutline[]>(
    task?.taskOutlines || [
      {
        id: 1,
        text: 'This is the first requirement for this task',
        completed: true,
      },
      {
        id: 2,
        text: 'This is the second requirement for this task',
        completed: false,
      },
      {
        id: 3,
        text: 'This is the third requirement for this task',
        completed: false,
      },
      {
        id: 4,
        text: 'This is the fourth requirement for this task',
        completed: false,
      },
      {
        id: 5,
        text: 'This is the fifth requirement for this task',
        completed: true,
      },
      {
        id: 6,
        text: 'This is the sixth requirement for this task',
        completed: false,
      },
    ]
  );

  if (!isOpen || !task) return null;

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const newActivity: Activity = {
        id: Date.now(), // Simple ID generation
        user: 'You', // In a real app, this would be the current user
        avatar: 'https://i.pravatar.cc/32?img=6', // Default avatar for current user
        action: 'commented',
        comment: newComment.trim(),
        timestamp: 'Just now',
        type: 'comment',
      };

      setActivities((prev) => [newActivity, ...prev]);
      setNewComment('');
      setSelectedAssignee('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  const handleCheckboxChange = (id: number) => {
    setTaskOutlines((prev) =>
      prev.map((outline) =>
        outline.id === id
          ? { ...outline, completed: !outline.completed }
          : outline
      )
    );
  };

  const filteredActivities =
    activeTab === 'comments'
      ? activities.filter((activity) => activity.type === 'comment')
      : activities;

  // Create allUsers array for the TaskEmployeeAvatars component
  const allUsers = task.assignees.map((assignee) => ({
    id: assignee.id,
    name: assignee.name,
    avatar: assignee.avatar,
    department: assignee.department || 'IT Department',
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
              {task.title}
            </h2>
            <div className="hidden sm:block">
              <TaskEmployeeAvatars
                assignees={task.assignees}
                allUsers={allUsers}
                maxDisplay={3}
              />
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Mobile Assignees */}
        <div className="block sm:hidden px-3 py-2 border-b border-gray-200">
          <TaskEmployeeAvatars
            assignees={task.assignees}
            allUsers={allUsers}
            maxDisplay={3}
          />
        </div>

        <div className="flex flex-col lg:flex-row h-[calc(95vh-140px)] sm:h-[calc(90vh-80px)]">
          {/* Left Side - Task Details */}
          <div className="flex-1 p-3 sm:p-6 overflow-y-auto">
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-6">
              <Button
                onClick={() => onMarkCompleted?.(task.id)}
                className="text-sm"
                variant="outline"
              >
                Mark as completed
              </Button>
              <Button
                onClick={() => onMarkInProgress?.(task.id)}
                variant="outline"
                className="text-sm"
              >
                Mark as in progress
              </Button>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-2">Description</h3>
              <p className="text-[#3A3A3ACC] text-xs">{task.description}</p>
            </div>

            {/* Task Outlines with Progress */}
            <div className="mb-6 border border-[#3A3A3A1A] p-4 rounded-md">
              <div className="mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-[#1D2939]">
                  Task Outlines
                </h3>
              </div>

              <div className="space-y-4 max-h-64 sm:max-h-80 overflow-y-auto pr-2">
                {taskOutlines.map((outline, index) => (
                  <div
                    key={outline.id}
                    className="flex items-start space-x-3 sm:space-x-4"
                  >
                    {/* Step indicator */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                          outline.completed
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {index + 1}
                      </div>
                      {index < taskOutlines.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-300 mt-2" />
                      )}
                    </div>

                    {/* Task content */}
                    <div className="flex-1 flex items-center justify-between pt-1">
                      <label
                        htmlFor={`task-${outline.id}`}
                        className={`text-xs sm:text-sm cursor-pointer flex-1 ${
                          outline.completed
                            ? 'text-gray-900 line-through'
                            : 'text-gray-700'
                        }`}
                      >
                        {outline.text}
                      </label>
                      <Checkbox
                        id={`task-${outline.id}`}
                        checked={outline.completed}
                        onCheckedChange={() => handleCheckboxChange(outline.id)}
                        className="ml-3"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Activities */}
          <div className="w-full flex-1 lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col">
            {/* Activities Header */}
            <div className="p-3 sm:p-4 border-b border-gray-200">
              <h3 className="text-base  sm:text-lg font-bold text-[#3A3A3A] mb-4">
                Activities
              </h3>

              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors ${
                    activeTab === 'all'
                      ? 'text-gray-900 border-b-2 border-primary'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab('comments')}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors ${
                    activeTab === 'comments'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Comments
                </button>
              </div>
            </div>

            {/* Activities List */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 max-h-60 lg:max-h-none">
              {filteredActivities.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p className="text-sm">
                    No {activeTab === 'comments' ? 'comments' : 'activities'}{' '}
                    yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredActivities.map((activity) => (
                    <div key={activity.id} className="flex space-x-3">
                      <img
                        src={activity.avatar}
                        alt={activity.user}
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm">
                          <span className="font-medium text-gray-900">
                            {activity.user}
                          </span>
                          <span className="text-gray-600 ml-1">
                            {activity.action}
                          </span>
                          {activity.from && activity.to && (
                            <span className="text-gray-600">
                              {' '}
                              from{' '}
                              <span className="font-medium">
                                {activity.from}
                              </span>{' '}
                              to{' '}
                              <span className="font-medium text-orange-600">
                                {activity.to}
                              </span>
                            </span>
                          )}
                        </div>
                        {activity.comment && (
                          <div className="mt-2 text-xs sm:text-sm text-gray-700 bg-gray-50 p-2 sm:p-3 rounded-lg">
                            {activity.comment}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          {activity.timestamp}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Comment Section */}
            <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50">
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-semibold text-gray-[#1D2939]">
                    Add Comment
                  </span>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowAssigneeDropdown(!showAssigneeDropdown)
                      }
                      className="flex items-center space-x-1 text-xs sm:text-sm text-gray-600 hover:text-gray-900 p-1 rounded"
                    >
                      <User size={14} className="sm:w-4 sm:h-4" />
                      <span>@</span>
                    </button>
                    {showAssigneeDropdown && (
                      <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                        {task.assignees.map((assignee) => (
                          <button
                            key={assignee.id}
                            onClick={() => {
                              setNewComment(
                                (prev) => prev + `@${assignee.name} `
                              );
                              setSelectedAssignee(assignee.name);
                              setShowAssigneeDropdown(false);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center space-x-2"
                          >
                            <img
                              src={assignee.avatar}
                              alt={assignee.name}
                              className="w-6 h-6 rounded-full"
                            />
                            <div>
                              <div className="text-sm font-medium">
                                {assignee.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {assignee.department}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add comment"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-xs sm:text-sm"
                  rows={3}
                />
              </div>
              <button
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
                className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                <Send size={14} className="sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
