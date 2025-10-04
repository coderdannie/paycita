import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTaskStatus, UpdateTaskStatusPayload, TaskStatus, TaskEntity, ApiBaseResponse } from '@/src/service/api/task.service';

// Maps UI status to API status
const uiToApiStatus: Record<string, TaskStatus> = {
  'in progress': 'in_progress',
  'completed': 'completed',
  'todo': 'pending',
};

// (Reserved) If later we need to map API -> UI we can reintroduce.

interface UseUpdateTaskStatusParams {
  // Optionally supply a query key if different from default
  queryKey?: unknown[];
}

export const useUpdateTaskStatusMutation = (params: UseUpdateTaskStatusParams = {}) => {
  const { queryKey = ['tasks'] } = params;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, nextUiStatus, comment }: { taskId: string | number; nextUiStatus: string; comment?: string }) => {
      const apiStatus = uiToApiStatus[nextUiStatus] || 'pending';
      const payload: UpdateTaskStatusPayload = { status: apiStatus, comment };
      const res = await updateTaskStatus(taskId, payload);
      return res as ApiBaseResponse;
    },
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);

      // Optimistically update tasks array if present
      if (previous && typeof previous === 'object') {
        interface Envelope { data: TaskEntity[] }
        if (Array.isArray(previous)) {
          const updated = previous.map((t: TaskEntity) =>
            String(t.id) === String(vars.taskId) ? { ...t, status: uiToApiStatus[vars.nextUiStatus] || 'pending' } : t
          );
          queryClient.setQueryData(queryKey, updated);
        } else if ('data' in (previous as Envelope) && Array.isArray((previous as Envelope).data)) {
          const cloned: Envelope = { data: (previous as Envelope).data.map((t: TaskEntity) =>
            String(t.id) === String(vars.taskId) ? { ...t, status: uiToApiStatus[vars.nextUiStatus] || 'pending' } : t
          ) };
          queryClient.setQueryData(queryKey, cloned);
        }
      }
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(queryKey, ctx.previous);
      }
    },
    onSuccess: (data) => {
      // Optionally normalize returned status if server responded with canonical data
      if (data?.success) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });
};

export default useUpdateTaskStatusMutation;
