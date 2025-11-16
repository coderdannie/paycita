import { useQuery } from "@tanstack/react-query";
import { listTasks, TaskEntity } from "@/src/service/api/task.service";
import { QUERY_KEYS } from "@/src/service/tanstack-query/queryKey";

interface TasksEnvelope {
  current_page?: number;
  data?: TaskEntity[];
  total?: number;
  per_page?: number;
  last_page?: number;
}

export const useTasksQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_TASKS],
    queryFn: async () => {
      const res = await listTasks();
      if (!res.success) throw new Error(res.message || "Failed to fetch tasks");
      const payload = res.data as unknown;
      if (
        payload &&
        typeof payload === "object" &&
        "data" in (payload as TasksEnvelope)
      ) {
        const env = payload as TasksEnvelope;
        return env.data || [];
      }
      return Array.isArray(payload) ? (payload as TaskEntity[]) : [];
    },
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });
};

export default useTasksQuery;
