"use client";

// import { useState, useEffect } from "react";
// import { useDashboard } from "@/src/context/dashboardContext";
// import { ProcurementModal } from "@/src/components/data/Approval/procurement/procurementModal";
// import CommentModal from "@/src/components/data/Approval/procurement/commentModal";
// import { ProcurementTable } from "@/src/components/data/Approval/procurement/procurementTable";
// import { useAuthSelector, useDashboardSelector } from "@/src/Redux/selectors";
// import OTPApprovalModal from "../reimbursement-mgt/otp-approval";
// import { ProcurementRequestApproval } from "@/src/types/procurement-s";



export default function ProcurementPage() {
	// const { user } = useAuthSelector();
	// const { procurementRequests } = useDashboardSelector();
	// const [isModalOpen, setIsModalOpen] = useState(false);
	// const [selectedRequest, setSelectedRequest] =
	// 	useState<ProcurementRequestApproval | null>(null);
	// const {
	// 	handleUpdateProcurementApproval,
	// 	isUpdatingProcurementApproval,
	// 	getProcurementApproval,
	// 	isFetchingProcurementApproval,
	// } = useDashboard();
	// const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);

	// const [showCommentModal, setShowCommentModal] = useState(false);
	// const [actionType, setActionType] = useState<"Approve" | "Reject" | null>(
	// 	null
	// );

	// useEffect(() => {
	// 	// Only fetch if we don't have procurement requests data or if it's empty
	// 	if (!procurementRequests || procurementRequests.length === 0) {
	// 		getProcurementApproval();
	// 	}
	// }, []);

	// const handleAction = (action: "Approve" | "Reject") => {
	// 	setActionType(action);
	// 	setIsModalOpen(false);
	// 	setShowCommentModal(true);
	// };

	// const handleCloseCommentModal = () => {
	// 	setShowCommentModal(false);
	// 	setActionType(null);
	// };

	// const handleSubmitComment = (comment: string) => {
	// 	if (!selectedRequest) return;

	// 	handleUpdateProcurementApproval(
	// 		selectedRequest.approval_status_id,
	// 		{
	// 			status: actionType === "Approve" ? "approved" : "rejected",
	// 			reason: comment,
	// 		},
	// 		(data) => {
	// 			if (data.requires_otp) {
	// 				setIsOTPModalOpen(true);
	// 			} else {
	// 				getProcurementApproval(true);
	// 				setShowCommentModal(false);
	// 				setSelectedRequest(null);
	// 			}
	// 		}
	// 	);
	// };

	// const openRequestDetails = (request: ProcurementRequestApproval) => {
	// 	setSelectedRequest(request);
	// 	setIsModalOpen(true);
	// };

	// const closeModal = () => {
	// 	setIsModalOpen(false);
	// 	setSelectedRequest(null);
	// };

	return (
		<div className='p-6'>
			<h1 className='text-2xl font-bold mb-6'>Procurement Approval</h1>
			{/* <ProcurementTable onInfoClick={openRequestDetails} />

			{selectedRequest && (
				<ProcurementModal
					request={selectedRequest}
					onClose={closeModal}
					onAction={handleAction}
					currency={user?.user?.currency || "₦"}
				/>
			)}

			{showCommentModal && (
				<CommentModal
					title={`${actionType} Procurement Request`}
					onClose={handleCloseCommentModal}
					onSubmit={handleSubmitComment}
					isLoading={isUpdatingProcurementApproval}
				/>
			)}

			<OTPApprovalModal
				isOpen={isOTPModalOpen}
				onClose={() => setIsOTPModalOpen(false)}
				title='Enter OTP to confirm approval'
				callback={() => {
					setIsOTPModalOpen(false);
					getProcurementApproval(true);
					setShowCommentModal(false);
					setSelectedRequest(null);
				}}
				approvalStatusId={selectedRequest?.approval_status_id || 0}
			/> */}
		</div>
	);
}
