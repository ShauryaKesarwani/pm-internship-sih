
import React from "react";
import { Mail, MapPin, Globe, Briefcase } from "lucide-react";

interface CompanyInfoProps {
  email: string;
  location: string;
  website: string;
  industry: string;
}

const CompanyInfo: React.FC<CompanyInfoProps> = ({
  email,
  location,
  website,
  industry,
}) => {
  return (
    <section className="w-full bg-orange-50 py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
        {/* Email */}
        <div className="bg-white p-5 rounded-2xl shadow-sm flex items-center gap-3 w-[230px]">
          {/* <Mail className="text-orange-500" /> */}
          <div >
            <p className="text-sm text-gray-500 ">Email</p>
            <p className="text-sm text-gray-800">{email}</p>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white p-5 rounded-2xl shadow-sm flex items-center gap-3 w-[230px]">
          <MapPin className="text-orange-500" />
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium text-gray-800">{location}</p>
          </div>
        </div>

        {/* Website */}
        <div className="bg-white p-5 rounded-2xl shadow-sm flex items-center gap-3 w-[230px]">
          {/* <Globe className="text-orange-500" /> */}
          <div>
            <p className="text-sm text-gray-500">Website</p>
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-orange-600 hover:underline"
            >
              {website}
            </a>
          </div>
        </div>

        {/* Industry */}
        <div className="bg-white p-5 rounded-2xl shadow-sm flex items-center gap-3 w-[230px]">
          <Briefcase className="text-orange-500" />
          <div>
            <p className="text-sm text-gray-500">Industry</p>
            <p className="font-medium text-gray-800">{industry}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyInfo;
