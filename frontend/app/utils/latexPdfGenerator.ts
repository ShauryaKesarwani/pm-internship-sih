// LaTeX-based PDF Generation utility for resume
import { ResumeData } from './resumePdfGenerator';

// LaTeX template and generation functions for professional, structured resumes
export const generateLatexResume = (data: ResumeData): string => {
  const formatDate = (date: string) => {
    if (!date) return '';
    const [year, month] = date.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const escapeLatex = (text: string): string => {
    return text
      .replace(/\\/g, '\\textbackslash{}')
      .replace(/\{/g, '\\{')
      .replace(/\}/g, '\\}')
      .replace(/\$/g, '\\$')
      .replace(/&/g, '\\&')
      .replace(/%/g, '\\%')
      .replace(/#/g, '\\#')
      .replace(/\^/g, '\\textasciicircum{}')
      .replace(/_/g, '\\_')
      .replace(/~/g, '\\textasciitilde{}');
  };

  const generateSkillsSection = () => {
    if (data.skills.length === 0) return '';
    
    const skillsByCategory = data.skills.reduce((acc, skill) => {
      const category = skill.category || 'Technical Skills';
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill);
      return acc;
    }, {} as Record<string, typeof data.skills>);

    const skillRows = Object.entries(skillsByCategory).map(([category, skills]) => {
      const skillsWithLevels = skills.map(s => {
        const levelIndicator = s.level === 'Expert' ? '\\textbf{' + escapeLatex(s.name) + '}' : escapeLatex(s.name);
        return levelIndicator;
      }).join(', ');
      return `\\textbf{${escapeLatex(category)}:} & ${skillsWithLevels} \\\\[0.5ex]`;
    }).join('\n');

    return `
\\section{TECHNICAL SKILLS}
\\begin{tabularx}{\\textwidth}{@{} l X @{}}
${skillRows}
\\end{tabularx}
\\vspace{0.2em}
`;
  };

  const generateExperienceSection = () => {
    if (data.experiences.length === 0) return '';

    const experiences = data.experiences.map(exp => {
      const achievements = exp.achievements
        .filter(a => a.trim())
        .map(achievement => `\\item ${escapeLatex(achievement)}`)
        .join('\n');

      const dateRange = `${formatDate(exp.startDate)} -- ${exp.current ? 'Present' : formatDate(exp.endDate)}`;
      
      return `
\\subsection{${escapeLatex(exp.position)}}
\\textbf{${escapeLatex(exp.company)}} \\hfill \\textbf{${dateRange}}\\\\
${exp.location ? `\\textit{${escapeLatex(exp.location)}}\\\\[0.3em]` : ''}
${exp.description ? `${escapeLatex(exp.description)}\\\\[0.3em]` : ''}
${achievements ? `\\begin{itemize}[leftmargin=0.5cm, itemsep=0.1em]\n${achievements}\n\\end{itemize}` : ''}
\\vspace{0.3em}
`;
    }).join('');

    return `
\\section{PROFESSIONAL EXPERIENCE}
${experiences}
`;
  };

  const generateEducationSection = () => {
    if (data.educations.length === 0) return '';

    const educations = data.educations.map(edu => {
      const degree = edu.field ? `${escapeLatex(edu.degree)} in ${escapeLatex(edu.field)}` : escapeLatex(edu.degree);
      const gpaText = edu.gpa ? ` \\textbf{(GPA: ${edu.gpa})}` : '';
      const dateRange = `${formatDate(edu.startDate)} -- ${edu.current ? 'Present' : formatDate(edu.endDate)}`;
      
      return `
\\subsection{${degree}${gpaText}}
\\textbf{${escapeLatex(edu.institution)}} \\hfill \\textbf{${dateRange}}\\\\
${edu.location ? `\\textit{${escapeLatex(edu.location)}}\\\\[0.3em]` : ''}
\\vspace{0.3em}
`;
    }).join('');

    return `
\\section{EDUCATION}
${educations}
`;
  };

  const generateProjectsSection = () => {
    if (data.projects.length === 0) return '';

    const projects = data.projects.map(project => {
      const technologies = project.technologies.length > 0 
        ? `\\\\\\textbf{Technologies:} ${project.technologies.map(tech => escapeLatex(tech)).join(', ')}`
        : '';
      
      const urlText = project.url ? `\\\\\\textbf{Link:} \\href{${project.url}}{${project.url}}` : '';
      const dateRange = project.startDate && project.endDate ? ` \\hfill \\textbf{${formatDate(project.startDate)} -- ${formatDate(project.endDate)}}` : '';

      return `
\\subsection{${escapeLatex(project.name)}${dateRange}}
${escapeLatex(project.description)}${technologies}${urlText}
\\vspace{0.3em}
`;
    }).join('');

    return `
\\section{PROJECTS}
${projects}
`;
  };

  const generateCertificationsSection = () => {
    if (data.certifications.length === 0) return '';

    const certifications = data.certifications.map(cert => {
      const urlText = cert.url ? ` -- \\href{${cert.url}}{View Certificate}` : '';
      return `
\\subsection{${escapeLatex(cert.name)}}
\\textbf{${escapeLatex(cert.issuer)}} \\hfill \\textbf{${formatDate(cert.date)}}${urlText}
\\vspace{0.3em}
`;
    }).join('');

    return `
\\section{CERTIFICATIONS}
${certifications}
`;
  };

  // Generate contact information in a more professional format
  const contactInfo = [];
  if (data.personalInfo.email) contactInfo.push(`\\href{mailto:${data.personalInfo.email}}{${escapeLatex(data.personalInfo.email)}}`);
  if (data.personalInfo.phone) contactInfo.push(`${escapeLatex(data.personalInfo.phone)}`);
  if (data.personalInfo.linkedin) contactInfo.push(`\\href{${data.personalInfo.linkedin}}{LinkedIn Profile}`);
  if (data.personalInfo.website) contactInfo.push(`\\href{${data.personalInfo.website}}{Portfolio}`);

  // Professional LaTeX document with formal structure
  return `\\documentclass[11pt,a4paper,sans]{moderncv}

% Modern CV theme
\\moderncvstyle{classic}
\\moderncvcolor{blue}

% Character encoding
\\usepackage[utf8]{inputenc}

% Adjust page margins
\\usepackage[scale=0.85,top=1cm,bottom=1cm]{geometry}

% For tables and better formatting
\\usepackage{tabularx}
\\usepackage{enumitem}
\\usepackage{multicol}

% Personal data
\\name{${escapeLatex(data.personalInfo.fullName.split(' ')[0] || '')}}{${escapeLatex(data.personalInfo.fullName.split(' ').slice(1).join(' ') || '')}}
${data.personalInfo.email ? `\\email{${data.personalInfo.email}}` : ''}
${data.personalInfo.phone ? `\\phone[mobile]{${escapeLatex(data.personalInfo.phone)}}` : ''}
${data.personalInfo.location ? `\\address{${escapeLatex(data.personalInfo.location)}}` : ''}
${data.personalInfo.linkedin ? `\\social[linkedin]{${data.personalInfo.linkedin.replace('https://www.linkedin.com/in/', '').replace('https://linkedin.com/in/', '')}}` : ''}
${data.personalInfo.website ? `\\homepage{${data.personalInfo.website}}` : ''}

\\begin{document}

\\makecvtitle

${data.personalInfo.summary ? `
\\section{PROFESSIONAL SUMMARY}
\\cvitem{}{${escapeLatex(data.personalInfo.summary)}}
\\vspace{0.2em}
` : ''}

${generateEducationSection()}

${generateSkillsSection()}

${generateExperienceSection()}

${generateProjectsSection()}

${generateCertificationsSection()}

\\end{document}`;
};

// Function to compile LaTeX to PDF using an online service
export const compileLatexToPDF = async (latexCode: string, filename: string): Promise<void> => {
  try {
    // Use LaTeX.Online API for compilation
    const response = await fetch('https://latex.ytotech.com/builds/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        compiler: 'pdflatex',
        resources: [
          {
            file: 'main.tex',
            content: latexCode
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('LaTeX compilation failed');
    }

    // Get the PDF blob
    const pdfBlob = await response.blob();
    
    // Download the compiled PDF
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

  } catch (error) {
    console.error('LaTeX compilation error:', error);
    
    // Fallback: Download LaTeX source files if compilation fails
    console.log('Falling back to LaTeX source download...');
    
    const blob = new Blob([latexCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.tex`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    throw new Error('LaTeX compilation service unavailable. LaTeX source file downloaded instead. Please compile manually with: pdflatex ' + filename + '.tex');
  }
};

// Main function to generate LaTeX-based resume PDF
export const generateLatexResumePDF = async (resumeData: ResumeData): Promise<void> => {
  try {
    const latexCode = generateLatexResume(resumeData);
    const filename = resumeData.personalInfo.fullName.replace(/[^a-zA-Z0-9]/g, '_') + '_Resume';
    
    await compileLatexToPDF(latexCode, filename);
  } catch (error) {
    console.error('Error generating LaTeX resume:', error);
    throw new Error('Failed to generate LaTeX resume. Please try again.');
  }
};