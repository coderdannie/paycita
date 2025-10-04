import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { TaskEmployeeAvatars } from "../data/TaskMgt/TaskEmployeeAvatar";
import { Activity, Task, TaskOutline } from "@/src/types/tasksMgt";
import useAddTaskCommentMutation from "@/src/hooks/task/useAddTaskCommentMutation";
import useUpdateTaskCommentMutation from "@/src/hooks/task/useUpdateTaskCommentMutation";
import useDeleteTaskCommentMutation from "@/src/hooks/task/useDeleteTaskCommentMutation";

// Types

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  loading?: boolean;
  onMarkCompleted?: (id: number) => void;
  onMarkInProgress?: (id: number) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  onClose,
  task,
  loading = false,
  onMarkCompleted,
  onMarkInProgress,
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "comments">("comments");
  const [newComment, setNewComment] = useState("");
  const { mutate: addComment, isPending: addingComment } =
    useAddTaskCommentMutation();
  const { mutate: updateComment, isPending: updatingComment } =
    useUpdateTaskCommentMutation();
  const { mutate: deleteComment, isPending: deletingComment } =
    useDeleteTaskCommentMutation();
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [editValue, setEditValue] = useState("");

  const [activities, setActivities] = useState<Activity[]>(
    task?.activities || []
  );
  const [taskOutlines, setTaskOutlines] = useState<TaskOutline[]>(
    task?.taskOutlines || []
  );

  // Sync internal state with incoming task whenever modal opens with a (new) task
  useEffect(() => {
    if (!isOpen || !task) return;
    setActivities(task.activities || []);
    setTaskOutlines(task.taskOutlines || []);
  }, [isOpen, task]);

  if (!isOpen) return null;

  // Comment edit helpers
  const startEdit = (activity: Activity) => {
    setEditingId(activity.id);
    setEditValue(activity.comment || "");
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };
  const submitEdit = (activity: Activity) => {
    if (!task || !editValue.trim()) return;
    // optimistic local update of local activities list (React Query cache handled by hook internally)
    setActivities((prev) =>
      prev.map((a) =>
        a.id === activity.id ? { ...a, comment: editValue.trim() } : a
      )
    );
    updateComment({
      commentId: activity.id,
      taskId: task.backendId ?? task.id,
      comment: editValue.trim(),
    });
    cancelEdit();
  };
  const handleDelete = (activity: Activity) => {
    if (!task) return;
    // For now direct delete (could prompt confirmation modal later)
    setActivities((prev) => prev.filter((a) => a.id !== activity.id));
    deleteComment({
      commentId: activity.id,
      taskId: task.backendId ?? task.id,
    });
  };

  // Skeleton placeholder while loading
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-white rounded-lg w-full max-w-3xl p-6 animate-pulse">
          <div className="h-6 w-1/2 bg-gray-200 rounded mb-4" />
          <div className="space-y-2 mb-6">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />
            <div className="h-4 w-2/3 bg-gray-200 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-24 bg-gray-200 rounded" />
          </div>
          <div className="h-10 w-40 bg-gray-200 rounded mb-4" />
          <div className="flex justify-end">
            <div className="h-8 w-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!task) return null;

  const handleSubmitComment = () => {
    const trimmed = newComment.trim();
    if (!trimmed || !task) return;
    // Optimistic local activity (will be replaced by invalidate/refetch)
    const optimisticActivity: Activity = {
      id: Date.now(),
      user: "You",
      avatar: "/assets/avatar.jpeg",
      action: "commented",
      comment: trimmed,
      timestamp: "Just now",
      type: "comment",
    };
    setActivities((prev) => [optimisticActivity, ...prev]);
    setNewComment("");
    addComment({ taskId: task.backendId ?? task.id, comment: trimmed });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
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
    activeTab === "comments"
      ? activities.filter((activity) => activity.type === "comment")
      : activities;

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
                maxDisplay={3}
                tooltipPlacement="bottom"
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
            maxDisplay={3}
            tooltipPlacement="bottom"
          />
        </div>

        <div className="flex flex-col lg:flex-row h-[calc(95vh-140px)] sm:h-[calc(90vh-80px)]">
          {/* Left Side - Task Details */}
          <div className="flex-1 p-3 sm:p-6 overflow-y-auto">
            {/* Action Buttons (disable current status) */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-6">
              {(() => {
                const isCompleted = task.status === "completed";
                return (
                  <Button
                    onClick={() => {
                      if (!isCompleted) onMarkCompleted?.(task.id);
                    }}
                    className="text-sm"
                    variant="outline"
                    disabled={isCompleted}
                  >
                    {isCompleted ? "Completed (current)" : "Mark as completed"}
                  </Button>
                );
              })()}
              {(() => {
                const isInProgress = task.status === "in progress";
                return (
                  <Button
                    onClick={() => {
                      if (!isInProgress) onMarkInProgress?.(task.id);
                    }}
                    variant="outline"
                    className="text-sm"
                    disabled={isInProgress}
                  >
                    {isInProgress
                      ? "In progress (current)"
                      : "Mark as in progress"}
                  </Button>
                );
              })()}
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
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-gray-600"
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
                            ? "text-gray-900 line-through"
                            : "text-gray-700"
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
                  onClick={() => setActiveTab("all")}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors ${
                    activeTab === "all"
                      ? "text-gray-900 border-b-2 border-primary"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab("comments")}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors ${
                    activeTab === "comments"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-600 hover:text-gray-900"
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
                    No {activeTab === "comments" ? "comments" : "activities"}{" "}
                    yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredActivities.map((activity) => (
                    <div key={activity.id} className="flex space-x-3 group">
                      <Image
                        src={activity.avatar}
                        alt={activity.user}
                        width={32}
                        height={32}
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex-shrink-0 object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm flex justify-between items-start gap-2">
                          <div className="flex-1">
                            <span className="font-medium text-gray-900">
                              {activity.user}
                            </span>
                            <span className="text-gray-600 ml-1">
                              {activity.action}
                            </span>
                            {editingId === activity.id ? (
                              <div className="mt-1">
                                <textarea
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                                  rows={2}
                                />
                                <div className="mt-1 flex items-center gap-2">
                                  <button
                                    onClick={() => submitEdit(activity)}
                                    disabled={
                                      !editValue.trim() || updatingComment
                                    }
                                    className="text-primary text-[11px] font-semibold disabled:opacity-50"
                                  >
                                    {updatingComment ? "Saving..." : "Save"}
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    className="text-gray-500 text-[11px] hover:text-gray-700"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              activity.comment && (
                                <span className="text-gray-700 ml-1 break-words">
                                  {activity.comment}
                                </span>
                              )
                            )}
                          </div>
                          {activity.type === "comment" &&
                            editingId !== activity.id && (
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                <button
                                  onClick={() => startEdit(activity)}
                                  className="text-[10px] text-primary hover:underline"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(activity)}
                                  disabled={deletingComment}
                                  className="text-[10px] text-red-500 hover:underline disabled:opacity-50"
                                >
                                  {deletingComment ? "..." : "Delete"}
                                </button>
                              </div>
                            )}
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-500 mt-1">
                          {activity.timestamp}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Comment Input (only on Comments tab) */}
            {activeTab === "comments" && (
              <div className="p-3 sm:p-4 border-t border-gray-200">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add comment"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-xs sm:text-sm"
                  rows={3}
                />
                <button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || addingComment}
                  className="mt-2 w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  <Send size={14} className="sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">
                    {addingComment ? "Sending..." : "Send"}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
