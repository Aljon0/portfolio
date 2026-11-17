export interface Profile {
  name: string;
  location: string;
  titles: string[];
  tagline: string;
  biography: string[];
}

export interface Highlight {
  title: string;
  description: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  startDate: string;
  endDate: string;
  highlights: string[];
}

export interface SkillCategory {
  id: string;
  label: string;
  items: string[];
}

export interface Project {
  id: string;
  title: string;
  category: string;
  image?: string;
  overview: string;
  problem?: string;
  solution?: string;
  features: string[];
  architecture?: string;
  stack: string[];
  contribution?: string;
  challenges?: string;
  repoUrl?: string;
  liveUrl?: string;
  videoUrl?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  year: number;
  verified: boolean;
  /** Only verified certifications are rendered. */
  image?: string;
}

export interface Testimonial {
  id: string;
  author: string;
  affiliation: string;
  photo?: string;
  quote: string;
}

export interface ContactLinks {
  email: string;
  /** Digits only, with country code, for wa.me links. */
  whatsappNumber?: string;
  phoneDisplay?: string;
  linkedIn?: string;
  resumeUrl?: string;
  github?: string;
}

export interface PortfolioContent {
  profile: Profile;
  highlights: Highlight[];
  experience: ExperienceItem[];
  skills: SkillCategory[];
  projects: Project[];
  certifications: Certification[];
  testimonials: Testimonial[];
  contact: ContactLinks;
}


export interface EducationItem {
  id: string;
  school: string;
  location: string;
  degree: string;
  period: string;
}