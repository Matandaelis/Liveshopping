export interface ThesisTemplate {
  id: string;
  name: string;
  university: string;
  country: string;
  description: string;
  fontFamily: string;
  fontSize: {
    title: number;
    heading: number;
    body: number;
  };
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  lineHeight: number;
  pageSize: 'A4' | 'Letter';
  spacing: {
    paragraphSpacing: number;
    headingSpacing: number;
  };
  requirements: string[];
}

export const KENYAN_UNIVERSITIES: ThesisTemplate[] = [
  {
    id: 'ku-thesis',
    name: 'University of Nairobi Standard',
    university: 'University of Nairobi',
    country: 'Kenya',
    description: 'Official thesis template for University of Nairobi graduate programs',
    fontFamily: 'Times New Roman, Georgia',
    fontSize: {
      title: 18,
      heading: 14,
      body: 12,
    },
    margins: {
      top: 1.25,
      bottom: 1,
      left: 1.5,
      right: 1,
    },
    lineHeight: 1.5,
    pageSize: 'A4',
    spacing: {
      paragraphSpacing: 0.5,
      headingSpacing: 0.25,
    },
    requirements: [
      'Title page with university seal',
      'Table of contents',
      'List of figures and tables',
      'Double-spaced body text',
      'Arabic numerals for page numbers (bottom center)',
      'Bibliography in Harvard format',
      'Appendices after bibliography',
    ],
  },
  {
    id: 'kemu-thesis',
    name: 'KEMRI-UONBI Medical Format',
    university: 'KEMRI/Kenya Medical University',
    country: 'Kenya',
    description: 'Medical and health sciences thesis template for KEMU and research institutions',
    fontFamily: 'Calibri, Arial',
    fontSize: {
      title: 16,
      heading: 13,
      body: 11,
    },
    margins: {
      top: 1,
      bottom: 1,
      left: 1.25,
      right: 1.25,
    },
    lineHeight: 1.5,
    pageSize: 'A4',
    spacing: {
      paragraphSpacing: 0.5,
      headingSpacing: 0.25,
    },
    requirements: [
      'Abstract (150-250 words)',
      'Introduction with literature review',
      'Methodology section',
      'Results and Discussion',
      'Conclusions and recommendations',
      'References (min 50 for Masters)',
      'Ethical approval documentation',
      'ICMJE format for medical citations',
    ],
  },
  {
    id: 'mku-thesis',
    name: 'Mount Kenya University Format',
    university: 'Mount Kenya University',
    country: 'Kenya',
    description: 'Graduate thesis template for Mount Kenya University programs',
    fontFamily: 'Times New Roman',
    fontSize: {
      title: 16,
      heading: 13,
      body: 12,
    },
    margins: {
      top: 1.25,
      bottom: 1.25,
      left: 1.5,
      right: 1,
    },
    lineHeight: 1.5,
    pageSize: 'A4',
    spacing: {
      paragraphSpacing: 0.5,
      headingSpacing: 0.25,
    },
    requirements: [
      'Declaration of originality',
      'Dedication page (optional)',
      'Acknowledgements',
      'Executive summary',
      'Chapter structure: Intro, Lit Review, Methods, Results, Discussion, Conclusion',
      'Chicago style citations',
      'Appendices with supporting data',
    ],
  },
  {
    id: 'general-academic',
    name: 'General Academic Format',
    university: 'General / Other Kenya Universities',
    country: 'Kenya',
    description: 'Flexible template compatible with most Kenyan universities',
    fontFamily: 'Times New Roman, Calibri',
    fontSize: {
      title: 16,
      heading: 13,
      body: 12,
    },
    margins: {
      top: 1,
      bottom: 1,
      left: 1.25,
      right: 1,
    },
    lineHeight: 1.5,
    pageSize: 'A4',
    spacing: {
      paragraphSpacing: 0.5,
      headingSpacing: 0.25,
    },
    requirements: [
      'Title page',
      'Table of contents',
      'Introduction',
      'Main chapters',
      'Conclusion',
      'References',
      'Appendices (if needed)',
      'Consistent formatting throughout',
    ],
  },
];

export function getTemplateById(id: string): ThesisTemplate | undefined {
  return KENYAN_UNIVERSITIES.find((t) => t.id === id);
}

export function getTemplateByUniversity(university: string): ThesisTemplate | undefined {
  return KENYAN_UNIVERSITIES.find((t) => t.name.toLowerCase().includes(university.toLowerCase()));
}

export function formatTemplateCSS(template: ThesisTemplate): string {
  return `
    body {
      font-family: ${template.fontFamily};
      font-size: ${template.fontSize.body}px;
      line-height: ${template.lineHeight};
      margin-top: ${template.margins.top}in;
      margin-bottom: ${template.margins.bottom}in;
      margin-left: ${template.margins.left}in;
      margin-right: ${template.margins.right}in;
    }
    
    h1 {
      font-size: ${template.fontSize.title}px;
      margin-bottom: ${template.spacing.headingSpacing}in;
    }
    
    h2, h3, h4 {
      font-size: ${template.fontSize.heading}px;
      margin-bottom: ${template.spacing.headingSpacing}in;
    }
    
    p {
      margin-bottom: ${template.spacing.paragraphSpacing}in;
    }
  `;
}
