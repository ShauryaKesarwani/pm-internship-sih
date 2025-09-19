"use client";

// React
import React from "react";

// Types
import { Internship } from "../../data/Internship";

// Helper Functions
import {  getDaysUntilDeadline } from "./InternshipHelpers";

// Components
import { InternshipCardList } from "./InternshipCardList";
import { InternshipCardGrid } from "./IntternshipCardGrid";

interface InternshipCardProps {
  internship: Internship;
  viewMode: "grid" | "list";
  onBookmark: () => void;
  onLike: () => void;
}

const InternshipCard: React.FC<InternshipCardProps> = ({
  internship,
  viewMode,
  onBookmark,
  onLike,
}) => {
  const daysLeft = getDaysUntilDeadline(internship.deadline);

  if (viewMode === "list") {
    return <InternshipCardList internship={internship} daysLeft={daysLeft} onLike={onLike} onBookmark={onBookmark} />;
  }

  return <InternshipCardGrid internship={internship} daysLeft={daysLeft} onLike={onLike} onBookmark={onBookmark} />;
};

export default InternshipCard;