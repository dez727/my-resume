// Structured resume content for context injection.
// Organized by section so it maps cleanly to the site and could be
// swapped for a retrieval layer if the corpus ever grows.

export const resumeData = {
  name: "Desmond Adongo",
  title: "AI Consultant & UW System Regent",
  summary:
    "I bridge technology and people — whether that's helping small businesses harness AI to work smarter, " +
    "shaping higher education policy for 160,000+ students across Wisconsin, or building systems that " +
    "actually solve problems. Born in Ghana, driven by the belief that technology should leave the world " +
    "better than we found it.",
  contact: {
    email: "addez2@outlook.com",
    linkedin: "https://www.linkedin.com/in/desmondadongo",
  },

  experience: [
    {
      role: "Small Business AI Consultant",
      company: "Universities of Wisconsin",
      location: "Oshkosh, WI",
      dates: "Nov 2025 – Present",
      bullets: [
        "Conduct discovery sessions with clients to analyze workflows and identify opportunities for AI-driven efficiencies",
        "Translate business needs into practical AI use cases across content creation, customer support, scheduling, and task automation",
        "Guide clients through AI adoption from needs analysis and tool selection to implementation and integration",
        "Document processes and use cases to support consistent service delivery",
      ],
    },
    {
      role: "Regent (Appointed Public Official)",
      company: "Universities of Wisconsin System Board of Regents",
      location: "Madison, WI",
      dates: "May 2024 – Present",
      bullets: [
        "Appointed by the Governor to an 18-member governing body overseeing policy and strategy for Wisconsin's higher education system",
        "Participate in monthly board and committee sessions evaluating policies on tuition, academic programs, and institutional governance",
        "Provide fiduciary oversight for multi-million dollar operating and capital budgets",
        "Participate in hiring and evaluation of system-level executives including UW System President and Chancellors",
        "Represent Board interests to legislators, government officials, and business leaders",
      ],
    },
    {
      role: "IT Support AI Intern",
      company: "University of Wisconsin Oshkosh",
      location: "Oshkosh, WI",
      dates: "Jun 2025 – Aug 2025",
      bullets: [
        "Analyzed 200+ service desk tickets and virtual agent logs to identify pain points and enhance bot responses",
        "Drafted and refined 50+ chatbot messages based on staff and user feedback",
        "Configured Jira Service Management with Atlassian Intelligence, creating AI intents and automation flows",
        "Built automation workflows expanding 50+ AI intent coverage and reducing manual escalations",
      ],
    },
    {
      role: "Student Researcher",
      company: "University of Wisconsin Oshkosh",
      location: "Oshkosh, WI",
      dates: "Jun 2024 – Aug 2024",
      bullets: [
        "Orchestrated ethnographic study across 20+ field sites using ArcGIS Survey123 for geospatial data collection",
        "Designed data collection framework with 25 targeted interview questions",
        "Conducted and transcribed 60+ interviews, applying qualitative coding to synthesize findings",
      ],
    },
    {
      role: "L&D Operations Coordinator & Trainer",
      company: "Foot Locker Inc",
      location: "Oshkosh, WI",
      dates: "May 2015 – Mar 2023",
      bullets: [
        "Standardized L&D policies impacting 200+ employees, improving consistency and compliance",
        "Redesigned sales and communications enablement for 300+ agents",
        "Built 25+ learning programs using ADDIE and Backward Design methodologies",
        "Implemented automated learner-feedback collection using Power Automate, Forms, Outlook, and Excel",
        "Managed satellite contact center training partnership supporting 50+ virtual sessions",
      ],
    },
  ],

  education: {
    degree: "Bachelor of Science in Interactive Web Management",
    school: "University of Wisconsin Oshkosh",
    expected: "May 2026",
    location: "Oshkosh, WI",
    credentials: [
      "Minor: Information Systems",
      "Certificate: Digital Marketing",
      "Certificate: Web Design",
    ],
  },

  skills: {
    "Digital Marketing": [
      "Google Analytics 4",
      "Looker Studio",
      "HubSpot CRM",
      "Canva",
      "WordPress",
      "SEO / SEM",
      "Email Marketing",
      "Social Media Management",
      "Campaign Planning",
    ],
    "AI & Automation": [
      "Context Engineering",
      "Prompt Design",
      "System Prompts",
      "Function Calling",
      "LLM Evaluation",
      "n8n",
      "Zapier",
      "APIs",
      "Webhooks",
      "OAuth",
    ],
    "Programming & Data": [
      "Python",
      "SQL",
      "Java",
      "JavaScript",
      "HTML",
      "CSS",
      "Text Extraction",
      "Data Analysis",
    ],
    "Product & Systems": [
      "Requirements Elicitation",
      "User Stories",
      "UML Diagrams",
      "Business Process Analysis",
      "Agile",
    ],
    Platforms: [
      "Jira",
      "Confluence",
      "Microsoft 365",
      "Power Automate",
      "HubSpot",
      "ArcGIS",
      "Google Analytics 4",
    ],
    "IT & Infrastructure": [
      "Docker",
      "Ubuntu Server",
      "Proxmox",
      "Self-Hosting",
      "Networking",
      "Windows",
    ],
    Certifications: [
      "HubSpot Inbound",
      "Agile Project Management",
      "Google Analytics 4",
      "Google Looker Studio (In Progress)",
      "HubSpot Digital Marketing (In Progress)",
    ],
  },

  projects: [
    {
      name: "Digital Marketing Portfolio — Active Spring 2026",
      description:
        "Currently executing three applied marketing projects at UW Oshkosh: a full social media campaign for a real client organization covering strategy, content creation, visual storytelling, and performance measurement (AMP 440); a Digital Marketing Simternship covering paid search, SEO, landing page optimization, and email campaigns (MKT 363); and a website and social media audit with GA4 and Looker Studio dashboards (MKT 428). Expected completion May 2026.",
      tech: [
        "Social Media Strategy",
        "Content Creation",
        "SEO",
        "Email Marketing",
        "Google Analytics 4",
        "Looker Studio",
        "Campaign Management",
      ],
    },
    {
      name: "ITSM Virtual Agent Modernization",
      description:
        "Designed AI intents and automation flows for Jira Service Management. Achieved 82% resolution rate, 55% AI-resolved, and 5.0 CSAT over first 4 months in production.",
      tech: ["Jira Service Management", "Atlassian Intelligence", "ITSM"],
    },
    {
      name: "Self-Hosted Homelab Infrastructure",
      description:
        "Built virtualized environment using Proxmox and Docker with 6 VMs and 6 containers. Automated workflows with n8n and implemented secure remote access via Cloudflare tunneling.",
      tech: ["Proxmox VE", "Docker", "n8n", "Cloudflare"],
    },
    {
      name: "AI Workflow Automation for Small Businesses",
      description:
        "Conducted discovery sessions and mapped workflows to deliver AI solutions for content creation, customer support, and task automation with full implementation documentation.",
      tech: ["n8n", "Zapier", "APIs", "LLM Prompting"],
    },
    {
      name: "Healthcare Data Regression Modeling",
      description:
        "Developed predictive regression model analyzing healthcare operational metrics using feature selection techniques to isolate high-impact variables.",
      tech: ["Python", "Scikit-learn", "Regression Analysis"],
    },
  ],
};
