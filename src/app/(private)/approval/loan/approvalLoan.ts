export interface LoanRequest {
	id: string;
	employeeName: string;
	amountRequested: number;
	paymentPeriod: number;
	purposeOfLoan: string;
	dateRequested: string;
	status: "Pending" | "Approved" | "Rejected";
	actionTime: string;
}

export interface FilterOptions {
	amountRequested: string;
	paymentPeriod: string;
	status: string;
}

export type ActionType = "approve" | "reject" | "change";

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (comment?: string) => void;
	actionType: ActionType;
	title?: string;
	loading?: boolean;
}

export interface TableProps {
	onApprove: (id: string) => void;
	onReject: (id: string) => void;
}

export interface LoanApprovalProps {
	initialLoans: LoanRequest[];
}
