// src/utils/internshipHelpers.ts

// Helper function to format currency as INR
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper function to get color classes based on internship type
export const getTypeColor = (type: string) => {
  switch (type) {
    case "Remote":
      return "bg-green-100 text-green-800";
    case "On-site":
      return "bg-blue-100 text-blue-800";
    case "Hybrid":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Helper function to calculate days until the deadline
export const getDaysUntilDeadline = (deadline: string) => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};