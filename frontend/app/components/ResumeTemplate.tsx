"use client";
import React from "react";
import { MapPin, Phone, Mail, Globe, Linkedin } from "lucide-react";

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
  template?: 'modern' | 'classic' | 'minimal';
}

export default function ResumeTemplate({
  personalInfo,
  experiences,
  educations,
  skills,
  projects,
  certifications,
  template = 'modern'
}: ResumeTemplateProps) {
  const formatDate = (date: string) => {
    if (!date) return '';
    const [year, month] = date.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-green-500';
      case 'Advanced': return 'bg-blue-500';
      case 'Intermediate': return 'bg-yellow-500';
      case 'Beginner': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  if (template === 'minimal') {
    return (
      <div className="max-w-4xl mx-auto bg-white p-8 text-gray-900">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{personalInfo.fullName}</h1>
          <div className="flex justify-center gap-4 text-sm text-gray-600">
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {personalInfo.phone}
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {personalInfo.location}
              </span>
            )}
          </div>
          {(personalInfo.linkedin || personalInfo.website) && (
            <div className="flex justify-center gap-4 mt-2">
              {personalInfo.linkedin && (
                <a href={personalInfo.linkedin} className="text-blue-600 hover:underline flex items-center gap-1">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              )}
              {personalInfo.website && (
                <a href={personalInfo.website} className="text-blue-600 hover:underline flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  Website
                </a>
              )}
            </div>
          )}
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">Summary</h2>
            <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-1">Experience</h2>
            {experiences.map((exp) => (
              <div key={exp.id} className="mb-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-gray-600 font-medium">{exp.company}</p>
                    {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                  </div>
                </div>
                {exp.description && (
                  <p className="text-gray-700 mb-2">{exp.description}</p>
                )}
                {exp.achievements.filter(a => a.trim()).length > 0 && (
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {exp.achievements.filter(a => a.trim()).map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {educations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-1">Education</h2>
            {educations.map((edu) => (
              <div key={edu.id} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-600 font-medium">{edu.institution}</p>
                    {edu.field && <p className="text-sm text-gray-500">{edu.field}</p>}
                    {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>{formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-1">Skills</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {skills.map((skill) => (
                <div key={skill.id} className="flex items-center justify-between">
                  <span className="text-gray-700">{skill.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div 
                        className={`h-2 rounded-full ${getSkillLevelColor(skill.level)}`}
                        style={{ 
                          width: skill.level === 'Expert' ? '100%' : 
                                 skill.level === 'Advanced' ? '75%' : 
                                 skill.level === 'Intermediate' ? '50%' : '25%' 
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{skill.level}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-1">Projects</h2>
            {projects.map((project) => (
              <div key={project.id} className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  {project.url && (
                    <a href={project.url} className="text-blue-600 hover:underline text-sm">
                      View Project
                    </a>
                  )}
                </div>
                <p className="text-gray-700 mb-2">{project.description}</p>
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-1">Certifications</h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{cert.name}</h3>
                <p className="text-gray-600">{cert.issuer} - {formatDate(cert.date)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Modern template (default)
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 text-gray-900">
      {/* Header */}
        <div className="border-b-2 border-orange-500 pb-6 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{personalInfo.fullName}</h1>
          <div className="flex flex-wrap gap-4 text-gray-600">
            {personalInfo.email && (
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {personalInfo.phone}
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {personalInfo.location}
              </span>
            )}
            {personalInfo.linkedin && (
              <a href={personalInfo.linkedin} className="text-orange-600 hover:underline flex items-center gap-2">
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            )}
            {personalInfo.website && (
              <a href={personalInfo.website} className="text-orange-600 hover:underline flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Website
              </a>
            )}
          </div>
        </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-600 mb-4 border-b border-orange-200 pb-2">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed text-lg">{personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-600 mb-6 border-b border-orange-200 pb-2">Professional Experience</h2>
          {experiences.map((exp) => (
            <div key={exp.id} className="mb-8">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{exp.position}</h3>
                  <p className="text-lg text-orange-600 font-medium">{exp.company}</p>
                  {exp.location && <p className="text-gray-600">{exp.location}</p>}
                </div>
                <div className="text-right text-gray-600">
                  <p className="font-medium">{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                </div>
              </div>
              {exp.description && (
                <p className="text-gray-700 mb-3">{exp.description}</p>
              )}
              {exp.achievements.filter(a => a.trim()).length > 0 && (
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  {exp.achievements.filter(a => a.trim()).map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {educations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-600 mb-6 border-b border-orange-200 pb-2">Education</h2>
          {educations.map((edu) => (
            <div key={edu.id} className="mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-lg text-orange-600 font-medium">{edu.institution}</p>
                  {edu.field && <p className="text-gray-600">{edu.field}</p>}
                  {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                </div>
                <div className="text-right text-gray-600">
                  <p className="font-medium">{formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-600 mb-6 border-b border-orange-200 pb-2">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(skills.reduce((acc, skill) => {
              const category = skill.category || 'Other';
              if (!acc[category]) acc[category] = [];
              acc[category].push(skill);
              return acc;
            }, {} as Record<string, Skill[]>)).map(([category, categorySkills]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{category}</h3>
                <div className="space-y-2">
                  {categorySkills.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between">
                      <span className="text-gray-700">{skill.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div 
                            className={`h-2 rounded-full ${getSkillLevelColor(skill.level)}`}
                            style={{ 
                              width: skill.level === 'Expert' ? '100%' : 
                                     skill.level === 'Advanced' ? '75%' : 
                                     skill.level === 'Intermediate' ? '50%' : '25%' 
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 w-16 text-right">{skill.level}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-600 mb-6 border-b border-orange-200 pb-2">Projects</h2>
          {projects.map((project) => (
            <div key={project.id} className="mb-6 p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                {project.url && (
                  <a href={project.url} className="text-orange-600 hover:underline font-medium">
                    View Project →
                  </a>
                )}
              </div>
              <p className="text-gray-700 mb-3">{project.description}</p>
              {project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-600 mb-6 border-b border-orange-200 pb-2">Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certifications.map((cert) => (
              <div key={cert.id} className="p-4 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{cert.name}</h3>
                <p className="text-gray-600 mb-2">{cert.issuer}</p>
                <p className="text-sm text-gray-500">{formatDate(cert.date)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
