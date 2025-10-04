import { useQuery } from '@tanstack/react-query';
import { getTask, TaskEntity } from '@/src/service/api/task.service';

// Fetch single task by id (disabled unless id provided). Optional refreshToken forces refetch when changed.
export const useTaskQuery = (taskId?: string | number, refreshToken?: number) => {
  return useQuery({
    queryKey: ['task', taskId, refreshToken],
    enabled: !!taskId,
    queryFn: async () => {
      if (!taskId) return null;
      const res = await getTask(taskId);
      if (!res.success) throw new Error(res.message || 'Failed to fetch task');
      return res.data as TaskEntity;
    },
  });
};

export default useTaskQuery;
