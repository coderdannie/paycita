interface ProcurementDetails {
  id?: string;
  item: string;
  description: string;
  quantity: number;
  price: string;
}

interface Procurement {
  vendor_id: string;
  procurement_date: string;
  expected_delivery_date: string;
  total_price: string;
  details: ProcurementDetails[];
}
interface Actor {
  full_name: string;
  profile_picture?: string | null;
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
type CommentUser = {
  id: number;
  name: string;
  profile_picture?: string | null;
};
type Comments = {
  id: number;
  message: string;
  created_at: string;
  user: CommentUser;
};

type CommentThread = {
  comments: Comments[];
  is_resolved: number;
  thread_id: number;
};

interface ProcurementData {
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

interface Expenses {
  total_price: string;
  details: ProcurementDetails[];
}

export type ApprovalStep = {
  name: string;
  status: "approved" | "rejected" | "pending";
  date: string;
  comment?: string;
};

export {
  Procurement,
  ProcurementData,
  Expenses,
  ApprovalStatus,
  Approval,
  Approvals,
  Actor,
  Comments,
  CommentThread,
};
