import { useMemo } from "react";
import CustomTable from "@/src/components/common/CustomTable";
import { TableRow, TableCell } from "../../ui/table";
import TableEmptyState from "@/src/components/common/TableEmptyState";
import { TaskEmployeeAvatars } from "./TaskEmployeeAvatar";
import { TaskActionsDropdown } from "./TaskActionsDropdown";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { Task } from "@/src/types/tasksMgt";

interface TaskTableViewProps {
  tasks: Task[];
  isLoading?: boolean;
  onEditTask?: (id: number) => void;
  onMarkInProgress?: (id: number) => void;
  onMarkCompleted?: (id: number) => void;
  onTaskClick?: (id: number) => void;
  onDeleteTask?: (id: number) => void;
}

export const TaskTableView = ({
  tasks,
  isLoading = false,
  onEditTask,
  onMarkInProgress,
  onMarkCompleted,
  onTaskClick,
  onDeleteTask,
}: TaskTableViewProps) => {
  const headers = useMemo(
    () => [
      { label: "Task Title" },
      { label: "Priority" },
      { label: "Employees" },
      { label: "Date" },
      { label: "Status" },
      { label: "" },
    ],
    []
  );

  const handleRowClick = (taskId: number) => {
    onTaskClick?.(taskId);
  };

  const getPriorityDotColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500";
      case "Medium":
        return "bg-orange-400";
      case "Low":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-600 border-red-200";
      case "Medium":
        return "bg-orange-100 text-orange-600 border-orange-200";
      case "Low":
        return "bg-green-100 text-green-600 border-green-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <CustomTable headers={headers} isLoading={isLoading}>
      {tasks?.length > 0 ? (
        tasks.map((task) => (
          <TableRow
            key={task.id}
            className="text-[#1D2939] text-sm hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => handleRowClick(task.id)}
          >
            <TableCell>
              <div>
                <div className="font-bold text-[#1D2939]">{task.title}</div>
                <div className="text-gray-500 text-xs mt-1">
                  {task.description.slice(0, 20)}...
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div
                className={`flex items-center w-fit gap-2 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityStyles(
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
            </TableCell>
            <TableCell>
              <div onClick={(e) => e.stopPropagation()}>
                <TaskEmployeeAvatars assignees={task.assignees} />
              </div>
            </TableCell>
            <TableCell className="text-gray-600">{task.dueDate}</TableCell>
            <TableCell>
              <TaskStatusBadge status={task.status} />
            </TableCell>
            <TableCell className="flex justify-center">
              <div data-action-button>
                <TaskActionsDropdown
                  taskId={task.id}
                  onEditTask={onEditTask}
                  onMarkInProgress={onMarkInProgress}
                  onMarkCompleted={onMarkCompleted}
                  onDeleteTask={onDeleteTask}
                />
              </div>
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableEmptyState
          headers={headers}
          messageTitle="No Tasks Added Yet"
          desc="Start by adding task information to manage your project workflow"
        />
      )}
    </CustomTable>
  );
};
