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
    tempContainer.style.fontFamily = '"Times New Roman", Times, serif';
    
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

// Generate HTML content optimized for PDF generation with academic styling
const generatePrintableResumeHTML = (data: ResumeData): string => {
  const formatDate = (date: string) => {
    if (!date) return '';
    const [year, month] = date.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  return `
    <div style="
      max-width: 794px;
      margin: 0;
      padding: 40px;
      background: white;
      color: #000000;
      font-family: 'Times New Roman', Times, serif;
      font-size: 12px;
      line-height: 1.4;
    ">
      <!-- Header -->
      <div style="
        text-align: center;
        border-bottom: 2px solid #000000;
        padding-bottom: 20px;
        margin-bottom: 30px;
      ">
        <h1 style="
          font-size: 24px;
          font-weight: bold;
          color: #000000;
          margin: 0 0 10px 0;
          letter-spacing: 1px;
          text-transform: uppercase;
        ">${data.personalInfo.fullName}</h1>
        <div style="
          font-size: 11px;
          color: #333333;
          line-height: 1.3;
        ">
          ${[
            data.personalInfo.email,
            data.personalInfo.phone,
            data.personalInfo.location,
            data.personalInfo.linkedin ? 'LinkedIn Profile' : '',
            data.personalInfo.website ? 'Personal Website' : ''
          ].filter(Boolean).join(' • ')}
        </div>
      </div>

      ${data.personalInfo.summary ? `
        <!-- Summary -->
        <div style="margin-bottom: 25px;">
          <h2 style="
            font-size: 14px;
            font-weight: bold;
            color: #000000;
            margin: 0 0 12px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid #000000;
            padding-bottom: 3px;
          ">Professional Summary</h2>
          <p style="
            color: #000000;
            font-size: 12px;
            line-height: 1.4;
            margin: 0;
            text-align: justify;
          ">${data.personalInfo.summary}</p>
        </div>
      ` : ''}

      ${data.experiences.length > 0 ? `
        <!-- Experience -->
        <div style="margin-bottom: 25px;">
          <h2 style="
            font-size: 14px;
            font-weight: bold;
            color: #000000;
            margin: 0 0 15px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid #000000;
            padding-bottom: 3px;
          ">Professional Experience</h2>
          ${data.experiences.map(exp => `
            <div style="margin-bottom: 20px;">
              <div style="margin-bottom: 8px;">
                <div style="
                  display: flex;
                  justify-content: space-between;
                  align-items: baseline;
                ">
                  <h3 style="
                    font-size: 13px;
                    font-weight: bold;
                    color: #000000;
                    margin: 0;
                  ">${exp.position}</h3>
                  <span style="
                    color: #000000;
                    font-size: 11px;
                    font-style: italic;
                  ">${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                </div>
                <p style="
                  font-size: 12px;
                  color: #000000;
                  margin: 2px 0;
                  font-style: italic;
                ">${exp.company}${exp.location ? `, ${exp.location}` : ''}</p>
              </div>
              ${exp.description ? `
                <p style="
                  color: #000000;
                  margin: 0 0 8px 0;
                  line-height: 1.4;
                  font-size: 11px;
                  text-align: justify;
                ">${exp.description}</p>
              ` : ''}
              ${exp.achievements.filter(a => a.trim()).length > 0 ? `
                <ul style="
                  color: #000000;
                  margin: 0;
                  padding-left: 15px;
                  line-height: 1.3;
                  font-size: 11px;
                ">
                  ${exp.achievements.filter(a => a.trim()).map(achievement => `
                    <li style="margin-bottom: 3px;">${achievement}</li>
                  `).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.educations.length > 0 ? `
        <!-- Education -->
        <div style="margin-bottom: 25px;">
          <h2 style="
            font-size: 14px;
            font-weight: bold;
            color: #000000;
            margin: 0 0 15px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid #000000;
            padding-bottom: 3px;
          ">Education</h2>
          ${data.educations.map(edu => `
            <div style="margin-bottom: 15px;">
              <div style="
                display: flex;
                justify-content: space-between;
                align-items: baseline;
                margin-bottom: 5px;
              ">
                <h3 style="
                  font-size: 13px;
                  font-weight: bold;
                  color: #000000;
                  margin: 0;
                ">${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</h3>
                <span style="
                  color: #000000;
                  font-size: 11px;
                  font-style: italic;
                ">${formatDate(edu.startDate)} - ${edu.current ? 'Present' : formatDate(edu.endDate)}</span>
              </div>
              <p style="
                font-size: 12px;
                color: #000000;
                margin: 0;
                font-style: italic;
              ">${edu.institution}${edu.location ? `, ${edu.location}` : ''}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</p>
              ${edu.achievements.filter(a => a.trim()).length > 0 ? `
                <ul style="
                  color: #000000;
                  margin: 5px 0 0 0;
                  padding-left: 15px;
                  line-height: 1.3;
                  font-size: 11px;
                ">
                  ${edu.achievements.filter(a => a.trim()).map(achievement => `
                    <li style="margin-bottom: 2px;">${achievement}</li>
                  `).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.skills.length > 0 ? `
        <!-- Skills -->
        <div style="margin-bottom: 25px;">
          <h2 style="
            font-size: 14px;
            font-weight: bold;
            color: #000000;
            margin: 0 0 15px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid #000000;
            padding-bottom: 3px;
          ">Skills</h2>
          <div>
            ${Object.entries(data.skills.reduce((acc, skill) => {
              const category = skill.category || 'Other';
              if (!acc[category]) acc[category] = [];
              acc[category].push(skill);
              return acc;
            }, {} as Record<string, typeof data.skills>)).map(([category, categorySkills]) => `
              <div style="margin-bottom: 12px;">
                <h3 style="
                  font-size: 12px;
                  font-weight: bold;
                  color: #000000;
                  margin: 0 0 6px 0;
                ">${category}:</h3>
                <p style="
                  color: #000000;
                  font-size: 11px;
                  margin: 0;
                  line-height: 1.3;
                ">${categorySkills.map(skill => skill.name).join(', ')}</p>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${data.projects.length > 0 ? `
        <!-- Projects -->
        <div style="margin-bottom: 25px;">
          <h2 style="
            font-size: 14px;
            font-weight: bold;
            color: #000000;
            margin: 0 0 15px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid #000000;
            padding-bottom: 3px;
          ">Projects</h2>
          ${data.projects.map(project => `
            <div style="margin-bottom: 15px;">
              <h3 style="
                font-size: 13px;
                font-weight: bold;
                color: #000000;
                margin: 0 0 5px 0;
              ">${project.name}${project.url ? ' (Available Online)' : ''}</h3>
              <p style="
                color: #000000;
                margin: 0 0 5px 0;
                line-height: 1.4;
                font-size: 11px;
                text-align: justify;
              ">${project.description}</p>
              ${project.technologies.length > 0 ? `
                <p style="
                  color: #000000;
                  font-size: 11px;
                  margin: 0;
                  font-style: italic;
                "><strong>Technologies:</strong> ${project.technologies.join(', ')}</p>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.certifications.length > 0 ? `
        <!-- Certifications -->
        <div style="margin-bottom: 25px;">
          <h2 style="
            font-size: 14px;
            font-weight: bold;
            color: #000000;
            margin: 0 0 15px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid #000000;
            padding-bottom: 3px;
          ">Certifications</h2>
          ${data.certifications.map(cert => `
            <div style="margin-bottom: 10px;">
              <h3 style="
                font-size: 12px;
                font-weight: bold;
                color: #000000;
                margin: 0 0 2px 0;
              ">${cert.name}</h3>
              <p style="
                color: #000000;
                margin: 0;
                font-size: 11px;
                font-style: italic;
              ">${cert.issuer} | ${formatDate(cert.date)}</p>
            </div>
          `).join('')}
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
