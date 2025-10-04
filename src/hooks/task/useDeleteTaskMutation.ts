import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTask, ApiBaseResponse, TaskEntity } from '@/src/service/api/task.service';

interface UseDeleteTaskMutationArgs {
  queryKey?: unknown[];
}

export const useDeleteTaskMutation = (args: UseDeleteTaskMutationArgs = {}) => {
  const { queryKey = ['tasks'] } = args;
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string | number) => {
      const res = await deleteTask(taskId);
      return res as ApiBaseResponse;
    },
    onMutate: async (taskId: string | number) => {
      await qc.cancelQueries({ queryKey });
      const previous = qc.getQueryData(queryKey);

      if (previous) {
        if (Array.isArray(previous)) {
          const filtered = previous.filter(t => String((t as TaskEntity).id) !== String(taskId));
          qc.setQueryData(queryKey, filtered);
        } else if (typeof previous === 'object') {
          interface Envelope { data: TaskEntity[] }
          if ('data' in (previous as Envelope) && Array.isArray((previous as Envelope).data)) {
            const env = previous as Envelope;
            const next: Envelope = { data: env.data.filter(t => String(t.id) !== String(taskId)) };
            qc.setQueryData(queryKey, next);
          }
        }
      }
      return { previous };
    },
    onError: (_err, _taskId, ctx) => {
      if (ctx?.previous) qc.setQueryData(queryKey, ctx.previous);
    },
    onSuccess: (data) => {
      if (data?.success) qc.invalidateQueries({ queryKey });
    }
  });
};

export default useDeleteTaskMutation;
