import { Approval } from "./expense";

export interface ProcurementItem {
	id: number;
	item: string;
	description: string;
	quantity: number;
	price: string;
}

export interface ProcurementRequest {
	id?: string;
	vendor_id: string;
	procurement_date: string;
	expected_delivery_date: string;
	total_price: string;
	details: ProcurementItem[];
}

export interface ProcurementResponse {
	id: number;
	vendor: string;
	procurement_number: string;
	total_cost: string;
	status: "pending" | "approved" | "rejected";
	created_at: string;
}

export interface ProcurementListResponse {
	data: ProcurementResponse[];
}

interface Comment {
	id: number;
	message: string;
	user: {
		id: string;
		name: string;
	};
	created_at: string;
}

export interface CommentThread {
	thread_id: number;
	is_resolved: string;
	comments: Comment[];
}

export interface ProcurementDetails {
	id: number;
	procurement_number: string;
	vendor: string;
	total_cost: string;
	status: "pending" | "approved" | "rejected";
	expected_delivery_date: string;
	created_at: string;
	finance_manager_status: string;
	managment_status: string;
	items: ProcurementItem[];
	approvals: Approval;
	employee_name: string;
	comment_thread: CommentThread;
}

export interface Product {
	name: string;
	price: string;
	quantity: number;
	total: string;
}

export interface ApprovalStep {
	approver: string;
	status: "Approved" | "Rejected" | "Pending";
	date: string;
	comment?: string;
}

export interface ProcurementTypes {
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

export interface AllProcurements {
	amount: string;
	date: string;
	department: string;
	employee_name: string;
	id: number;
	procurement_number: string;
	status: string;
}
