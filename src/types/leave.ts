export interface LeaveRequest {
  id: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  duration: string;
  status: 'pending' | 'approved' | 'rejected';
  comment: string | null;
  created_at: string;
}

export interface LeaveRequestsData {
  total_leave_requests: number;
  pending_leave: number;
  approved_leave: number;
  rejected_leave: number;
  leave_requests: LeaveRequest[];
}
