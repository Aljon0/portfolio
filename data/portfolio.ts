import type {
    Certification,
    ContactLinks,
    EducationItem,
    ExperienceItem,
    Highlight,
    Profile,
    SkillCategory,
    Testimonial,
  } from "@/types/content";
  
  export const profile: Profile = {
    name: "Al-jon Santiago",
    location: "General Trias, Cavite, Philippines",
    titles: ["Full Stack AI Developer", "Full-Stack Developer & AI Engineer"],
    tagline:
      "Building AI-powered web applications, SaaS platforms, workflow automation systems, and modern full-stack experiences.",
      biography: [
        "I'm a Full-Stack Developer with a strong focus on building AI-powered applications and modern web platforms. I specialize in creating responsive, scalable products using React, Next.js, TypeScript, Node.js and various backend services.",
        "My recent work highlights a transition toward AI-driven products, including intelligent assistants, automation tools and data-aware applications.",
      ],
  };
  
  export const highlights: Highlight[] = [
    {
      title: "Product-first mindset",
      description:
        "I prioritize system behavior, clear feature definitions and actual business value over complex, unnecessary tooling.",
    },
    {
      title: "Full-cycle development",
      description:
        "I'm comfortable building end to end, from the UI down to the API and database layers.",
    },
    {
      title: "AI-driven products",
      description:
        "My recent work centers on intelligent assistants, automation tools (n8n, Make.com) and data-aware applications (RAG, pgvector).",
    },
  ];
  
  export const experience: ExperienceItem[] = [
    {
      id: "freelance",
      role: "Freelance Full Stack Developer",
      organization: "Independent client work · Remote",
      startDate: "Jul 2025",
      endDate: "Sep 2025",
      highlights: [
        "Delivered AI-integrated web applications for international clients.",
        "Built SaaS features including authentication, subscriptions and automated emails.",
        "Designed custom automation workflows using Make.com and n8n.",
      ],
    },
    {
      id: "seiwa-kaiun",
      role: "Backend Developer Intern",
      organization: "Seiwa Kaiun Phils.",
      startDate: "Feb 2025",
      endDate: "May 2025",
      highlights: [
        "Developed backend functionalities for Performance Evaluation and Invoice Management Systems.",
        "Conducted system testing, bug fixing and data validation.",
        "Collaborated with the MIS team to implement system feedback.",
      ],
    },
  ];
  
  export const skillCategories: SkillCategory[] = [
    {
      id: "frontend",
      label: "Frontend Development",
      items: [
        "Next.js (App Router)",
        "React.js",
        "TypeScript",
        "JavaScript",
        "Tailwind CSS",
        "Vite",
        "React Three Fiber (WebGL 3D)",
      ],
    },
    {
      id: "backend",
      label: "Backend Development",
      items: ["Node.js", "Express.js", "Python (FastAPI)", "Next.js API Routes"],
    },
    {
      id: "data",
      label: "Databases & Data",
      items: [
        "PostgreSQL (via Prisma)",
        "Supabase",
        "Firebase (Firestore, Realtime DB, Auth, Storage)",
      ],
    },
    {
      id: "ai",
      label: "AI & Machine Learning",
      items: [
        "Mistral AI",
        "OpenAI",
        "Groq",
        "Hugging Face Inference API",
        "LangChain",
        "RAG concepts",
        "AI Agents",
        "Vector embeddings (pgvector)",
      ],
    },
    {
      id: "automation",
      label: "Automation & Low-Code",
      items: ["n8n (self-hosted)", "Make.com", "Zapier", "Lovable AI", "Replit"],
    },
    {
      id: "infrastructure",
      label: "Infrastructure & Tools",
      items: ["Docker", "Stripe", "Webhooks", "REST APIs"],
    },
  ];
  
  export const certifications: Certification[] = [
    {
      id: "scrimba-mistral",
      title: "Intro to Mistral AI",
      issuer: "Scrimba",
      year: 2025,
      verified: true,
      image: "/certificates/mistral-cert.png",
    },
  ];
  
  export const education: EducationItem[] = [
    {
      id: "cvsu-ccat",
      school: "Cavite State University – CCAT Campus",
      location: "Rosario, Cavite",
      degree: "Bachelor of Science in Information Technology",
      period: "A.Y. 2021 – 2025",
    },
  ];
  
  export const testimonials: Testimonial[] = [
    {
      id: "magsaysay",
      photo: "/testimonials/DoubleSeven.png",
      author: "Ethel Magsaysay",
      affiliation: "Double Seven Lapida",
      quote:
        "Aljon is diligent and hardworking. Another good thing about him is that he knows how to listen. Whenever I have requests for revisions, he listens carefully and makes sure to meet expectations.",
    },
    {
      id: "reyes",
      photo: "/testimonials/Reyes.jpg",
      author: "Rodante R. Reyes",
      affiliation: "IT Manager, Seiwa Kaiun",
      quote:
        "Aljon has constantly shown that he is a reliable employee by showing up for work each day prepared and with a positive attitude.",
    },
    {
      id: "san-jose",
      photo: "/images/clients/glaiza.jpg",
      author: "Glaiza Lei San Jose",
      affiliation: "CVSU - CCAT Campus",
      quote:
        "Aljon is a trusted and proficient backend developer who regularly produces clear, effective code and finds solutions to issues. He is a valuable member of the team because of his cooperative demeanor.",
    },
  ];
  
  export const contact: ContactLinks = {
    email: "aljons702@gmail.com",
    whatsappNumber: "639069208512",
    phoneDisplay: "+63 906 920 8512",
    linkedIn: "https://www.linkedin.com/in/santiago-al-jon-b-31a478281/",
    github: "https://github.com/Aljon0",
    resumeUrl: "/resume/CV.pdf",
  };