import { CommentThread } from "./procurements";

export interface ExpenseType {
	id: number;
	name: string;
}

export interface ExpenseItem {
	id: number;
	description: string;
	quantity: number;
	price: string;
	item: string;
}

export interface ExpenseRequest {
	total_price: string;
	details: Omit<ExpenseItem, "id">[];
}

export interface ExpenseResponse {
	id: number;
	expenses_number: string;
	total_cost: string;
	status: string;
	created_at: string;
}

export interface ExpenseDetails {
	id: number;
	procurement_number: string;
	vendor: string;
	total_cost: string;
	status: string;
	expected_delivery_date: string;
	created_at: string;
	finance_manager_status: string;
	managment_status: string;
	items: ExpenseItem[];
	approvals: Approval;
	employee_name: {
		id: number;
		full_name: string;
	};
	expenses_number: string;
	comment_thread: CommentThread;
}

export interface Approval {
	approval_1: SingleApproval;
	approval_2: SingleApproval;
	approval_3: SingleApproval;
	approval_4: SingleApproval;
}

export interface SingleApproval {
	status: string;
	approved_by: {
		id: string;
		full_name: string;
		email: string;
		profile_picture: string;
	};
	approved_at: string;
	rejection_reason: null;
	rejected_at: null;
}
