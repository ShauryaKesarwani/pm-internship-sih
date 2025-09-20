"use client";
import React from "react";

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa: string;
  achievements: string[];
}

interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url: string;
  startDate: string;
  endDate: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

interface ResumeTemplateProps {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
}

export default function ResumeTemplate({
  personalInfo,
  experiences,
  educations,
  skills,
  projects,
  certifications
}: ResumeTemplateProps) {
  const formatDate = (date: string) => {
    if (!date) return '';
    const [year, month] = date.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  // LaTeX Academic Style (default)
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 text-gray-900 font-serif" style={{ fontFamily: 'Times, serif' }}>
      {/* Header - Academic Style */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 tracking-wide" style={{ fontSize: '18pt' }}>
          {personalInfo.fullName.toUpperCase()}
        </h1>
        
        {/* Contact Information */}
        <div className="text-sm text-gray-700 space-y-1" style={{ fontSize: '10pt' }}>
          {personalInfo.phone && personalInfo.location && (
            <p>{personalInfo.phone} ◊ {personalInfo.location}</p>
          )}
          <div className="flex justify-center items-center space-x-2">
            {personalInfo.email && (
              <a href={`mailto:${personalInfo.email}`} className="text-blue-600 underline">
                {personalInfo.email}
              </a>
            )}
            {personalInfo.linkedin && (
              <>
                <span>◊</span>
                <a href={personalInfo.linkedin} className="text-blue-600 underline">LinkedIn</a>
              </>
            )}
            {personalInfo.website && (
              <>
                <span>◊</span>
                <a href={personalInfo.website} className="text-blue-600 underline">GitHub</a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Education Section */}
      {educations.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-900 pb-1" style={{ fontSize: '11pt' }}>
            EDUCATION
          </h2>
          {educations.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900" style={{ fontSize: '10pt' }}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}, {edu.institution}
                  </p>
                  {edu.location && (
                    <p className="text-xs text-gray-700" style={{ fontSize: '9pt' }}>
                      {edu.location}
                    </p>
                  )}
                  {edu.gpa && (
                    <p className="text-xs text-gray-700" style={{ fontSize: '9pt' }}>
                      GPA: {edu.gpa}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900" style={{ fontSize: '10pt' }}>
                    {edu.current ? 'Present' : formatDate(edu.endDate)}
                  </p>
                  <p className="text-xs text-gray-700" style={{ fontSize: '9pt' }}>
                    {formatDate(edu.startDate)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills Section */}
      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-900 pb-1" style={{ fontSize: '11pt' }}>
            SKILLS
          </h2>
          <div className="space-y-2">
            {Object.entries(skills.reduce((acc, skill) => {
              const category = skill.category || 'Technical Skills';
              if (!acc[category]) acc[category] = [];
              acc[category].push(skill);
              return acc;
            }, {} as Record<string, Skill[]>)).map(([category, categorySkills]) => (
              <div key={category} className="flex">
                <div className="w-40 flex-shrink-0">
                  <span className="text-sm font-bold text-gray-900" style={{ fontSize: '10pt' }}>
                    {category}
                  </span>
                </div>
                <div className="flex-1">
                  <span className="text-sm text-gray-700" style={{ fontSize: '10pt' }}>
                    {categorySkills.map((skill, index) => (
                      <span key={skill.id}>
                        {skill.level === 'Expert' ? (
                          <strong>{skill.name}</strong>
                        ) : (
                          skill.name
                        )}
                        {index < categorySkills.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience Section */}
      {experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-900 pb-1" style={{ fontSize: '11pt' }}>
            EXPERIENCE
          </h2>
          {experiences.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900" style={{ fontSize: '10pt' }}>
                    {exp.position} – {exp.company}
                  </p>
                  {exp.location && (
                    <p className="text-xs italic text-gray-700" style={{ fontSize: '9pt' }}>
                      {exp.location}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900" style={{ fontSize: '10pt' }}>
                    {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </p>
                </div>
              </div>
              
              {exp.description && (
                <p className="text-sm text-gray-700 mb-2" style={{ fontSize: '10pt' }}>
                  {exp.description}
                </p>
              )}
              
              {exp.achievements.filter(a => a.trim()).length > 0 && (
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4" style={{ fontSize: '10pt' }}>
                  {exp.achievements.filter(a => a.trim()).map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-900 pb-1" style={{ fontSize: '11pt' }}>
            PROJECTS
          </h2>
          {projects.map((project) => (
            <div key={project.id} className="mb-3">
              <div className="flex justify-between items-start mb-1">
                <div className="flex-1">
                  <span className="text-sm font-bold text-gray-900" style={{ fontSize: '10pt' }}>
                    {project.name}
                  </span>
                  {project.technologies.length > 0 && (
                    <span className="text-sm text-gray-700" style={{ fontSize: '10pt' }}>
                      {' – '}{project.technologies.join(', ')}
                    </span>
                  )}
                  {project.url && (
                    <span className="text-sm text-blue-600 ml-2" style={{ fontSize: '10pt' }}>
                      <a href={project.url} className="underline">GitHub</a>
                    </span>
                  )}
                </div>
                {project.startDate && project.endDate && (
                  <div className="text-right">
                    <p className="text-sm text-gray-900" style={{ fontSize: '10pt' }}>
                      {formatDate(project.startDate)} – {formatDate(project.endDate)}
                    </p>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-700" style={{ fontSize: '10pt' }}>
                {project.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Certifications Section */}
      {certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-900 pb-1" style={{ fontSize: '11pt' }}>
            CERTIFICATIONS
          </h2>
          {certifications.map((cert) => (
            <div key={cert.id} className="mb-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <span className="text-sm font-bold text-gray-900" style={{ fontSize: '10pt' }}>
                    {cert.name}
                  </span>
                  <span className="text-sm text-gray-700" style={{ fontSize: '10pt' }}>
                    {' – '}{cert.issuer}
                  </span>
                  {cert.url && (
                    <span className="text-sm text-blue-600 ml-2" style={{ fontSize: '10pt' }}>
                      <a href={cert.url} className="underline">Certificate</a>
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900" style={{ fontSize: '10pt' }}>
                    {formatDate(cert.date)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Extra-Curricular Activities */}
      {personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-900 pb-1" style={{ fontSize: '11pt' }}>
            EXTRA-CURRICULAR ACTIVITIES
          </h2>
          <p className="text-sm text-gray-700" style={{ fontSize: '10pt' }}>
            {personalInfo.summary}
          </p>
        </div>
      )}
    </div>
  );
}
