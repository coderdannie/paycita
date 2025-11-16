import { api } from "./index";

// ------------------ Types ------------------
export type TaskPriority = "low" | "medium" | "high" | "critical";
export type TaskStatus = "pending" | "in_progress" | "completed" | "blocked";

export interface Employee {
  id: string;
  full_name: string;
  [key: string]: any;
}
export interface TaskEntity {
  id: string;
  name: string;
  description: string;
  outline: string | string[];
  priority: TaskPriority;
  status: TaskStatus;
  start_date: string; // ISO date
  end_date: string; // ISO date
  employees?: string[]; // assigned employee IDs
  created_at?: string;
  updated_at?: string;
  comments?: TaskComment[];
}

export interface TaskComment {
  id: string | number;
  task_id: string;
  comment: string;
  author_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Data contract for standard API response
// Generic API base response with typed data; use unknown to avoid implicit any.
export interface ApiBaseResponse<T = unknown, P = unknown> {
  status: number;
  success: boolean;
  message: string;
  data: T;
  pagination?: P;
}

// Delete a task comment (supports sending a reason/comment in body)
export const deleteTaskComment = async <T = unknown, P = unknown>(
  commentId: string | number,
  comment?: string
): Promise<ApiBaseResponse<T, P>> => {
  const url = `/hr/delete-comment/${commentId}`;
  const response = await api.delete(url, { data: comment ? { comment } : {} });
  return response.data;
};

// Update a task's status
export interface UpdateTaskStatusPayload {
  status: TaskStatus; // constrained set
  // You can extend with optional comment, metadata, etc.
  comment?: string;
}

export const updateTaskStatus = async <T = unknown, P = unknown>(
  taskId: string | number,
  payload: UpdateTaskStatusPayload
): Promise<ApiBaseResponse<T, P>> => {
  const url = `/hr/update-task-status/${taskId}`;
  const response = await api.put(url, payload);
  return response.data;
};

// ------------------ New Endpoints ------------------

export interface CreateTaskPayload {
  name: string;
  description?: string;
  outline?: string[];
  priority?: string;
  start_date?: string;
  end_date?: string;
  employee_ids?: Array<string | number>;
  [key: string]: unknown;
}

export const createTask = async <T = TaskEntity, P = unknown>(
  payload: CreateTaskPayload
): Promise<ApiBaseResponse<T, P>> => {
  const url = "/hr/task-management";
  const response = await api.post(url, payload);
  return response.data;
};

export const AddTask = (data: CreateTaskPayload) => {
  if (!data?.name) {
    throw new Error("Task name is required.");
  }

  return api.post(`/hr/task-management`, data);
};

// List Tasks
export const listTasks = async <T = TaskEntity[], P = unknown>(): Promise<
  ApiBaseResponse<T, P>
> => {
  const url = "/hr/get-user-tasks";
  const response = await api.get(url);
  return response.data;
};

// Get Single Task
export const getTask = async <T = TaskEntity, P = unknown>(
  taskId: string | number
): Promise<ApiBaseResponse<T, P>> => {
  const url = `/hr/task-management/${taskId}`;
  const response = await api.get(url);
  return response.data;
};

// Update Task (full PUT)
export interface UpdateTaskPayload {
  name?: string;
  description?: string;
  outline?: string[] | string; // server might accept either
  priority?: TaskPriority;
  start_date?: string;
  end_date?: string;
  employee_ids?: string[];
  status?: TaskStatus;
}

export const updateTask = async <T = TaskEntity, P = unknown>(
  taskId: string | number,
  payload: UpdateTaskPayload
): Promise<ApiBaseResponse<T, P>> => {
  const url = `/hr/task-management/${taskId}`;
  const response = await api.put(url, payload);
  return response.data;
};

// Delete Task
export const deleteTask = async <T = { id: string | number }, P = unknown>(
  taskId: string | number
): Promise<ApiBaseResponse<T, P>> => {
  const url = `/hr/task-management/${taskId}`;
  const response = await api.delete(url);
  return response.data;
};

// Add Comment to Task
export interface AddCommentPayload {
  comment: string;
}

export const addTaskComment = async <T = TaskComment, P = unknown>(
  taskId: string | number,
  payload: AddCommentPayload
): Promise<ApiBaseResponse<T, P>> => {
  const url = `/hr/add-comment-to-task/${taskId}`;
  const response = await api.post(url, payload);
  return response.data;
};

// Update existing comment
export interface UpdateCommentPayload {
  comment: string;
}

export const updateTaskComment = async <T = TaskComment, P = unknown>(
  commentId: string | number,
  payload: UpdateCommentPayload
): Promise<ApiBaseResponse<T, P>> => {
  const url = `/hr/update-comment/${commentId}`;
  const response = await api.put(url, payload);
  return response.data;
};

export const getAllEmployees = async () => {
  const res = await api.get<Employee[]>(`/hr/all-employee`);
  return res.data;
};
