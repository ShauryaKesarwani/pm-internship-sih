"use client";

// React
import React from "react";

// Icons
import { MapPin, Clock, DollarSign, Building2, Users, Star } from "lucide-react";

// Types
import { Internship } from "../data/Internship";
import { useRouter } from "next/navigation";

interface GeneratedInternshipsSectionProps {
    generatedInternships: Internship[];
    showGeneratedInternships: boolean;
    setShowGeneratedInternships: (show: boolean) => void;
    onInternshipClick: (internship: Internship) => void;
    // If you need to regenerate, uncomment the following line
    // generateInternships: () => void;
}

const GeneratedInternshipsSection: React.FC<GeneratedInternshipsSectionProps> = ({
    generatedInternships,
    showGeneratedInternships,
    setShowGeneratedInternships,
    onInternshipClick,
    // If you need to regenerate, uncomment the following line
    // generateInternships,
}) => {
    const router = useRouter();
    console.log(generatedInternships);
    if (!showGeneratedInternships) {
        return null;
    }

    return (
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200 p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                        <span>Personalised Internships</span>
                    </h2>
                    <p className="text-gray-600 mt-1">
                        AI-powered recommendations based on your search criteria
                    </p>
                </div>
                <button
                    onClick={() => setShowGeneratedInternships(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedInternships.map((internship) => (
                    
                    <div
                        key={internship.id}
                        onClick={() => onInternshipClick(internship)}
                        className="cursor-pointer bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-orange-300 group relative overflow-hidden flex flex-col"
                    >
                        {/* Generated Badge and Score */}
                        <div className="absolute top-3 right-3 flex flex-col items-end space-y-1">
                            {internship.combinedScore && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                    Match: {Math.round(internship.combinedScore * 100)}%
                                </span>
                            )}
                        </div>

                        {/* Company Logo and Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                                        {internship.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {internship.company?.name || "Unknown"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm font-medium text-gray-700">
                                    {internship.rating}
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
                            {internship.description}
                        </p>

                        {/* Details */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span>{internship.location}</span>
                                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                                    {internship.type}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span>{internship.duration}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <DollarSign className="w-4 h-4" />
                                <span>{internship.stipend.toLocaleString()}</span>
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                    {internship.stipendType}
                                </span>
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="mb-4">
                            <div className="flex flex-wrap gap-1">
                                {internship.skills.slice(0, 3).map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs"
                                    >
                                        {skill}
                                    </span>
                                ))}
                                {internship.skills.length > 3 && (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                        +{internship.skills.length - 3} more
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Score Breakdown */}
                        {internship.combinedScore && (
                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                <div className="text-xs text-gray-600 mb-2 font-medium">
                                    Recommendation Scores:
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div className="text-center">
                                        <div className="font-medium text-blue-600">
                                            {Math.round((internship.simScore || 0) * 100)}%
                                        </div>
                                        <div className="text-gray-500">Similarity</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-medium text-green-600">
                                            {Math.round((internship.metaScore || 0) * 100)}%
                                        </div>
                                        <div className="text-gray-500">Metadata</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-medium text-orange-600">
                                            {Math.round(internship.combinedScore * 100)}%
                                        </div>
                                        <div className="text-gray-500">Combined</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Footer  */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-100 gap-2">
                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                <div className="flex items-center space-x-1 whitespace-nowrap">
                                    <Users className="w-3 h-3" />
                                    <span>{internship.applicants} applicants</span>
                                </div>
                                <div className="flex items-center space-x-1 whitespace-nowrap">
                                    <Clock className="w-3 h-3" />
                                    <span>Apply by {new Date(internship.deadline).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-1 whitespace-nowrap">
                                    <Clock className="w-3 h-3" />
                                    <span>Listed on {new Date(internship.postedDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-end sm:justify-normal space-x-2 flex-shrink-0">

                                <button 
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    try{

                                        const response = await fetch(`/user/${internship.id}/register`,{
                                            method:"POST",
                                            headers:{
                                                "Content-Type":"application/json",
                                            },
                                        });
                                        if(!response.ok){
                                            throw new Error("Registration failed");
                                        }
                                        console.log("Registered successfully");
                                        router.push(`/proficiencyTest/${internship.id}`);

                                    } catch(error){
                                        console.error(error);
                                    }
                                }}
                                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium whitespace-nowrap">
                                    Apply Now
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GeneratedInternshipsSection;