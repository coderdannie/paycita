interface ProcurementDetails {
  id?: string;
  item: string;
  description: string;
  quantity: number;
  price: string;
}

type ApprovalStatus = "approved" | "rejected" | "pending" | "waiting";

type Approval = {
  approved_at?: string | null;
  approved_by: Actor | null;
  rejected_at?: string | null;
  rejection_reason?: string | null;
  status: ApprovalStatus;
};

type Approvals = Record<string, Approval> | null | undefined;

type CommentThread = {
  comments: Comments[];
  is_resolved: number;
  thread_id: number;
};

type Comments = {
  id: number;
  message: string;
  created_at: string;
  user: CommentUser;
};

type CommentUser = {
  id: number;
  name: string;
  profile_picture?: string | null;
};

export interface Product {
  name: string;
  price: string;
  quantity: number;
  total: string;
  item?: string;
}

export interface Procurement {
  vendor_id: string;
  procurement_date: string;
  expected_delivery_date: string;
  total_price: string;
  details: ProcurementDetails[];
}

export interface ApprovalStep {
  approver: string;
  status: "Approved" | "Rejected" | "Pending";
  date: string;
  comment?: string;
}

export interface Actor {
  full_name: string;
  profile_picture?: string | null;
}

export interface ProcurementRequest {
  id: string;
  items: number;
  requestedBy: string;
  actualRequester?: string;
  department: string;
  amount: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
  vendor?: string;
  expectedDeliveryDate?: string;
  products?: Product[];
  approvalFlow?: ApprovalStep[];
}

export interface ProcurementRequestApproval {
  approval_status_id: number;
  procurement_id: number;
  user: {
    full_name: string;
    department: string;
  };
  procurement_number: string;
  amount: string;
  date: string;
  status: string;
}

export interface ProcurementData {
  comment_thread: CommentThread | null;
  approvals: Approvals | null;
  id: number;
  procurement_number: string;
  vendor: string;
  total_cost: string;
  status: string;
  expected_delivery_date: string;
  created_at: string;
  finance_manager_status: string;
  managment_status: string;
  items: ProcurementDetails[];
}
interface RequestBy {
  full_name: string;
}
export interface ProcurementRequestDetails {
  created_at: string | Date;
  expected_delivery_date: string;
  total_cost: string;
  procurement_id: string;
  procurement_number: string;
  id: string;
  approval_status_id: string;
  items: Product[];
  requestedBy: string;
  actualRequester?: string;
  department: string;
  amount: string;
  totalAmount: string | number;
  dateRequested: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
  vendor?: string;
  requestId?: string;
  expectedDeliveryDate?: string;
  requested_by: RequestBy;
  approvalFlow?: ApprovalStep[];
  approvals?: Approvals;
  comment_thread?: CommentThread | null;
}
