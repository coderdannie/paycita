// import React, { useState } from "react";
// import { Search } from "lucide-react";

// interface SearchBarProps {
//   onSearch: (query: string) => void;
// }

// const SearchBar = ({ onSearch }) => {
//   const [searchQuery, setSearchQuery] = useState("");

//   const handleInputChange = (e) => {
//     const query = e.target.value;
//     setSearchQuery(query);
//     onSearch(query);
//   };

//   return (
//     <div className="relative w-full md:max-w-lg">
//       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//         <Search className="h-5 w-5 text-gray-400" />
//       </div>
//       <input
//         type="text"
//         className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
//         placeholder="Search for relevant details"
//         value={searchQuery}
//         onChange={handleInputChange}
//       />
//     </div>
//   );
// };