// PDF Generation utility for resume
// This is a placeholder implementation - in a real app, you'd use a library like jsPDF or Puppeteer

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
    summary: string;
  };
  experiences: Array<{
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    achievements: string[];
  }>;
  educations: Array<{
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
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    category: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    url: string;
    startDate: string;
    endDate: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    url: string;
  }>;
}

export const generateResumePDF = async (resumeData: ResumeData): Promise<void> => {
  try {
    // In a real implementation, you would:
    // 1. Use jsPDF or similar library to create PDF
    // 2. Convert the resume template to PDF format
    // 3. Handle styling and layout for PDF
    
    // For now, we'll simulate the process
    console.log('Generating PDF for:', resumeData.personalInfo.fullName);
    
    // Simulate PDF generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create a downloadable HTML version as fallback
    const htmlContent = generateResumeHTML(resumeData);
    downloadHTMLAsFile(htmlContent, `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.html`);
    
    // In a real app, you would trigger PDF download here
    alert('Resume generated successfully! A HTML version has been downloaded. In a production app, this would be a PDF file.');
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating resume. Please try again.');
  }
};

const generateResumeHTML = (data: ResumeData): string => {
  const formatDate = (date: string) => {
    if (!date) return '';
    const [year, month] = date.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personalInfo.fullName} - Resume</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: white;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            font-size: 2.5em;
            margin: 0;
            color: #1f2937;
        }
        .contact-info {
            margin-top: 10px;
            color: #6b7280;
        }
        .contact-info span {
            margin: 0 10px;
        }
        .section {
            margin-bottom: 30px;
        }
        .section h2 {
            color: #2563eb;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 5px;
            margin-bottom: 15px;
        }
        .experience-item, .education-item {
            margin-bottom: 20px;
        }
        .job-title {
            font-weight: bold;
            font-size: 1.1em;
            color: #1f2937;
        }
        .company {
            color: #2563eb;
            font-weight: 500;
        }
        .date {
            color: #6b7280;
            font-style: italic;
        }
        .achievements {
            margin-top: 10px;
        }
        .achievements ul {
            margin: 5px 0;
            padding-left: 20px;
        }
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        .skill-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .skill-level {
            font-size: 0.9em;
            color: #6b7280;
        }
        .project-item {
            margin-bottom: 15px;
            padding: 10px;
            border: 1px solid #e5e7eb;
            border-radius: 5px;
        }
        .project-title {
            font-weight: bold;
            color: #1f2937;
        }
        .technologies {
            margin-top: 5px;
        }
        .tech-tag {
            display: inline-block;
            background: #dbeafe;
            color: #1e40af;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            margin: 2px;
        }
        .summary {
            font-size: 1.1em;
            line-height: 1.7;
            color: #374151;
        }
        @media print {
            body {
                margin: 0;
                padding: 15px;
            }
            .section {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${data.personalInfo.fullName}</h1>
        <div class="contact-info">
            ${data.personalInfo.email ? `<span>📧 ${data.personalInfo.email}</span>` : ''}
            ${data.personalInfo.phone ? `<span>📞 ${data.personalInfo.phone}</span>` : ''}
            ${data.personalInfo.location ? `<span>📍 ${data.personalInfo.location}</span>` : ''}
            ${data.personalInfo.linkedin ? `<span>🔗 <a href="${data.personalInfo.linkedin}">LinkedIn</a></span>` : ''}
            ${data.personalInfo.website ? `<span>🌐 <a href="${data.personalInfo.website}">Website</a></span>` : ''}
        </div>
    </div>

    ${data.personalInfo.summary ? `
    <div class="section">
        <h2>Professional Summary</h2>
        <p class="summary">${data.personalInfo.summary}</p>
    </div>
    ` : ''}

    ${data.experiences.length > 0 ? `
    <div class="section">
        <h2>Professional Experience</h2>
        ${data.experiences.map(exp => `
            <div class="experience-item">
                <div class="job-title">${exp.position}</div>
                <div class="company">${exp.company}${exp.location ? ` - ${exp.location}` : ''}</div>
                <div class="date">${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}</div>
                ${exp.description ? `<p>${exp.description}</p>` : ''}
                ${exp.achievements.filter(a => a.trim()).length > 0 ? `
                    <div class="achievements">
                        <ul>
                            ${exp.achievements.filter(a => a.trim()).map(achievement => `<li>${achievement}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${data.educations.length > 0 ? `
    <div class="section">
        <h2>Education</h2>
        ${data.educations.map(edu => `
            <div class="education-item">
                <div class="job-title">${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</div>
                <div class="company">${edu.institution}${edu.location ? ` - ${edu.location}` : ''}</div>
                <div class="date">${formatDate(edu.startDate)} - ${edu.current ? 'Present' : formatDate(edu.endDate)}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</div>
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${data.skills.length > 0 ? `
    <div class="section">
        <h2>Skills</h2>
        <div class="skills-grid">
            ${data.skills.map(skill => `
                <div class="skill-item">
                    <span>${skill.name}</span>
                    <span class="skill-level">${skill.level}</span>
                </div>
            `).join('')}
        </div>
    </div>
    ` : ''}

    ${data.projects.length > 0 ? `
    <div class="section">
        <h2>Projects</h2>
        ${data.projects.map(project => `
            <div class="project-item">
                <div class="project-title">${project.name}${project.url ? ` - <a href="${project.url}">View Project</a>` : ''}</div>
                <p>${project.description}</p>
                ${project.technologies.length > 0 ? `
                    <div class="technologies">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${data.certifications.length > 0 ? `
    <div class="section">
        <h2>Certifications</h2>
        ${data.certifications.map(cert => `
            <div class="education-item">
                <div class="job-title">${cert.name}</div>
                <div class="company">${cert.issuer}</div>
                <div class="date">${formatDate(cert.date)}</div>
            </div>
        `).join('')}
    </div>
    ` : ''}
</body>
</html>
  `;
};

const downloadHTMLAsFile = (htmlContent: string, filename: string): void => {
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Alternative: Generate a simple text resume
export const generateResumeText = (data: ResumeData): string => {
  const formatDate = (date: string) => {
    if (!date) return '';
    const [year, month] = date.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  let text = '';
  
  // Header
  text += `${data.personalInfo.fullName}\n`;
  text += '='.repeat(data.personalInfo.fullName.length) + '\n\n';
  
  // Contact Info
  if (data.personalInfo.email) text += `Email: ${data.personalInfo.email}\n`;
  if (data.personalInfo.phone) text += `Phone: ${data.personalInfo.phone}\n`;
  if (data.personalInfo.location) text += `Location: ${data.personalInfo.location}\n`;
  if (data.personalInfo.linkedin) text += `LinkedIn: ${data.personalInfo.linkedin}\n`;
  if (data.personalInfo.website) text += `Website: ${data.personalInfo.website}\n`;
  text += '\n';

  // Summary
  if (data.personalInfo.summary) {
    text += 'PROFESSIONAL SUMMARY\n';
    text += '-'.repeat(20) + '\n';
    text += `${data.personalInfo.summary}\n\n`;
  }

  // Experience
  if (data.experiences.length > 0) {
    text += 'PROFESSIONAL EXPERIENCE\n';
    text += '-'.repeat(25) + '\n';
    data.experiences.forEach(exp => {
      text += `${exp.position}\n`;
      text += `${exp.company}${exp.location ? ` - ${exp.location}` : ''}\n`;
      text += `${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}\n`;
      if (exp.description) text += `${exp.description}\n`;
      if (exp.achievements.filter(a => a.trim()).length > 0) {
        exp.achievements.filter(a => a.trim()).forEach(achievement => {
          text += `• ${achievement}\n`;
        });
      }
      text += '\n';
    });
  }

  // Education
  if (data.educations.length > 0) {
    text += 'EDUCATION\n';
    text += '-'.repeat(10) + '\n';
    data.educations.forEach(edu => {
      text += `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}\n`;
      text += `${edu.institution}${edu.location ? ` - ${edu.location}` : ''}\n`;
      text += `${formatDate(edu.startDate)} - ${edu.current ? 'Present' : formatDate(edu.endDate)}`;
      if (edu.gpa) text += ` | GPA: ${edu.gpa}`;
      text += '\n\n';
    });
  }

  // Skills
  if (data.skills.length > 0) {
    text += 'SKILLS\n';
    text += '-'.repeat(6) + '\n';
    const skillsByCategory = data.skills.reduce((acc, skill) => {
      const category = skill.category || 'Other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill);
      return acc;
    }, {} as Record<string, typeof data.skills>);

    Object.entries(skillsByCategory).forEach(([category, skills]) => {
      text += `${category}: `;
      text += skills.map(s => `${s.name} (${s.level})`).join(', ');
      text += '\n';
    });
    text += '\n';
  }

  // Projects
  if (data.projects.length > 0) {
    text += 'PROJECTS\n';
    text += '-'.repeat(8) + '\n';
    data.projects.forEach(project => {
      text += `${project.name}${project.url ? ` - ${project.url}` : ''}\n`;
      text += `${project.description}\n`;
      if (project.technologies.length > 0) {
        text += `Technologies: ${project.technologies.join(', ')}\n`;
      }
      text += '\n';
    });
  }

  // Certifications
  if (data.certifications.length > 0) {
    text += 'CERTIFICATIONS\n';
    text += '-'.repeat(15) + '\n';
    data.certifications.forEach(cert => {
      text += `${cert.name}\n`;
      text += `${cert.issuer} - ${formatDate(cert.date)}\n\n`;
    });
  }

  return text;
};
