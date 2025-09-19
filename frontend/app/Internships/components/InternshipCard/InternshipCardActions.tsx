// Component for the like and bookmark buttons

import { Internship } from "../../data/Internship";

import {
  Heart,
  Bookmark,
} from "lucide-react";

export const InternshipCardActions = ({ internship, onLike, onBookmark, iconSize = 20 }: {
  internship: Internship;
  onLike: () => void;
  onBookmark: () => void;
  iconSize?: number;
}) => (
  <div className="flex items-center space-x-2">
    <button
      onClick={onLike}
      className={`p-2 rounded-full ${internship.isLiked ? "text-red-500" : "text-gray-400"} hover:bg-gray-100 transition-colors`}
    >
      <Heart
        size={iconSize}
        fill={internship.isLiked ? "currentColor" : "none"}
      />
    </button>
    <button
      onClick={onBookmark}
      className={`p-2 rounded-full ${internship.isBookmarked ? "text-blue-500" : "text-gray-400"} hover:bg-gray-100 transition-colors`}
    >
      <Bookmark
        size={iconSize}
        fill={internship.isBookmarked ? "currentColor" : "none"}
      />
    </button>
  </div>
);