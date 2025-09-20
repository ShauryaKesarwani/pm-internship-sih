"use client";
import React, { useState } from "react";
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Globe,
  Plus, 
  Trash2, 
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  CheckCircle
} from "lucide-react";
import Navbar from "../components/Navbar";
import HeaderWhite from "../components/header";
import ResumeTemplate from "../components/ResumeTemplate";
import { generateResumePDF, generateResumeText } from "../utils/resumePdfGenerator";
import { generateLatexResumePDF } from "../utils/latexPdfGenerator";
import Menu from "../components/menu";

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

export default function ResumeBuilderPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: ''
  });
  
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [previewMode, setPreviewMode] = useState(false);

  const totalSteps = 6;

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: ['']
    };
    setExperiences([...experiences, newExperience]);
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const addAchievement = (expId: string) => {
    setExperiences(experiences.map(exp => 
      exp.id === expId 
        ? { ...exp, achievements: [...exp.achievements, ''] }
        : exp
    ));
  };

  const updateAchievement = (expId: string, index: number, value: string) => {
    setExperiences(experiences.map(exp => 
      exp.id === expId 
        ? { 
            ...exp, 
            achievements: exp.achievements.map((ach, i) => i === index ? value : ach)
          }
        : exp
    ));
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
      achievements: ['']
    };
    setEducations([...educations, newEducation]);
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    setEducations(educations.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      level: 'Intermediate',
      category: 'Technical'
    };
    setSkills([...skills, newSkill]);
  };

  const updateSkill = (id: string, field: keyof Skill, value: any) => {
    setSkills(skills.map(skill => 
      skill.id === id ? { ...skill, [field]: value } : skill
    ));
  };

  const removeSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      url: '',
      startDate: '',
      endDate: ''
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    setProjects(projects.map(project => 
      project.id === id ? { ...project, [field]: value } : project
    ));
  };

  const addCertification = () => {
    const newCertification: Certification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      url: ''
    };
    setCertifications([...certifications, newCertification]);
  };

  const updateCertification = (id: string, field: keyof Certification, value: any) => {
    setCertifications(certifications.map(cert => 
      cert.id === id ? { ...cert, [field]: value } : cert
    ));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const downloadResume = async () => {
    try {
      // Show loading state (you could add a loading state to the component if desired)
      const resumeData = {
        personalInfo,
        experiences,
        educations,
        skills,
        projects,
        certifications
      };
      
      await generateResumePDF(resumeData);
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('Error downloading resume. Please try again.');
    }
  };

  const downloadTextResume = () => {
    try {
      const resumeData = {
        personalInfo,
        experiences,
        educations,
        skills,
        projects,
        certifications
      };
      
      const textContent = generateResumeText(resumeData);
      const blob = new Blob([textContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${personalInfo.fullName.replace(/\s+/g, '_')}_Resume.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading text resume:', error);
      alert('Error downloading text resume. Please try again.');
    }
  };

  const downloadLatexResume = async () => {
    try {
      // Show loading feedback
      const button = document.querySelector('[data-latex-btn]') as HTMLButtonElement;
      if (button) {
        button.disabled = true;
        button.innerHTML = '<svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Compiling LaTeX...';
      }

      const resumeData = {
        personalInfo,
        experiences,
        educations,
        skills,
        projects,
        certifications
      };
      
      await generateLatexResumePDF(resumeData);
      
      // Reset button
      if (button) {
        button.disabled = false;
        button.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>Download LaTeX';
      }
    } catch (error) {
      console.error('Error downloading LaTeX resume:', error);
      alert('Error generating LaTeX PDF: ' + (error as Error).message);
      
      // Reset button on error
      const button = document.querySelector('[data-latex-btn]') as HTMLButtonElement;
      if (button) {
        button.disabled = false;
        button.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>Download LaTeX';
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-orange-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Personal Information</h2>
              <p className="text-gray-600 text-lg">Let's start with your basic details</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={personalInfo.fullName}
                  onChange={(e) => setPersonalInfo({...personalInfo, fullName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="john.doe@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={personalInfo.location}
                  onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="New York, NY"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  value={personalInfo.linkedin}
                  onChange={(e) => setPersonalInfo({...personalInfo, linkedin: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website/Portfolio
                </label>
                <input
                  type="url"
                  value={personalInfo.website}
                  onChange={(e) => setPersonalInfo({...personalInfo, website: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="https://johndoe.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Summary
              </label>
              <textarea
                value={personalInfo.summary}
                onChange={(e) => setPersonalInfo({...personalInfo, summary: e.target.value})}
                rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Briefly describe your professional background, key skills, and career objectives..."
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-10 h-10 text-orange-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Work Experience</h2>
              <p className="text-gray-600 text-lg">Tell us about your professional experience</p>
            </div>

            {experiences.map((exp, index) => (
              <div key={exp.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Experience #{index + 1}</h3>
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Google"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Software Engineer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Mountain View, CA"
                    />
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                        disabled={exp.current}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">I currently work here</span>
                  </label>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description
                  </label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Describe your role and responsibilities..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Achievements
                  </label>
                  {exp.achievements.map((achievement, achIndex) => (
                    <div key={achIndex} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={achievement}
                        onChange={(e) => updateAchievement(exp.id, achIndex, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Achievement or responsibility..."
                      />
                      {achIndex === exp.achievements.length - 1 && (
                        <button
                          onClick={() => addAchievement(exp.id)}
                          className="px-3 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={addExperience}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-500 transition-colors"
            >
              <Plus className="w-5 h-5 mx-auto mb-2" />
              Add Work Experience
            </button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-10 h-10 text-orange-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Education</h2>
              <p className="text-gray-600 text-lg">Add your educational background</p>
            </div>

            {educations.map((edu, index) => (
              <div key={edu.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Education #{index + 1}</h3>
                  <button
                    onClick={() => setEducations(educations.filter(e => e.id !== edu.id))}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Institution *
                    </label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Stanford University"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Degree *
                    </label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Bachelor of Science"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Field of Study
                    </label>
                    <input
                      type="text"
                      value={edu.field}
                      onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Computer Science"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={edu.location}
                      onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Stanford, CA"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="month"
                      value={edu.startDate}
                      onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="month"
                      value={edu.endDate}
                      onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                      disabled={edu.current}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GPA (Optional)
                    </label>
                    <input
                      type="text"
                      value={edu.gpa}
                      onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="3.8"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={edu.current}
                        onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Currently studying</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addEducation}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-500 transition-colors"
            >
              <Plus className="w-5 h-5 mx-auto mb-2" />
              Add Education
            </button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-orange-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Skills & Certifications</h2>
              <p className="text-gray-600 text-lg">Highlight your technical and soft skills</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Skills</h3>
                {skills.map((skill, index) => (
                  <div key={skill.id} className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="JavaScript"
                    />
                    <select
                      value={skill.level}
                      onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                    <select
                      value={skill.category}
                      onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Technical">Technical</option>
                      <option value="Soft Skills">Soft Skills</option>
                      <option value="Languages">Languages</option>
                      <option value="Tools">Tools</option>
                    </select>
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addSkill}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-500 transition-colors"
                >
                  <Plus className="w-4 h-4 mx-auto mb-1" />
                  Add Skill
                </button>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Certifications</h3>
                {certifications.map((cert, index) => (
                  <div key={cert.id} className="border border-gray-200 rounded-lg p-4 mb-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Certification #{index + 1}</h4>
                      <button
                        onClick={() => setCertifications(certifications.filter(c => c.id !== cert.id))}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="AWS Certified Solutions Architect"
                      />
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Amazon Web Services"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="month"
                          value={cert.date}
                          onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="url"
                          value={cert.url}
                          onChange={(e) => updateCertification(cert.id, 'url', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Certificate URL"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addCertification}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-500 transition-colors"
                >
                  <Plus className="w-4 h-4 mx-auto mb-1" />
                  Add Certification
                </button>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-10 h-10 text-orange-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Projects & Portfolio</h2>
              <p className="text-gray-600 text-lg">Showcase your work and projects</p>
            </div>

            {projects.map((project, index) => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Project #{index + 1}</h3>
                  <button
                    onClick={() => setProjects(projects.filter(p => p.id !== project.id))}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      value={project.name}
                      onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="E-commerce Website"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project URL
                    </label>
                    <input
                      type="url"
                      value={project.url}
                      onChange={(e) => updateProject(project.id, 'url', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="https://github.com/username/project"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="month"
                      value={project.startDate}
                      onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="month"
                      value={project.endDate}
                      onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Description
                  </label>
                  <textarea
                    value={project.description}
                    onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Describe what the project does, your role, and key features..."
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Technologies Used
                  </label>
                  <input
                    type="text"
                    value={project.technologies.join(', ')}
                    onChange={(e) => updateProject(project.id, 'technologies', e.target.value.split(', '))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="React, Node.js, MongoDB, AWS"
                  />
                  <p className="text-sm text-gray-500 mt-1">Separate technologies with commas</p>
                </div>
              </div>
            ))}

            <button
              onClick={addProject}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-500 transition-colors"
            >
              <Plus className="w-5 h-5 mx-auto mb-2" />
              Add Project
            </button>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-orange-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Review & Download</h2>
              <p className="text-gray-600 text-lg">Review your resume and download it</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Resume Preview</h3>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    {previewMode ? 'Edit' : 'Preview'}
                  </button>
                  <button
                    onClick={downloadResume}
                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                  <button
                    onClick={downloadTextResume}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download TXT
                  </button>
                  <button
                    onClick={downloadLatexResume}
                    data-latex-btn
                    className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download LaTeX
                  </button>
                </div>
              </div>

              {previewMode ? (
                <ResumeTemplate
                  personalInfo={personalInfo}
                  experiences={experiences}
                  educations={educations}
                  skills={skills}
                  projects={projects}
                  certifications={certifications}
                />
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📄</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Resume Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="font-semibold">Personal Info</div>
                      <div>{personalInfo.fullName ? '✓' : '✗'}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="font-semibold">Experience</div>
                      <div>{experiences.length} entries</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="font-semibold">Education</div>
                      <div>{educations.length} entries</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="font-semibold">Skills</div>
                      <div>{skills.length} skills</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAEFE9]">
      <Navbar />
      <HeaderWhite />
      <Menu />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">Step {currentStep} of {totalSteps}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-orange-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          
          <div className="flex gap-2">
            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={downloadResume}
                  className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button
                  onClick={downloadTextResume}
                  className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download TXT
                </button>
                <button
                  onClick={downloadLatexResume}
                  data-latex-btn
                  className="px-6 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download LaTeX
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}