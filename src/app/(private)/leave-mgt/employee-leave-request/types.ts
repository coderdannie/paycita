export interface LeaveRequestType {
  comment?: string;
  id: number;
  requestDate: string;
  employeeName: string;
  leaveType: string;
  leaveDate: string;
  duration: number;
  pending_with: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}
