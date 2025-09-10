import React from "react";

const Menu = () => {
  return (
<section className="w-365 bg-purple-600 py-4 ml-4 mr-4 mt-2 rounded-lg">
        <div className="max-w-7xl px-2 flex items-start justify-start">
          <ul className="flex space-x-8 text-white font-medium">
            <li className="relative group cursor-pointer">
              <span className="px-3 py-2">Home</span>
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </li>
            <li className="relative group cursor-pointer">
              <span className="px-3 py-2">About</span>
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </li>
            <li className="relative group cursor-pointer">
              <span className="px-3 py-2">Guidelines/documentation</span>
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </li>
            <li className="relative group cursor-pointer">
              <span className="px-3 py-2">eligiblity</span>
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </li>
            <li className="relative group cursor-pointer">
              <span className="px-3 py-2">Services</span>
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </li>
            <li className="relative group cursor-pointer">
              <span className="px-3 py-2">Contact</span>
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </li>
          </ul>
        </div>
      </section>
  );
};

export default Menu;