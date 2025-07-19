export interface PayrollEntry {
	id: 1;
	date: string;
	staff_name: string;
	gross_income: string;
	deductions: string;
	net_pay: string;
	status: string;
}

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (comment?: string) => void;
	actionType: "approve" | "reject";
}
