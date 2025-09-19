
// Component for displaying skills

export const InternshipCardSkills = ({ skills, limit }: { skills: string[], limit: number }) => (
  <div className="flex flex-wrap gap-1">
    {skills.slice(0, limit).map((skill) => (
      <span
        key={skill}
        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
      >
        {skill}
      </span>
    ))}
    {skills.length > limit && (
      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
        +{skills.length - limit} more
      </span>
    )}
  </div>
);