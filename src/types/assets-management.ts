export interface Employee {
  id: string;
  name: string;
}

export interface Asset {
  id: string;
  name: string;
  category: string;
  quantity: number;
  status?: string;
  assignedTo?: Employee;
  avatarUrl?: string;
}
