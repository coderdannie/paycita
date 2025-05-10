export interface Employee {
  id: string;
  name: string;
}

export interface Asset {
  name: string;
  category: string;
  quantity: number;
  status: string;
  id?: string;
  assignedTo?: Employee;
  avatarUrl?: string;
}
