import { Internship } from "../../data/Internship";

import { getTypeColor } from "./InternshipHelpers";

import { InternshipCardActions } from "./InternshipCardActions";
import { InternshipCardDetails } from "./InternshipCardDetails";
import { InternshipCardSkills } from "./InternshipCardSkills";

// Icons
import {
    Star,
    Share2,
} from "lucide-react";


// Grid view component
export const InternshipCardGrid = ({ internship, daysLeft, onLike, onBookmark }: {
    internship: Internship;
    daysLeft: number;
    onLike: () => void;
    onBookmark: () => void;
}) => (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
            <img
                src={internship.imageUrl || internship.companyLogo}
                alt={internship.title}
                className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 flex space-x-2">
                <InternshipCardActions
                    internship={internship}
                    onLike={onLike}
                    onBookmark={onBookmark}
                    iconSize={18}
                />
            </div>

            <div className="absolute bottom-3 left-3">
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(internship.type)}`}
                >
                    {internship.type}
                </span>
            </div>
        </div>

        {/* Content */}
        <div className="p-6">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                    <img
                        src={internship.companyLogo}
                        alt={internship.company}
                        className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{internship.title}</h3>
                        <p className="text-gray-600 text-sm">{internship.company}</p>
                    </div>
                </div>
                {/* <div className="flex items-center space-x-1">
                    <Star size={16} className="text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{internship.rating}</span>
                </div> */}
            </div>

            <p className="text-gray-700 text-sm mb-4 line-clamp-2">{internship.description}</p>

            <InternshipCardDetails internship={internship} isGrid />

            <InternshipCardSkills skills={internship.skills} limit={4} />

            <div className="flex justify-between items-center mt-4">
                <span
                    className={`text-sm font-medium ${daysLeft <= 7 ? "text-red-600" : "text-gray-600"}`}
                >
                    {daysLeft > 0 ? `${daysLeft} days left` : ""}
                </span>

                <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Share2 size={16} />
                    </button>
                    <button className="px-4 py-2 bg-[#FF9982] text-white rounded-lg hover:bg-[#FF876A] transition-colors text-sm">
                        Apply Now
                    </button>
                </div>
            </div>
        </div>
    </div>
);
