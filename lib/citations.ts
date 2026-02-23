/**
 * Citation format utilities for ThesisAI
 * Supports APA, MLA, and Chicago citation styles
 */

export interface Citation {
  id: string;
  title: string;
  authors: string[];
  year: number;
  url?: string;
  doi?: string;
  publicationTitle?: string;
  publisher?: string;
  volume?: number;
  issue?: number;
  pages?: string;
  accessDate?: string;
}

export interface CitationFormat {
  apa: string;
  mla: string;
  chicago: string;
}

export function formatAuthors(authors: string[]): string {
  if (authors.length === 0) return 'Unknown';
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return `${authors[0]} & ${authors[1]}`;
  return `${authors[0]} et al.`;
}

export function formatAPA(citation: Citation): string {
  const authors = formatAuthors(citation.authors);
  let apa = `${authors} (${citation.year}). ${citation.title}.`;

  if (citation.publicationTitle) {
    apa += ` *${citation.publicationTitle}*`;
  }

  if (citation.volume) {
    apa += `, ${citation.volume}`;
    if (citation.issue) apa += `(${citation.issue})`;
  }

  if (citation.pages) {
    apa += `, ${citation.pages}`;
  }

  if (citation.doi) {
    apa += ` https://doi.org/${citation.doi}`;
  } else if (citation.url) {
    apa += ` Retrieved from ${citation.url}`;
  }

  return apa;
}

export function formatMLA(citation: Citation): string {
  const authors = citation.authors.join(', and ');
  let mla = `${authors}. "${citation.title}."`;

  if (citation.publicationTitle) {
    mla += ` *${citation.publicationTitle}*`;
  }

  if (citation.volume) {
    mla += `, vol. ${citation.volume}`;
    if (citation.issue) mla += `, no. ${citation.issue}`;
  }

  mla += `, ${citation.year}`;

  if (citation.pages) {
    mla += `, pp. ${citation.pages}`;
  }

  if (citation.url) {
    mla += `, ${citation.url}`;
    if (citation.accessDate) {
      mla += `. Accessed ${citation.accessDate}`;
    }
  }

  return mla;
}

export function formatChicago(citation: Citation): string {
  const authors = citation.authors.join(', ');
  let chicago = `${authors}. "${citation.title}."`;

  if (citation.publicationTitle) {
    chicago += ` *${citation.publicationTitle}*`;
  }

  if (citation.volume) {
    chicago += ` ${citation.volume}`;
    if (citation.issue) chicago += `, no. ${citation.issue}`;
  }

  chicago += ` (${citation.year})`;

  if (citation.pages) {
    chicago += `: ${citation.pages}`;
  }

  if (citation.url) {
    chicago += `. Accessed ${citation.accessDate || new Date().toLocaleDateString()}. ${citation.url}`;
  }

  return chicago;
}

export function formatCitations(citation: Citation): CitationFormat {
  return {
    apa: formatAPA(citation),
    mla: formatMLA(citation),
    chicago: formatChicago(citation),
  };
}

export function generateCitationKey(citation: Citation): string {
  const firstAuthor = citation.authors[0]?.split(' ').pop() || 'Unknown';
  return `${firstAuthor}${citation.year}`.toLowerCase();
}
