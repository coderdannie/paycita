import React from "react";
import { SearchIcon } from "lucide-react";

interface SearchCompProps {
	searchTerm: string;
	setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
	setPageIndex?: React.Dispatch<React.SetStateAction<number>>;
}

const SearchComp: React.FC<SearchCompProps> = ({
	searchTerm,
	setSearchTerm,
	setPageIndex,
}) => {
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
		setPageIndex && setPageIndex(1);
	};

	return (
		<div className='flex gap-3 my-3 relative w-full justify-between items-center  md:w-[15rem]'>
			<span className='absolute top-2 left-3'>
				<SearchIcon />
			</span>
			<input
				type='text'
				placeholder='Search'
				value={searchTerm}
				onChange={handleInputChange}
				className='rounded-md p-2 border-[1px] pl-12 w-full bg-transparent border-borderLight dark:border-borderDark'
			/>
		</div>
	);
};

export default SearchComp;
