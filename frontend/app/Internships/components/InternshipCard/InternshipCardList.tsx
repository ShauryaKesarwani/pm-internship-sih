"use client";

import { Internship } from "../../data/Internship";

import { InternshipCardActions } from "./InternshipCardActions";
import { InternshipCardDetails } from "./InternshipCardDetails";
import { InternshipCardSkills } from "./InternshipCardSkills";
import { useRouter } from "next/navigation";

import {
    Star,
} from "lucide-react";

// List view component
export const InternshipCardList = ({ internship, daysLeft, onLike, onBookmark }: {
    internship: Internship;
    daysLeft: number;
    onLike: () => void;
    onBookmark: () => void;
}) => {
    const router = useRouter();
    return(
    
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start space-x-4">
            <img
                src={internship.companyLogo}
                alt={internship.company}
                className="w-16 h-16 rounded-lg object-cover"
            />

            <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{internship.title}</h3>
                        <p className="text-gray-600 mb-2">{internship.company}</p>
                    </div>
                    <InternshipCardActions
                        internship={internship}
                        onLike={onLike}
                        onBookmark={onBookmark}
                    />
                </div>

                <p className="text-gray-700 mb-4 line-clamp-2">{internship.description}</p>
                <InternshipCardDetails internship={internship} />

                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        {/* <div className="flex items-center space-x-1">
                            <Star size={16} className="text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{internship.rating}</span>
                        </div> */}
                        <InternshipCardSkills skills={internship.skills} limit={3} />
                    </div>

                    <div className="flex items-center space-x-2">
                        <span
                            className={`text-sm font-medium ${daysLeft <= 7 ? "text-red-600" : "text-gray-600"}`}
                        >
                            {daysLeft > 0 ? `${daysLeft} days left` : "10"}
                        </span>
                        <button 
                        onClick={()=> router.push(`/proficiencyTest/${internship.id}`)}
                        className="px-4 py-2 bg-[#FF9982] text-white rounded-lg hover:bg-[#FF876A] transition-colors">
                            Apply Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
)};