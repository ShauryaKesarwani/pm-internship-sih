import React from "react";
import Link from "next/link";

const Menu = () => {
    return (
        <section className="w-flex-max bg-amber-700 py-4 ml-4 mr-4 mt-2 rounded-lg">
            <div className="max-w-7xl px-2 flex items-start justify-start">
                <ul className="flex space-x-8 text-white font-medium pl-6">
                    <li className="relative group cursor-pointer">
                        <Link href="/" className="px-3 py-2">
                            Home
                        </Link>
                        <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    </li>
                    <li className="relative group cursor-pointer">
                        <Link href="/Internships" className="px-3 py-2">
                            Search Internships
                        </Link>
                        <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    </li>
                    <li className="relative group cursor-pointer">
                        <Link href="/resumeUploading" className="px-3 py-2">
                            Upload Resume
                        </Link>
                        <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    </li>
                    <li className="relative group cursor-pointer">
                        <Link href="/resume-builder" className="px-3 py-2">
                            Resume Builder
                        </Link>
                        <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    </li>
                    <li className="relative group cursor-pointer">
                        <Link href="/chat" className="px-3 py-2">
                            Chat
                        </Link>
                        <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    </li>
                    <li className="relative group cursor-pointer">
                        <Link href="/services" className="px-3 py-2">
                            Services
                        </Link>
                        <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    </li>
                    <li className="relative group cursor-pointer">
                        <Link href="/contact" className="px-3 py-2">
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