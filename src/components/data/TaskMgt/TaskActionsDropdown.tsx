import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, PlayCircle, CheckCircle, Trash2 } from 'lucide-react';
import { RiMore2Fill } from 'react-icons/ri';

interface TaskActionsDropdownProps {
  taskId: number;
  onEditTask?: (id: number) => void;
  onMarkInProgress?: (id: number) => void;
  onMarkCompleted?: (id: number) => void;
  onDeleteTask?: (id: number) => void;
}

export const TaskActionsDropdown = ({
  taskId,
  onEditTask,
  onMarkInProgress,
  onMarkCompleted,
  onDeleteTask,
}: TaskActionsDropdownProps) => {
  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleMenuItemClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={handleTriggerClick}>
        <button className="p-1 hover:bg-gray-100 rounded">
          <RiMore2Fill size={16} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={(e) => handleMenuItemClick(e, () => onEditTask?.(taskId))}
        >
          <Edit size={14} className="mr-2" />
          Edit Task
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) =>
            handleMenuItemClick(e, () => onMarkInProgress?.(taskId))
          }
        >
          <PlayCircle size={14} className="mr-2" />
          Mark as in progress
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) =>
            handleMenuItemClick(e, () => onMarkCompleted?.(taskId))
          }
        >
          <CheckCircle size={14} className="mr-2" />
          Mark as completed
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => handleMenuItemClick(e, () => onDeleteTask?.(taskId))}
          className="text-red-600 focus:text-red-700"
        >
          <Trash2 size={14} className="mr-2" />
          Delete Task
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
