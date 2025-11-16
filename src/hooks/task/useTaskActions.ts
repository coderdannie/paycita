import { useCallback } from "react";
import useApiRequest from "../../hooks/useApiRequest";
import {
  deleteTaskComment,
  updateTaskStatus,
  UpdateTaskStatusPayload,
  ApiBaseResponse,
  createTask,
  listTasks,
  getTask,
  updateTask,
  addTaskComment,
  updateTaskComment,
  CreateTaskPayload,
  UpdateTaskPayload,
  AddCommentPayload,
  UpdateCommentPayload,
  TaskEntity,
  TaskComment,
} from "../../service/api/task.service";

interface UseTaskActionsResult {
  loading: boolean;
  error: string | null;
  message: string;
  isSuccess: boolean;
  deleteComment: (
    commentId: string | number,
    comment?: string
  ) => Promise<ApiBaseResponse | undefined>;
  changeTaskStatus: (
    taskId: string | number,
    payload: UpdateTaskStatusPayload
  ) => Promise<ApiBaseResponse | undefined>;
  createTask: (
    payload: CreateTaskPayload
  ) => Promise<ApiBaseResponse<TaskEntity> | undefined>;
  listTasks: () => Promise<ApiBaseResponse<TaskEntity[]> | undefined>;
  getTask: (
    taskId: string | number
  ) => Promise<ApiBaseResponse<TaskEntity> | undefined>;
  updateTask: (
    taskId: string | number,
    payload: UpdateTaskPayload
  ) => Promise<ApiBaseResponse<TaskEntity> | undefined>;
  addComment: (
    taskId: string | number,
    payload: AddCommentPayload
  ) => Promise<ApiBaseResponse<TaskComment> | undefined>;
  updateComment: (
    commentId: string | number,
    payload: UpdateCommentPayload
  ) => Promise<ApiBaseResponse<TaskComment> | undefined>;
}

// Hook that wraps generic useApiRequest state handling around task-specific service calls.
export const useTaskActions = (): UseTaskActionsResult => {
  const { loading, error, message, isSuccess } = useApiRequest();

  const deleteComment = useCallback(
    async (commentId: string | number, comment?: string) => {
      try {
        const res = await deleteTaskComment(commentId, comment);
        return res;
      } catch {
        return undefined;
      }
    },
    []
  );

  const changeTaskStatus = useCallback(
    async (taskId: string | number, payload: UpdateTaskStatusPayload) => {
      try {
        const res = await updateTaskStatus(taskId, payload);
        return res;
      } catch {
        return undefined;
      }
    },
    []
  );

  const createTaskAction = useCallback(async (payload: CreateTaskPayload) => {
    try {
      const res = await createTask(payload);
      return res as ApiBaseResponse<TaskEntity>;
    } catch {
      return undefined;
    }
  }, []);

  const listTasksAction = useCallback(async () => {
    try {
      const res = await listTasks();
      return res as ApiBaseResponse<TaskEntity[]>;
    } catch {
      return undefined;
    }
  }, []);

  const getTaskAction = useCallback(async (taskId: string | number) => {
    try {
      const res = await getTask(taskId);
      return res as ApiBaseResponse<TaskEntity>;
    } catch {
      return undefined;
    }
  }, []);

  const updateTaskAction = useCallback(
    async (taskId: string | number, payload: UpdateTaskPayload) => {
      try {
        const res = await updateTask(taskId, payload);
        return res as ApiBaseResponse<TaskEntity>;
      } catch {
        return undefined;
      }
    },
    []
  );

  const addCommentAction = useCallback(
    async (taskId: string | number, payload: AddCommentPayload) => {
      try {
        const res = await addTaskComment(taskId, payload);
        return res as ApiBaseResponse<TaskComment>;
      } catch {
        return undefined;
      }
    },
    []
  );

  const updateCommentAction = useCallback(
    async (commentId: string | number, payload: UpdateCommentPayload) => {
      try {
        const res = await updateTaskComment(commentId, payload);
        return res as ApiBaseResponse<TaskComment>;
      } catch {
        return undefined;
      }
    },
    []
  );

  return {
    loading,
    error,
    message,
    isSuccess,
    deleteComment,
    changeTaskStatus,
    createTask: createTaskAction,
    listTasks: listTasksAction,
    getTask: getTaskAction,
    updateTask: updateTaskAction,
    addComment: addCommentAction,
    updateComment: updateCommentAction,
  };
};

export default useTaskActions;
