// import React, { useState } from "react";
// import { ActionType } from "./approvalLoan";
// import LoanTable from "./loanApprovalTable";
// import ActionModal from "./actionModal";
// import { useDashboard } from "@/src/context/dashboardContext";
// import OTPApprovalModal from "../reimbursement-mgt/otp-approval";

// const LoanApproval = () => {
// 	const {
// 		isUpdatingProcurementApproval,
// 		handleUpdateLoanApproval,
// 		getLoanApproval,
// 	} = useDashboard();
// 	const [isModalOpen, setIsModalOpen] = useState(false);
// 	const [isActionModalOpen, setIsActionModalOpen] = useState(false);
// 	const [currentLoanId, setCurrentLoanId] = useState<string | null>(null);
// 	const [currentAction, setCurrentAction] = useState<ActionType>("approve");

// 	const handleActionClick = (id: string, action: ActionType) => {
// 		setCurrentLoanId(id);
// 		setCurrentAction(action);
// 		setIsActionModalOpen(true);
// 	};

// 	const handleActionConfirm = async (comment?: string) => {
// 		if (!currentLoanId) return;
// 		await handleUpdateLoanApproval(
// 			parseInt(currentLoanId),
// 			{
// 				status: currentAction === "approve" ? "approved" : "rejected",
// 				reason: comment || undefined,
// 			},
// 			(data) => {
// 				if (data.requires_otp) {
// 					setIsModalOpen(true);
// 				} else {
// 					getLoanApproval(true);
// 					setIsActionModalOpen(false);
// 				}
// 			}
// 		);
// 	};

// 	return (
// 		<div className='w-full'>
// 			<h1 className='text-xl sm:text-2xl font-bold text-gray-800 mb-6'>
// 				Approval- Loan
// 			</h1>

// 			<div className='w-full overflow-hidden bg-white rounded-md shadow'>
// 				<div className='w-full overflow-x-auto'>
// 					<LoanTable
// 						onApprove={(id) => handleActionClick(id, "approve")}
// 						onReject={(id) => handleActionClick(id, "reject")}
// 					/>
// 				</div>
// 			</div>

// 			<ActionModal
// 				isOpen={isActionModalOpen}
// 				onClose={() => setIsActionModalOpen(false)}
// 				onConfirm={handleActionConfirm}
// 				actionType={currentAction}
// 				loading={isUpdatingProcurementApproval}
// 			/>
// 			<OTPApprovalModal
// 				isOpen={isModalOpen}
// 				onClose={() => setIsModalOpen(false)}
// 				title='Loan Request'
// 				approvalStatusId={Number(currentLoanId)}
// 				callback={() => {
// 					setIsActionModalOpen(false);
// 					getLoanApproval(true);
// 				}}
// 			/>
// 		</div>
// 	);
// };

// export default LoanApproval;
