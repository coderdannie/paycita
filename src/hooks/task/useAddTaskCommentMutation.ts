import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { addTaskComment, TaskEntity } from "@/src/service/api/task.service";

interface AddCommentArgs {
  taskId: string | number;
  comment: string;
}

// Optimistic add comment mutation: updates ['task', id, *] cache entries
export const useAddTaskCommentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, comment }: AddCommentArgs) => {
      const res = await addTaskComment(taskId, { comment });
      if (!res.success) throw new Error(res.message || "Failed to add comment");
      return res.data; // API returns created comment
    },
    onMutate: async (variables) => {
      const { taskId, comment } = variables;
      // Cancel outgoing fetches for this task
      const taskQueryKeyPrefix = ["task", taskId];
      await queryClient.cancelQueries({
        queryKey: taskQueryKeyPrefix,
        exact: false,
      });

      // Snapshot previous matches (multiple keys due to refresh token)
      const matchingQueries = queryClient
        .getQueryCache()
        .findAll({ queryKey: taskQueryKeyPrefix });
      interface Snapshot {
        queryKey: QueryKey;
        data: unknown;
      }
      const previousData: Snapshot[] = matchingQueries.map((q) => ({
        queryKey: q.queryKey,
        data: q.state.data,
      }));

      // Optimistically update each cached task detail
      matchingQueries.forEach((q) => {
        const current = q.state.data as TaskEntity | null;
        if (!current) return;
        const optimisticComment = {
          id: `optimistic-${Date.now()}`,
          task_id: String(taskId),
          comment,
          created_at: new Date().toISOString(),
          user: { full_name: "You" },
        };
        const next = {
          ...current,
          comments: Array.isArray(current.comments)
            ? [...current.comments, optimisticComment]
            : [optimisticComment],
        };
        queryClient.setQueryData(q.queryKey, next);
      });

      return { previousData };
    },
    onError: (err, variables, context) => {
      // Rollback
      if (context?.previousData) {
        (
          context.previousData as { queryKey: QueryKey; data: unknown }[]
        ).forEach((snap) => {
          queryClient.setQueryData(snap.queryKey, snap.data);
        });
      }
    },
    onSettled: (data, error, variables) => {
      const { taskId } = variables;
      // Invalidate to refetch real server state
      queryClient.invalidateQueries({
        queryKey: ["task", taskId],
        exact: false,
      });
    },
  });
};

export default useAddTaskCommentMutation;
