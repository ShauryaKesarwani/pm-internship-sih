import React from "react";

const FilterSidebar = () => {
  return (
    <div className="flex flex-col gap-2 w-full max-w-xs p-2 pt-20 bg-[#FFDECC]">
      <button className="px-4 py-2 w-[80%] mx-auto bg-[#FCF7F4] text-black rounded-md hover:bg-gray-300">
        By Location
      </button>
      <button className="px-4 py-2 w-[80%] mx-auto bg-[#FCF7F4] text-black rounded-md hover:bg-gray-300">
        By Type
      </button>
      <button className="px-4 py-2 w-[80%] mx-auto bg-[#FCF7F4] text-black rounded-md hover:bg-gray-300">
        By Duration
      </button>
    </div>
  );
};

export default FilterSidebar;
