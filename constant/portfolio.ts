const calculateExperience = (startDate: Date): string => {
  const today = new Date();

  const years =
    today.getFullYear() -
    startDate.getFullYear() -
    (today.getMonth() < startDate.getMonth() ? 1 : 0);

  return `${years}+`;
};

export const personalInfo = {
  name: "Khoironi",
  fullName: "Muhammad Khoironi",
  title: "Full-Stack Developer",
  subtitle: "Building digital products that drive results",
  email: "muhkhoironi01@gmail.com",
  location: "Jakarta, Indonesia",
  avatar: "/avatar.png",
  resume: "https://drive.google.com/file/d/1U3qncYgGxw8G2GusUp2ts6A4QfbdrQfE/view?usp=sharing",
  availability: "available" as const,
  availabilityText: "Available for projects",
};

export const navLinks = [
  { id: 1, url: "#home", label: "Home" },
  { id: 2, url: "#about", label: "About" },
  { id: 3, url: "#skills", label: "Skills" },
  { id: 4, url: "#projects", label: "Projects" },
  { id: 5, url: "#services", label: "Services" },
  { id: 6, url: "#experience", label: "Experience" },
  { id: 7, url: "#testimonials", label: "Testimonials" },
  { id: 8, url: "#contact", label: "Contact" },
];

export const socialLinks = [
  { id: 1, name: "GitHub", url: "https://github.com/khoironi", icon: "github" },
  { id: 2, name: "LinkedIn", url: "https://linkedin.com/in/khoironi", icon: "linkedin" },
  { id: 3, name: "Twitter", url: "https://twitter.com/khoironi", icon: "twitter" },
  { id: 4, name: "Instagram", url: "https://instagram.com/khoironi", icon: "instagram" },
];

export const heroStats = [
  { id: 1, value: calculateExperience(new Date(2022, 9, 1)), label: "Years Experience" },
  // { id: 2, value: "50+", label: "Projects Completed" },
  // { id: 3, value: "30+", label: "Happy Clients" },
];

export const skills = [
  { name: "React", category: "frontend", level: 75 },
  { name: "Angular.js", category: "frontend", level: 75 },
  { name: "Next.js", category: "frontend", level: 70 },
  { name: "Java Spring Boot", category: "backend", level: 85 },
  { name: "Node.js", category: "backend", level: 65 },
  { name: "Go", category: "backend", level: 55 },
  { name: "PHP", category: "backend", level: 60 },
  { name: "Express", category: "backend", level: 80 },
  { name: "PostgreSQL", category: "backend", level: 85 },
  { name: "MongoDB", category: "backend", level: 80 },
  { name: "MySql", category: "backend", level: 80 },
  { name: "Redis", category: "backend", level: 80 },
  { name: "REST API", category: "backend", level: 90 },
  { name: "GraphQL", category: "backend", level: 80 },
  { name: "GCP", category: "devops", level: 70 },
  { name: "AWS", category: "devops", level: 65 }
];

export const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "A full-featured online store with payment integration, inventory management, and admin dashboard.",
    image: "/projects/ecommerce.jpg",
    tags: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
    liveUrl: "https://ecommerce-demo.com",
    GitHubUrl: "https://github.com/khoironi/ecommerce",
    category: "freelance",
    metrics: { value: "40%", label: "Revenue Increase" },
  },
  {
    id: 2,
    title: "SaaS Dashboard",
    description: "Analytics dashboard with real-time data visualization, team collaboration, and custom reporting.",
    image: "/projects/dashboard.jpg",
    tags: ["React", "D3.js", "Firebase", "Tailwind"],
    liveUrl: "https://saas-dashboard-demo.com",
    GitHubUrl: "https://github.com/khoironi/dashboard",
    category: "product",
    metrics: { value: "3x", label: "Faster Decisions" },
  },
  {
    id: 3,
    title: "Food Delivery App",
    description: "Mobile-first food ordering platform with real-time tracking and restaurant management.",
    image: "/projects/fooddelivery.jpg",
    tags: ["Next.js", "Socket.io", "MongoDB", "Redis"],
    liveUrl: "https://food delivery-demo.com",
    GitHubUrl: "https://github.com/khoironi/fooddelivery",
    category: "freelance",
    metrics: { value: "50%", label: "Faster Orders" },
  },
  {
    id: 4,
    title: "Task Management App",
    description: "Collaborative project management tool with kanban boards, gantt charts, and team chat.",
    image: "/projects/taskapp.jpg",
    tags: ["Vue.js", "Express", "PostgreSQL", "WebSocket"],
    liveUrl: "https://taskapp-demo.com",
    GitHubUrl: "https://github.com/khoironi/taskapp",
    category: "product",
    metrics: { value: "60%", label: "Productivity Boost" },
  },
  {
    id: 5,
    title: "Portfolio Generator",
    description: "AI-powered portfolio builder that creates stunning developer portfolios in minutes.",
    image: "/projects/portfoliogen.jpg",
    tags: ["Next.js", "OpenAI", "Vercel", "Supabase"],
    liveUrl: "https://portfoliogen.dev",
    GitHubUrl: "https://github.com/khoironi/portfoliogen",
    category: "product",
    metrics: { value: "1000+", label: "Users Created" },
  },
  {
    id: 6,
    title: "Real Estate Platform",
    description: "Property listing platform with virtual tours, agent portal, and mortgage calculator.",
    image: "/projects/realestate.jpg",
    tags: ["Next.js", "Three.js", "Prisma", "AWS"],
    liveUrl: "https://realestate-demo.com",
    GitHubUrl: "https://github.com/khoironi/realestate",
    category: "freelance",
    metrics: { value: "30%", label: "More Leads" },
  },
];

export const services = [
  {
    id: 1,
    title: "Web Development",
    description: "Custom web applications built with modern technologies like Next.js, React, and Node.js.",
    price: "Starting $500",
    features: [
      "Custom web application",
      "Responsive design",
      "API integration",
      "Database setup",
      "3 months support",
    ],
    icon: "code",
  },
  {
    id: 2,
    title: "E-Commerce Solutions",
    description: "Full online store setup with payment processing, inventory management, and marketing tools.",
    price: "Starting $1,500",
    features: [
      "Online store setup",
      "Payment integration",
      "Product management",
      "Order tracking",
      "6 months support",
    ],
    icon: "shopping-cart",
  },
  {
    id: 3,
    title: "API Development",
    description: "RESTful or GraphQL APIs built for your mobile apps, web apps, or third-party integrations.",
    price: "Starting $300",
    features: [
      "REST/GraphQL API",
      "Authentication",
      "Documentation",
      "Rate limiting",
      "2 months support",
    ],
    icon: "server",
  },
  {
    id: 4,
    title: "Technical Consulting",
    description: "Expert advice on architecture, technology choices, performance optimization, and scaling.",
    price: "Starting $100/hr",
    features: [
      "Architecture review",
      "Tech recommendations",
      "Code review",
      "Performance audit",
      "Ongoing support",
    ],
    icon: "consulting",
  },
];

export const experience = [
  {
    id: 1,
    company: "PT. Astra Digital Artha (AstraPay)",
    role: "Product Developer | Full-Stack Developer",
    period: "Mar 2023 - Present",
    description: "Develop and maintain backend services for AstraPay’s PPOB ecosystem using Java, Spring Boot, REST APIs, PostgreSQL, and microservices. "+
    "Build integrations with external partners and internal services for inquiry, payment, transaction status, and updates. "+
    "Develop automated reconciliation and settlement processes using Spring Batch to match transactions across AstraPay, partners, and internal systems. "+
    "Implement scheduled processes for product availability, automatic partner switching, and product activation/deactivation. Build monitoring solutions for transaction issues, "+
    "price/status discrepancies, product availability, and partner failures. Collaborate with Product, Finance, Operations, QA, Infrastructure, and external partners across SIT, UAT, deployment, "+
    "and production monitoring. Troubleshoot production issues involving API timeouts, database connection pools, high traffic, and service performance, including circuit breaker implementation. "+
    "Follow engineering practices including TDD, unit testing, documentation, Agile, and code conventions.",
    technologies: ["Java", "Spring Boot", "Kotlin Android", "Angular.js", "TypeScript", "PostgreSQL", "Redis", "Datadog" ,"GCP", "Jira", "Confluence"],
  },
  {
    id: 2,
    company: "UPN Veteran Jawa Timur",
    role: "Software Engineer Internship",
    period: "Jan 2020 - Aug 2020",
    description: "Built custom web solutions for internal website of computer science faculty.",
    technologies: ["Laravel", "MySql", "React"],
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "CEO, TechStartup",
    company: "TechStartup Inc.",
    content: "Khoironi delivered an exceptional e-commerce platform that increased our revenue by 40%. His attention to detail and communication throughout the project was outstanding.",
    avatar: "/testimonials/sarah.jpg",
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Product Manager",
    company: "InnovateTech",
    content: "Working with Khoironi was a great experience. He understood our requirements perfectly and delivered before the deadline. The dashboard he built transformed how we make decisions.",
    avatar: "/testimonials/michael.jpg",
  },
  {
    id: 3,
    name: "Emily Watson",
    role: "Founder",
    company: "FoodieApp",
    content: "Khoironi built our food delivery app from scratch. The real-time tracking feature he implemented exceeded our expectations. Highly recommended!",
    avatar: "/testimonials/emily.jpg",
  },
  {
    id: 4,
    name: "David Kim",
    role: "CTO",
    company: "GrowthLabs",
    content: "His technical expertise and clean code quality made our collaboration seamless. He also provided valuable suggestions that improved our product.",
    avatar: "/testimonials/david.jpg",
  },
];

export const mediumArticles = [
  {
    id: 1,
    title: "Handle API connection bottleneck with Resilience4J Circuit Breaker",
    description: "Handle API connection bottleneck with Resilience4J Circuit Breaker Situation During high traffic periods, our biller-service started struggling",
    date: "Oct 5, 2025",
    readTime: "2 min read",
    url: "https://medium.com/@muhkhoironi/finnally-i-decide-to-handle-timeout-and-connection-pool-exhaustion-in-biller-service-using-9442bfed9b85",
    category: "Spring Boot - Java - Architecture",
  },
  {
    id: 2,
    title: "Spring Security Pada Spring Boot - basic authentication - 1",
    description: "Sebelum ke praktek spring security nya kita perlu memahami ILUSTRASI BASIC AUTHENTICATION",
    date: "Jan 31, 2023",
    readTime: "1 min read",
    url: "https://medium.com/@muhkhoironi/spring-security-pada-spring-boot-1-basic-authentication-1c78ffd7b12d",
    category: "Spring Boot - Java",
  },
  {
    id: 3,
    title: "Kecerdasan Manusia di Era Kecerdasan Buatan",
    description: "Di dunia yang semakin cepat berevolusi ini, tidak dipungkiri akan ada inovasi inovasi baru yang dilahirkan oleh manusia untuk membantu dan memudahkan pekerjaannya. Hari ini, tepat tulisan ini dibuat, manusia sudah mampu menciptakan mesin yang dibuat belajar, berpikir dan berevolusi secara mandiri.",
    date: "Jan 31, 2023",
    readTime: "1 min read",
    url: "https://medium.com/@muhkhoironi/kecerdasan-manusia-di-era-kecerdasan-buatan-9e85a5a1640c",
    category: "MHO Article",
  },
];

export const contactInfo = {
  email: "muhkhoironi01@gmail.com",
  phone: "+62 881 9332 467",
  location: "Jakarta, Indonesia",
  availability: "Usually responds within 24 hours",
};