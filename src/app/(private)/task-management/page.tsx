"use client";

import SearchInput from "@/src/components/ui/SearchInput";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { priorities } from "@/src/components/common/constants";
import { CiGrid2V } from "react-icons/ci";
import { IoListSharp } from "react-icons/io5";
import TaskDashboard from "@/src/components/data/TaskMgt/TaskDashboard";
import { TaskTableView } from "@/src/components/data/TaskMgt/TaskTable";
import { Task } from "@/src/types/tasksMgt";
import { TaskEntity } from "@/src/service/api/task.service";
import useUpdateTaskStatusMutation from "@/src/hooks/task/useUpdateTaskStatusMutation";
import useDeleteTaskMutation from "@/src/hooks/task/useDeleteTaskMutation";
import TaskDeleteConfirmModal from "@/src/components/modals/TaskDeleteConfirmModal";
import useTasksQuery from "@/src/hooks/task/useTasksQuery";
import useTaskQuery from "@/src/hooks/task/useTaskQuery";
import { TaskDetailModal } from "../../../components/modals/TaskModalDetail";

const status = [
  { value: "all-status", label: "All Status" },
  { value: "completed", label: "Completed" },
  { value: "in-progress", label: "In Progress" },
  { value: "to-do", label: "To-Do" },
];

const TaskMgt = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { data: apiTasks = [], isLoading, error } = useTasksQuery();
  const [tasks, setTasks] = useState<Task[]>([]); // local overlay for status changes
  const [selectedStatus, setSelectedStatus] = useState("all-status");
  const [selectedPriority, setSelectedPriority] = useState("priority");
  const initializedRef = useRef(false);
  const { mutate: mutateStatus } = useUpdateTaskStatusMutation();
  const { mutate: mutateDelete, isPending: isDeleting } =
    useDeleteTaskMutation();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  // One-time initialization of tasks from query data to prevent infinite renders when apiTasks is empty
  useEffect(() => {
    if (initializedRef.current) return; // already initialized
    if (!apiTasks || apiTasks.length === 0) return; // wait until we have data

    const toUi = (t: TaskEntity): Task => {
      const outlineArr: string[] = Array.isArray(t.outline)
        ? (t.outline as string[])
        : typeof t.outline === "string"
        ? (t.outline as string).split(/\n+/).filter(Boolean)
        : [];
      const cleaned = outlineArr.filter((o) => o && o.trim() !== "---");
      type RawEmp = { full_name?: string; name?: string; department?: string };
      const rawEmployees = (t as unknown as { employees?: RawEmp[] }).employees;
      return {
        id: Number.isFinite(Number(t.id)) ? Number(t.id) : Math.random(),
        backendId: t.id,
        title: t.name,
        description: t.description,
        priority: ((): Task["priority"] => {
          const p = t.priority?.toLowerCase();
          if (p === "critical") return "Critical";
          if (p === "high") return "High";
          if (p === "medium") return "Medium";
          if (p === "low") return "Low";
          return "Low";
        })(),
        status: ((): Task["status"] => {
          switch (t.status) {
            case "in_progress":
              return "in progress";
            case "completed":
              return "completed";
            case "pending":
              return "todo";
            default:
              return "todo";
          }
        })(),
        startDate: t.start_date,
        dueDate: t.end_date,
        progress: t.status === "completed" ? 100 : 0,
        assignees: Array.isArray(rawEmployees)
          ? rawEmployees.map((emp, idx) => ({
              id: idx + 1,
              name: emp.full_name || emp.name || `User ${idx + 1}`,
              avatar: "/assets/avatar.jpeg",
              department: emp.department,
            }))
          : [],
        taskOutlines: cleaned.map((text, idx) => ({
          id: idx + 1,
          text,
          completed: false,
        })),
        activities: [],
      };
    };
    setTasks((apiTasks as TaskEntity[]).map(toUi));
    initializedRef.current = true;
  }, [apiTasks]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedBackendId, setSelectedBackendId] = useState<string | number | null>(null);
  const [detailRefreshSeq, setDetailRefreshSeq] = useState(0); // increments each open to force refetch
  const { data: singleTaskEntity, isLoading: isSingleLoading } = useTaskQuery(selectedBackendId || undefined, detailRefreshSeq);

  // Map freshly fetched single task entity (if any) to UI Task shape
  const mappedSingleTask: Task | null = useMemo(() => {
    if (!singleTaskEntity) return null;
    const t = singleTaskEntity as TaskEntity;
    const outlineArr: string[] = Array.isArray(t.outline)
      ? (t.outline as string[])
      : typeof t.outline === 'string'
        ? (t.outline as string).split(/\n+/).filter(Boolean)
        : [];
    const cleaned = outlineArr.filter(o => o && o.trim() !== '---');
    type RawEmp = { full_name?: string; name?: string; department?: string };
    const rawEmployees = (t as unknown as { employees?: RawEmp[] }).employees;
    // Comments -> activities mapping (only for single task fetch since list API may omit comments)
    type RawComment = {
      id: number | string;
      comment: string;
      created_at?: string;
      user?: { full_name?: string };
    };
    const rawComments = (t as unknown as { comments?: RawComment[] }).comments;
    const activities = Array.isArray(rawComments)
      ? rawComments.map((c) => ({
          id: Number(c.id) || Math.random(),
          user: c.user?.full_name || 'Unknown User',
          avatar: '/assets/avatar.jpeg',
          action: 'commented',
          comment: c.comment,
          timestamp: c.created_at
            ? new Date(c.created_at).toLocaleString()
            : 'Just now',
          type: 'comment' as const,
        }))
      : [];
    return {
      id: Number.isFinite(Number(t.id)) ? Number(t.id) : Math.random(),
      backendId: t.id,
      title: t.name,
      description: t.description,
      priority: ((): Task['priority'] => {
        const p = t.priority?.toLowerCase();
        if (p === 'critical') return 'Critical';
        if (p === 'high') return 'High';
        if (p === 'medium') return 'Medium';
        if (p === 'low') return 'Low';
        return 'Low';
      })(),
      status: ((): Task['status'] => {
        switch (t.status) {
          case 'in_progress': return 'in progress';
          case 'completed': return 'completed';
          case 'pending': return 'todo';
          default: return 'todo';
        }
      })(),
      startDate: t.start_date,
      dueDate: t.end_date,
      progress: t.status === 'completed' ? 100 : 0,
      assignees: Array.isArray(rawEmployees) ? rawEmployees.map((emp, idx) => ({
        id: idx + 1,
        name: emp.full_name || emp.name || `User ${idx + 1}`,
        avatar: '/assets/avatar.jpeg',
        department: emp.department,
      })) : [],
      taskOutlines: cleaned.map((text, idx) => ({ id: idx + 1, text, completed: false })),
      activities,
    };
  }, [singleTaskEntity]);

  // When a fresh single task arrives, replace selectedTask (preserve optimistic fields if needed later)
  useEffect(() => {
    if (mappedSingleTask) {
      setSelectedTask(prev => {
        if (!prev) return mappedSingleTask;
        // If same backendId, merge to retain potential local progress updates
        if (prev.backendId === mappedSingleTask.backendId) {
          return { ...mappedSingleTask, progress: prev.progress };
        }
        return mappedSingleTask;
      });
    }
  }, [mappedSingleTask]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleViewModeChange = useCallback((mode: "grid" | "list") => {
    setViewMode(mode);
  }, []);

  const handleStatusChange = useCallback((val: string) => {
    setSelectedStatus(val);
  }, []);

  const handlePriorityChange = useCallback((val: string) => {
    setSelectedPriority(val);
  }, []);

  // Derived filter result
  const filteredTasks = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return tasks.filter((t) => {
      if (term) {
        const hay = `${t.title} ${t.description || ""}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      if (selectedStatus !== "all-status") {
        const statusMap: Record<string, Task["status"]> = {
          completed: "completed",
          "in-progress": "in progress",
          "to-do": "todo",
        };
        const wanted = statusMap[selectedStatus];
        if (wanted && t.status !== wanted) return false;
      }
      if (selectedPriority !== "priority") {
        if (t.priority.toLowerCase() !== selectedPriority) return false;
      }
      return true;
    });
  }, [tasks, searchTerm, selectedStatus, selectedPriority]);

  const handleEditTask = (id: number) => {
    console.log("Edit task:", id);
  };

  const handleMarkInProgress = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "in progress" } : t))
    );
    const backendId = tasks.find((t) => t.id === id)?.backendId ?? id;
    mutateStatus({ taskId: backendId, nextUiStatus: "in progress" });
  };

  const handleMarkCompleted = (id: number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: "completed", progress: 100 } : t
      )
    );
    const backendId = tasks.find((t) => t.id === id)?.backendId ?? id;
    mutateStatus({ taskId: backendId, nextUiStatus: "completed" });
  };

  const handleRequestDelete = (id: number) => {
    setPendingDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (pendingDeleteId == null) return;
    const backendId =
      tasks.find((t) => t.id === pendingDeleteId)?.backendId ?? pendingDeleteId;
    // Optimistic removal
    setTasks((prev) => prev.filter((t) => t.id !== pendingDeleteId));
    mutateDelete(backendId, {
      onError: () => {
        // Easiest rollback: refetch by invalidation (handled in mutation success). Could capture snapshot if needed.
      },
      onSettled: () => {
        setDeleteModalOpen(false);
        setPendingDeleteId(null);
      },
    });
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setPendingDeleteId(null);
  };

  // New function to handle task click
  const handleTaskClick = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setSelectedTask(task); // immediate UI (stale) snapshot
      setSelectedBackendId(task.backendId ?? task.id);
      setDetailRefreshSeq((c) => c + 1); // force refetch even if same id
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setSelectedBackendId(null);
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
      {isLoading && (
        <p className="text-sm text-gray-500 mt-2">Loading tasks...</p>
      )}
      {error && (
        <p className="text-sm text-red-500 mt-2">{(error as Error).message}</p>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center  mt-12 gap-4 mb-6">
        <div className="flex items-center gap-2">
          {viewMode === "list" && (
            <div className="w-48">
              <Select value={selectedStatus} onValueChange={handleStatusChange}>
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
            <Select
              value={selectedPriority}
              onValueChange={handlePriorityChange}
            >
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
            onClick={() => handleViewModeChange("grid")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "grid"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <CiGrid2V size={24} />
          </button>
          <button
            onClick={() => handleViewModeChange("list")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "list"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <IoListSharp size={24} />
          </button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <TaskDashboard
          tasks={filteredTasks}
          onEditTask={handleEditTask}
          onMarkInProgress={handleMarkInProgress}
          onMarkCompleted={handleMarkCompleted}
          onDeleteTask={handleRequestDelete}
          onTaskClick={handleTaskClick}
        />
      ) : (
        <TaskTableView
          tasks={filteredTasks}
          onEditTask={handleEditTask}
          onMarkInProgress={handleMarkInProgress}
          onMarkCompleted={handleMarkCompleted}
          onDeleteTask={handleRequestDelete}
          onTaskClick={handleTaskClick}
        />
      )}

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={selectedTask}
        loading={isSingleLoading}
        onMarkCompleted={handleMarkCompleted}
        onMarkInProgress={handleMarkInProgress}
      />
      <TaskDeleteConfirmModal
        isOpen={deleteModalOpen}
        taskTitle={tasks.find((t) => t.id === pendingDeleteId)?.title}
        loading={isDeleting}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default TaskMgt;
