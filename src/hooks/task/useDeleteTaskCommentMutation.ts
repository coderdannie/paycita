import { useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import { deleteTaskComment, TaskEntity } from '@/src/service/api/task.service';

interface DeleteArgs { commentId: string | number; taskId: string | number; reason?: string; }

export const useDeleteTaskCommentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ commentId, reason }: DeleteArgs) => {
      const res = await deleteTaskComment(commentId, reason);
      if (!res.success) throw new Error(res.message || 'Failed to delete comment');
      return res.data;
    },
    onMutate: async (vars) => {
      const { taskId, commentId } = vars;
      const keyPrefix = ['task', taskId];
      await queryClient.cancelQueries({ queryKey: keyPrefix, exact: false });
      const matching = queryClient.getQueryCache().findAll({ queryKey: keyPrefix });
      const snapshots = matching.map(q => ({ queryKey: q.queryKey, data: q.state.data }));
      matching.forEach(q => {
        const current = q.state.data as TaskEntity | undefined;
        if (!current || !Array.isArray(current.comments)) return;
        const next = {
          ...current,
          comments: current.comments.filter(c => c.id != commentId)
        };
        queryClient.setQueryData(q.queryKey, next);
      });
      return { snapshots };
    },
    onError: (err, vars, ctx) => {
      ctx?.snapshots?.forEach((s: { queryKey: QueryKey; data: unknown }) => queryClient.setQueryData(s.queryKey, s.data));
    },
    onSettled: (data, error, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId], exact: false });
    }
  });
};

export default useDeleteTaskCommentMutation;