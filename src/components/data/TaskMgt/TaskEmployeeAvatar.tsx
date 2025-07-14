// TaskEmployeeAvatars.tsx - Reusable employee avatars component
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface User {
  id: number;
  name: string;
  avatar: string;
  department: string;
}

interface TaskEmployeeAvatarsProps {
  assignees: Array<{
    id: number;
    name: string;
    avatar: string;
  }>;
  allUsers: User[];
  maxDisplay?: number;
}

export const TaskEmployeeAvatars = ({
  assignees,
  allUsers,
  maxDisplay = 3,
}: TaskEmployeeAvatarsProps) => {
  const displayAssignees = assignees.slice(0, maxDisplay);

  return (
    <div className="flex items-center justify-between">
      <div className="flex -space-x-2 items-center">
        {displayAssignees.map((assignee) => (
          <img
            key={assignee.id}
            src={assignee.avatar}
            alt={assignee.name}
            className="w-8 h-8 rounded-full border-2 border-white"
          />
        ))}
        {allUsers.length > 3 && (
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-purple-600 hover:underline text-sm font-semibold pl-5">
                +{allUsers.length - 3}more
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4 max-h-80" align="start">
              <div className="space-y-3 overflow-y-auto max-h-64">
                {allUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.department}</p>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};
