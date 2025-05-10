import React from "react";
import {
	Button,
	Dialog,
	DialogHeader,
	DialogBody,
	DialogFooter,
} from "@material-tailwind/react";
import { useDispatch } from "react-redux";
import { logUserOut } from "@/Redux/features/authSlice";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

interface ConfirmLogoutModal {
	open: boolean;
	handleOpen: () => void;
}
const ConfirmLogoutModal = ({ handleOpen, open }: ConfirmLogoutModal) => {
	const router = useRouter();
	const dispatch = useDispatch();
	const logout = async () => {
		dispatch(logUserOut());
		router.push(ROUTES.login);
	};
	return (
		<Dialog open={open} size='xs' handler={handleOpen}>
			<DialogHeader className='text-black_pry'>Logout</DialogHeader>
			<DialogBody>Are you sure you want to logout from the app?</DialogBody>
			<DialogFooter>
				<Button
					variant='text'
					onClick={handleOpen}
					className='mr-1 normal-case text-black'
				>
					<span>No, Cancel</span>
				</Button>
				<Button className='normal-case bg-red_pry' onClick={logout}>
					<span>Yes, Logout</span>
				</Button>
			</DialogFooter>
		</Dialog>
	);
};

export default ConfirmLogoutModal;
