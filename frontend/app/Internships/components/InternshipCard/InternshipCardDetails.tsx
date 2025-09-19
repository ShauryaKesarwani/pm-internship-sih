import { Internship } from "../../data/Internship";
import { getTypeColor, formatCurrency } from "./InternshipHelpers";

import {
  MapPin,
  Clock,
  DollarSign,
  Users,
} from "lucide-react";

// Component for displaying core internship details
export const InternshipCardDetails = ({ internship, isGrid = false }: {
  internship: Internship;
  isGrid?: boolean;
}) => (
  <div className={`flex flex-wrap items-center gap-4 ${isGrid ? 'space-y-2' : 'mb-4'}`}>
    <div className={`flex items-center space-x-1 ${isGrid ? 'text-sm' : 'text-gray-600'}`}>
      <MapPin size={16} />
      <span>{internship.location}</span>
    </div>

    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(internship.type)}`}
    >
      {internship.type}
    </span>

    <div className={`flex items-center space-x-1 ${isGrid ? 'text-sm' : 'text-gray-600'}`}>
      <Clock size={16} />
      <span>{internship.duration}</span>
    </div>

    <div className={`flex items-center space-x-1 ${isGrid ? 'text-sm' : 'text-gray-600'}`}>
      <DollarSign size={16} />
      <span>{formatCurrency(internship.stipend)}/month</span>
    </div>

    <div className={`flex items-center space-x-1 ${isGrid ? 'text-sm' : 'text-gray-600'}`}>
      <Users size={16} />
      <span>{internship.applicants} applicants</span>
    </div>
  </div>
);