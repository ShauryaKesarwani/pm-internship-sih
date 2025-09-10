import React from "react";
import Link from "next/link";

const Menu = () => {
  return (
<section className="w-flex-max py-4 ml-9 mr-4 mt-2 rounded-lg">
        <div className="max-w-7xl px-2 flex items-start justify-start">
          <ul className="flex space-x-8 text-black font-medium">
            <li className="relative group cursor-pointer border border-black rounded-md hover:bg-gray-200 transition-colors duration-300">
                <Link href="/Home" className="px-3 py-2">
                    Home
                </Link>
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 "></span>
            </li>
            <li className="relative group cursor-pointer border border-black rounded-md hover:bg-gray-200 transition-colors duration-300">
                <Link href="/About" className="px-3 py-2">
                    About
                </Link>
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </li>
            <li className="relative group cursor-pointer border border-black rounded-md hover:bg-gray-200 transition-colors duration-300">
                <Link href="/guidelines" className="px-3 py-2">
                    Guidelines/Documentation
                </Link>
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </li>
            <li className="relative group cursor-pointer border border-black rounded-md hover:bg-gray-200 transition-colors duration-300">
              <Link href="/Eligiblity" className="px-3 py-2">
                    Eligiblity
                </Link>
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </li>
            <li className="relative group cursor-pointer border border-black rounded-md hover:bg-gray-200 transition-colors duration-300">
              <Link href="/Services" className="px-3 py-2">
                    Services
                </Link>
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </li>
            <li className="relative group cursor-pointer border border-black rounded-md hover:bg-gray-200 transition-colors duration-300">
              <Link href="/Contact" className="px-3 py-2">
                    Contact
                </Link>
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </li>
          </ul>
        </div>
      </section>
  );
};

export default Menu;