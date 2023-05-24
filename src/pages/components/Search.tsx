import React from "react";
import { HiOutlineSearch } from "react-icons/hi";

interface SearchProps {
  noButton?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Search: React.FC<SearchProps> = ({ onChange, noButton }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <div className="inline-block flex flex-row items-center relative">
      <div className="focus-within:ring-1 focus-within:ring-Tertiary-50 focus-within:bg-Tertiary-95 w-80  h-10 bg-Neutral-95 rounded-full flex items-center pl-4 pr-20 ">
        <input
          type="search"
          name=""
          id=""
          className="outline-none w-full bg-transparent"
          onChange={handleInputChange}
        />
      </div>

      {noButton ? (
        ""
      ) : (
        <button className="rounded-full p-4 bg-Tertiary-50 text-Neutral-100 absolute right-0 translate-x-2 border-4 border-Neutral-100">
          <HiOutlineSearch size={24} />
        </button>
      )}
    </div>
  );
};

export default Search;
