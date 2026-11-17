import type { Project } from "@/types/content";

/** File extension of the screenshots in public/images/projects (named after each project id). */
const IMAGE_FILES: Readonly<Record<string, string>> = {
  "ai-workflow-automation-engine": "AIWorkflowAutomationEngine.png",
  "ed3c-double-seven": "3DGC.png",
  "private-knowledge-base-ai": "Advanced-Rag.png",
  "ai-eval-playground": "EvalPlayground.png",
  "ai-resume-builder": "AI-Resume Builder.webp",
  shopsmart: "Shopsmart.png",
};

const entries: Omit<Project, "image">[] = [
  {
    id: "ai-workflow-automation-engine",
    title: "AI Workflow Automation Engine",
    category: "AI Automation",
    overview: "Transforms natural language requests into executable workflows.",
    problem: "Manually selecting and configuring workflows for each request.",
    solution:
      "AI understands the user's intent, determines the suitable workflow and orchestrates its execution through n8n.",
    features: [
      "AI intent detection",
      "Workflow selection engine",
      "n8n workflow orchestration",
      "Document processing",
      "CSV analysis and reporting",
      "Execution monitoring and logs",
      "Analytics dashboard",
      "Webhook-based communication",
    ],
    architecture:
      "Event-driven architecture. A modular full-stack SaaS interface communicates via REST APIs and webhooks with a self-hosted n8n instance.",
    stack: [
      "Next.js (App Router)",
      "TypeScript",
      "Tailwind CSS",
      "Express.js",
      "Supabase (PostgreSQL/Storage)",
      "n8n",
      "Mistral AI",
      "Groq",
      "Docker",
    ],
    contribution:
      "Built the full-stack platform from UI to backend webhooks, integrated Mistral and Groq for intent parsing, and orchestrated the n8n pipelines.",
    liveUrl: "https://ai-automation-engine-eight.vercel.app/",
    videoUrl: "https://www.loom.com/share/38fa1871e948439cae7e500afaabe456",
  },
  {
    id: "ed3c-double-seven",
    title: "ED3C: Eternal Design (Double Seven)",
    category: "Full-Stack Web App / SaaS",
    overview:
      "A 3D customization SaaS for memorial design, such as gravestones and urns.",
    problem:
      "The business struggled with slow, manual design revisions, unpaid partial orders and confusing customer specifications.",
    solution:
      "A real-time, self-serve WebGL design platform for customers, with a Kanban order management system for admins.",
    features: [
      "Interactive 3D WebGL design tool (textures and elements)",
      "Kanban order management",
      "Real-time messaging hub",
      "Role-based access control",
      "Digital receipt validation for payments",
      "Recharts-powered analytics dashboard",
      "Template design manager",
    ],
    architecture:
      "A real-time 3D frontend connected to an Express API and a PostgreSQL database, with payment validation backed by Supabase storage.",
    stack: [
      "React.js",
      "Zustand",
      "Tailwind CSS",
      "React Three Fiber (Drei)",
      "Node.js",
      "Express.js",
      "Supabase (PostgreSQL, Auth, Storage)",
    ],
    contribution:
      "Built the entire end-to-end system: UI, 3D visualization, API and database. Migrated it from a Firebase (NoSQL) architecture to a relational PostgreSQL model.",
    challenges:
      "Enforced payment validation and moved from NoSQL to PostgreSQL so inventory, complex orders and users could be handled accurately.",
    liveUrl: "https://threedgc.onrender.com",
  },
  {
    id: "private-knowledge-base-ai",
    title: "Private Knowledge Base AI (Advanced RAG)",
    category: "AI Web App",
    overview:
      "Lets users upload PDFs and chat with their data through a RAG pipeline.",
    problem:
      "AI answers that hallucinate instead of relying on the user's own documents.",
    solution:
      "Answers are grounded in user-provided documents, with sources shown.",
    features: [
      "PDF upload and processing",
      "Real-time AI chat",
      "RAG pipeline",
      "Hybrid search (vector similarity and keyword)",
      "Source citations and highlighting",
      "Confidence scores",
    ],
    architecture:
      "A React frontend separated from an Express backend. Documents are chunked, embedded with Mistral AI and stored in a vector database for similarity search.",
    stack: [
      "Next.js",
      "Tailwind CSS",
      "Express.js",
      "Supabase (PostgreSQL + pgvector)",
      "Mistral AI (embeddings and generation)",
    ],
    contribution:
      "Full-stack development: the pgvector database schema, the chunking and embedding pipeline, and the chat UI that displays citations.",
    liveUrl: "https://advanced-rag.vercel.app/dashboard",
  },
  {
    id: "ai-eval-playground",
    title: "AI Systems Evaluation Playground",
    category: "AI Web App",
    overview:
      "An evaluation platform for comparing LLM responses in real time. It explores AI system behavior, prompt effectiveness and model performance.",
    features: [
      "Multi-model concurrent execution",
      "Side-by-side comparison",
      "Latency tracking",
      "Token usage estimation",
      "Experiment saving",
      "Response ranking system",
    ],
    architecture:
      "A multi-model API orchestrator backend feeding a responsive SaaS UI.",
    stack: [
      "Next.js",
      "Tailwind CSS",
      "Express.js",
      "Supabase (PostgreSQL)",
      "Mistral AI",
      "Groq",
    ],
    contribution:
      "Designed the evaluation metrics UI, integrated multiple LLM provider APIs concurrently and built the experiment storage schema.",
    liveUrl: "https://ai-eval-playground.vercel.app/",
  },
  {
    id: "ai-resume-builder",
    title: "AI-Resume Builder",
    category: "Web App",
    overview:
      "Streamlines resume creation by using LLMs to suggest relevant skills based on job titles.",
    features: [
      "AI-generated skill suggestions",
      "Customizable templates",
      "PDF export",
      "Save and load resumes",
    ],
    stack: [
      "React.js",
      "Tailwind CSS",
      "Express.js",
      "Mistral AI",
      "Firebase (Firestore, Auth)",
    ],
    liveUrl: "https://ai-rb-haee.onrender.com",
  },
  {
    id: "shopsmart",
    title: "E-Commerce (Shopsmart)",
    category: "Web App",
    overview: "A modern e-commerce platform that avoids heavy CMS tools.",
    features: [
      "API-based product catalog",
      "Add-to-cart and quantity management",
      "Secure checkout",
      "Order confirmation screens",
    ],
    stack: ["React.js", "Tailwind CSS", "Firebase (Auth/Tracking)", "Stripe API"],
    liveUrl: "https://e-commerce-gkjf.onrender.com",
  },
];

export const projects: Project[] = entries.map((entry) => {
  const file = IMAGE_FILES[entry.id];
  return { ...entry, image: file ? encodeURI(`/projects/${file}`) : undefined };
});