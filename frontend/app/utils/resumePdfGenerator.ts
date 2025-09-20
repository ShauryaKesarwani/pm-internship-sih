// PDF Generation utility for resume
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
    // Create a temporary container for the resume
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '794px'; // A4 width in pixels at 96 DPI
    tempContainer.style.backgroundColor = 'white';
    tempContainer.style.fontFamily = 'Arial, sans-serif';
    
    // Generate the resume HTML content
    tempContainer.innerHTML = generatePrintableResumeHTML(resumeData);
    
    // Append to body
    document.body.appendChild(tempContainer);
    
    // Wait for fonts and images to load
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate canvas from the HTML element
    const canvas = await html2canvas(tempContainer, {
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794,
      windowWidth: 794,
      scrollX: 0,
      scrollY: 0
    });
    
    // Remove temporary container
    document.body.removeChild(tempContainer);
    
    // Calculate PDF dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // If content fits on one page
    if (imgHeight <= pageHeight) {
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
    } else {
      // Multi-page handling
      let heightLeft = imgHeight;
      let position = 0;
      
      // Add first page
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add additional pages
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
    }
    
    // Download the PDF
    const fileName = `${resumeData.personalInfo.fullName.replace(/[^a-zA-Z0-9]/g, '_')}_Resume.pdf`;
    pdf.save(fileName);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

// Generate HTML content optimized for PDF generation
const generatePrintableResumeHTML = (data: ResumeData): string => {
  const formatDate = (date: string) => {
    if (!date) return '';
    const [year, month] = date.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const getSkillLevelWidth = (level: string) => {
    switch (level) {
      case 'Expert': return '100%';
      case 'Advanced': return '75%';
      case 'Intermediate': return '50%';
      case 'Beginner': return '25%';
      default: return '25%';
    }
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return '#10b981';
      case 'Advanced': return '#3b82f6';
      case 'Intermediate': return '#f59e0b';
      case 'Beginner': return '#9ca3af';
      default: return '#9ca3af';
    }
  };

  return `
    <div style="
      max-width: 794px;
      margin: 0;
      padding: 32px;
      background: white;
      color: #111827;
      font-family: Arial, sans-serif;
      font-size: 14px;
      line-height: 1.5;
    ">
      <!-- Header -->
      <div style="
        border-bottom: 2px solid #f97316;
        padding-bottom: 24px;
        margin-bottom: 32px;
      ">
        <h1 style="
          font-size: 32px;
          font-weight: bold;
          color: #111827;
          margin: 0 0 8px 0;
        ">${data.personalInfo.fullName}</h1>
        <div style="
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          color: #6b7280;
          font-size: 13px;
        ">
          ${data.personalInfo.email ? `
            <span style="display: inline-flex; align-items: center; gap: 4px;">
              📧 ${data.personalInfo.email}
            </span>
          ` : ''}
          ${data.personalInfo.phone ? `
            <span style="display: inline-flex; align-items: center; gap: 4px;">
              📞 ${data.personalInfo.phone}
            </span>
          ` : ''}
          ${data.personalInfo.location ? `
            <span style="display: inline-flex; align-items: center; gap: 4px;">
              📍 ${data.personalInfo.location}
            </span>
          ` : ''}
          ${data.personalInfo.linkedin ? `
            <span style="display: inline-flex; align-items: center; gap: 4px; color: #f97316;">
              🔗 LinkedIn
            </span>
          ` : ''}
          ${data.personalInfo.website ? `
            <span style="display: inline-flex; align-items: center; gap: 4px; color: #f97316;">
              🌐 Website
            </span>
          ` : ''}
        </div>
      </div>

      ${data.personalInfo.summary ? `
        <!-- Summary -->
        <div style="margin-bottom: 32px;">
          <h2 style="
            font-size: 20px;
            font-weight: 600;
            color: #f97316;
            margin: 0 0 16px 0;
            border-bottom: 1px solid #fed7aa;
            padding-bottom: 8px;
          ">Professional Summary</h2>
          <p style="
            color: #374151;
            font-size: 15px;
            line-height: 1.6;
            margin: 0;
          ">${data.personalInfo.summary}</p>
        </div>
      ` : ''}

      ${data.experiences.length > 0 ? `
        <!-- Experience -->
        <div style="margin-bottom: 32px;">
          <h2 style="
            font-size: 20px;
            font-weight: 600;
            color: #f97316;
            margin: 0 0 24px 0;
            border-bottom: 1px solid #fed7aa;
            padding-bottom: 8px;
          ">Professional Experience</h2>
          ${data.experiences.map(exp => `
            <div style="margin-bottom: 32px;">
              <div style="
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 12px;
              ">
                <div>
                  <h3 style="
                    font-size: 17px;
                    font-weight: 600;
                    color: #111827;
                    margin: 0 0 4px 0;
                  ">${exp.position}</h3>
                  <p style="
                    font-size: 15px;
                    color: #f97316;
                    font-weight: 500;
                    margin: 0 0 2px 0;
                  ">${exp.company}</p>
                  ${exp.location ? `
                    <p style="
                      color: #6b7280;
                      font-size: 13px;
                      margin: 0;
                    ">${exp.location}</p>
                  ` : ''}
                </div>
                <div style="
                  text-align: right;
                  color: #6b7280;
                  font-size: 13px;
                  font-weight: 500;
                ">
                  ${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}
                </div>
              </div>
              ${exp.description ? `
                <p style="
                  color: #374151;
                  margin: 0 0 12px 0;
                  line-height: 1.5;
                ">${exp.description}</p>
              ` : ''}
              ${exp.achievements.filter(a => a.trim()).length > 0 ? `
                <ul style="
                  color: #374151;
                  margin: 0;
                  padding-left: 20px;
                  line-height: 1.4;
                ">
                  ${exp.achievements.filter(a => a.trim()).map(achievement => `
                    <li style="margin-bottom: 4px;">${achievement}</li>
                  `).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.educations.length > 0 ? `
        <!-- Education -->
        <div style="margin-bottom: 32px;">
          <h2 style="
            font-size: 20px;
            font-weight: 600;
            color: #f97316;
            margin: 0 0 24px 0;
            border-bottom: 1px solid #fed7aa;
            padding-bottom: 8px;
          ">Education</h2>
          ${data.educations.map(edu => `
            <div style="margin-bottom: 24px;">
              <div style="
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
              ">
                <div>
                  <h3 style="
                    font-size: 17px;
                    font-weight: 600;
                    color: #111827;
                    margin: 0 0 4px 0;
                  ">${edu.degree}</h3>
                  <p style="
                    font-size: 15px;
                    color: #f97316;
                    font-weight: 500;
                    margin: 0 0 2px 0;
                  ">${edu.institution}</p>
                  ${edu.field ? `
                    <p style="
                      color: #6b7280;
                      font-size: 13px;
                      margin: 0 0 2px 0;
                    ">${edu.field}</p>
                  ` : ''}
                  ${edu.gpa ? `
                    <p style="
                      color: #6b7280;
                      font-size: 13px;
                      margin: 0;
                    ">GPA: ${edu.gpa}</p>
                  ` : ''}
                </div>
                <div style="
                  text-align: right;
                  color: #6b7280;
                  font-size: 13px;
                  font-weight: 500;
                ">
                  ${formatDate(edu.startDate)} - ${edu.current ? 'Present' : formatDate(edu.endDate)}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.skills.length > 0 ? `
        <!-- Skills -->
        <div style="margin-bottom: 32px;">
          <h2 style="
            font-size: 20px;
            font-weight: 600;
            color: #f97316;
            margin: 0 0 24px 0;
            border-bottom: 1px solid #fed7aa;
            padding-bottom: 8px;
          ">Skills</h2>
          <div style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          ">
            ${Object.entries(data.skills.reduce((acc, skill) => {
              const category = skill.category || 'Other';
              if (!acc[category]) acc[category] = [];
              acc[category].push(skill);
              return acc;
            }, {} as Record<string, typeof data.skills>)).map(([category, categorySkills]) => `
              <div>
                <h3 style="
                  font-size: 15px;
                  font-weight: 600;
                  color: #111827;
                  margin: 0 0 12px 0;
                ">${category}</h3>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  ${categorySkills.map(skill => `
                    <div style="
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                    ">
                      <span style="
                        color: #374151;
                        font-size: 13px;
                      ">${skill.name}</span>
                      <div style="
                        display: flex;
                        align-items: center;
                        gap: 8px;
                      ">
                        <div style="
                          width: 60px;
                          height: 6px;
                          background-color: #e5e7eb;
                          border-radius: 3px;
                          overflow: hidden;
                        ">
                          <div style="
                            height: 100%;
                            background-color: ${getSkillLevelColor(skill.level)};
                            width: ${getSkillLevelWidth(skill.level)};
                            border-radius: 3px;
                          "></div>
                        </div>
                        <span style="
                          font-size: 11px;
                          color: #6b7280;
                          width: 48px;
                          text-align: right;
                        ">${skill.level}</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${data.projects.length > 0 ? `
        <!-- Projects -->
        <div style="margin-bottom: 32px;">
          <h2 style="
            font-size: 20px;
            font-weight: 600;
            color: #f97316;
            margin: 0 0 24px 0;
            border-bottom: 1px solid #fed7aa;
            padding-bottom: 8px;
          ">Projects</h2>
          ${data.projects.map(project => `
            <div style="
              margin-bottom: 24px;
              padding: 16px;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
            ">
              <div style="
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 12px;
              ">
                <h3 style="
                  font-size: 17px;
                  font-weight: 600;
                  color: #111827;
                  margin: 0;
                ">${project.name}</h3>
                ${project.url ? `
                  <span style="
                    color: #f97316;
                    font-weight: 500;
                    font-size: 13px;
                  ">View Project →</span>
                ` : ''}
              </div>
              <p style="
                color: #374151;
                margin: 0 0 12px 0;
                line-height: 1.5;
              ">${project.description}</p>
              ${project.technologies.length > 0 ? `
                <div style="
                  display: flex;
                  flex-wrap: wrap;
                  gap: 6px;
                ">
                  ${project.technologies.map(tech => `
                    <span style="
                      padding: 4px 12px;
                      background-color: #fed7aa;
                      color: #9a3412;
                      font-size: 11px;
                      border-radius: 12px;
                    ">${tech}</span>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.certifications.length > 0 ? `
        <!-- Certifications -->
        <div style="margin-bottom: 32px;">
          <h2 style="
            font-size: 20px;
            font-weight: 600;
            color: #f97316;
            margin: 0 0 24px 0;
            border-bottom: 1px solid #fed7aa;
            padding-bottom: 8px;
          ">Certifications</h2>
          <div style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          ">
            ${data.certifications.map(cert => `
              <div style="
                padding: 16px;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
              ">
                <h3 style="
                  font-size: 15px;
                  font-weight: 600;
                  color: #111827;
                  margin: 0 0 4px 0;
                ">${cert.name}</h3>
                <p style="
                  color: #6b7280;
                  margin: 0 0 8px 0;
                  font-size: 13px;
                ">${cert.issuer}</p>
                <p style="
                  font-size: 12px;
                  color: #6b7280;
                  margin: 0;
                ">${formatDate(cert.date)}</p>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
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
