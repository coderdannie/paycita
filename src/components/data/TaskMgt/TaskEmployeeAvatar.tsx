// TaskEmployeeAvatars.tsx - Reusable employee avatars component
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Tooltip from "@/src/components/ui/tooltip";
import Image from "next/image";

interface AssigneeUser {
  id: number;
  name: string;
  avatar: string;
  department?: string;
}

interface TaskEmployeeAvatarsProps {
  assignees: AssigneeUser[];
  maxDisplay?: number;
  tooltipPlacement?: 'top' | 'bottom';
}

export const TaskEmployeeAvatars = ({
  assignees,
  maxDisplay = 3,
  tooltipPlacement = 'top',
}: TaskEmployeeAvatarsProps) => {
  const displayAssignees = assignees.slice(0, maxDisplay);
  const overflow = assignees.length - maxDisplay;

  return (
    <div className="flex items-center justify-between">
      <div className="flex -space-x-2 items-center">
        {displayAssignees.map((assignee) => (
          <Tooltip key={assignee.id} content={assignee.name} placement={tooltipPlacement}>
            <Image
              src={assignee.avatar}
              alt={assignee.name}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
            />
          </Tooltip>
        ))}
        {overflow > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-purple-600 hover:underline text-sm font-semibold pl-5">
                +{overflow} more
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4 max-h-80" align="start">
              <div className="space-y-3 overflow-y-auto max-h-64">
                {assignees.map((user, idx) => {
                  const alreadyVisible = idx < maxDisplay;
                  return (
                    <div key={user.id} className="flex items-center gap-3">
                      <div className="relative">
                        <Tooltip content={user.name} placement={tooltipPlacement}>
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            width={40}
                            height={40}
                            className={`w-10 h-10 rounded-full object-cover ${
                              alreadyVisible ? "ring-2 ring-primary/40" : ""
                            }`}
                          />
                        </Tooltip>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{user.name}</p>
                        {user.department && (
                          <p className="text-sm text-gray-500">
                            {user.department}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};
