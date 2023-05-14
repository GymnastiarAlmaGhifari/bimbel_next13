"use client";

import { HiOutlineSearch } from "react-icons/hi";

const Search = () => {
  return (
    <div className="inline-block flex flex-row items-center  relative">
      <div className="w-80  h-10 bg-Neutral-95 rounded-full flex items-center pl-4 pr-20">
        <input
          type="search"
          name=""
          id="" 
          className="outline-none w-full bg-transparent"
        />
      </div>

      <button className="rounded-full p-4 bg-Tertiary-50 text-Neutral-100 absolute right-0 border-4 border-Neutral-100">
        <HiOutlineSearch size={24} />
      </button>
    </div>
  );
};

export default Search;
