"use client";

import { useState } from "react";
import Image from "next/image";
import { HiOutlineBell } from "react-icons/hi2";
import { IoMenuSharp } from "react-icons/io5";
import SideDrawer from "./SideDrawer";
import { useAuthSelector } from "@/src/Redux/selectors";

const Header = () => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const { user } = useAuthSelector();

	const toggleDrawer = () => {
		setIsDrawerOpen(!isDrawerOpen);
	};
	return (
		<header className='h-[70px] fixed top-0 left-0 w-full flex max-999:justify-between justify-end bg-white shadow-[0px_2px_8px_0px_rgba(0,0,0,0.15)] z-30 px-[30px]'>
			<button className=' max-999:block hidden' onClick={toggleDrawer}>
				<IoMenuSharp className='text-primary text-3xl' />
			</button>
			<div className='flex items-center gap-[20px] '>
				{/* Notification Bell */}

				<div className='flex items-center gap-5'>
					{/* Notification Bell */}
					<button className='relative h-fit'>
						<HiOutlineBell
							size={28}
							className=' text-[#808191] font-semibold'
						/>
						<span className='absolute top-0 right-0 transform  w-2.5 h-2.5   rounded-full'></span>
					</button>

					{/* User Profile */}
					<div className='flex items-center gap-3'>
						<Image
							src={user.company_logo}
							alt='User profile'
							className='w-10 h-10 rounded-full object-cover object-top shadow'
							width={40}
							height={40}
						/>
						<span className='text-[#11142D] font-medium text-sm'>
							{user.full_name}
						</span>
					</div>
				</div>
			</div>
			<SideDrawer isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
		</header>
	);
};

export default Header;
