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

export interface AssignedAsset {
  id: number;
  asset_id: string;
  asset_name: string;
  category: string;
  assigned_to: {
    id: string;
    full_name: string;
    email: string;
    profile_picture: string;
  };
}
