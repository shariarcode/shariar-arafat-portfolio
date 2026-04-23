
import React from 'react';
import type { PortfolioData } from './types';
import { CodeIcon, DesignIcon, DevOpsIcon, AutomationIcon } from './components/Icons';

export const ICON_OPTIONS: Record<string, React.FC<any>> = {
    CodeIcon,
    DesignIcon,
    DevOpsIcon,
    AutomationIcon,
};

const USER_NAME = "Shariar Arafat";
const USER_EMAIL = "shariararafar123@gmail.com";
const USER_LOCATION = "Sonapur, Noakhali, Bangladesh";
// Local profile image
const DEFAULT_HERO_IMAGE = "/profile.png";

export const DEFAULT_PORTFOLIO_DATA: PortfolioData = {
    userName: USER_NAME,
    userEmail: USER_EMAIL,
    userLocation: USER_LOCATION,
    heroImage: DEFAULT_HERO_IMAGE,
    heroRoles: ["Web Developer", "Designer", "Creative Thinker"],
    heroSubheading: "Developing intelligent solutions with a creative mindset.",
    heroAvailableText: "Available for hire",
    resumeUrl: "#resume",
    careerObjective: "I aspire to go abroad to gain higher education and global work experience, expanding my skills and contributing effectively to my chosen field.",
    expertiseAreas: [
        { name: "Web Development", description: "Building basic websites and web applications." },
        { name: "Graphic Design", description: "Creating visuals with design tools." },
    ],
    skillsData: [
        {
            name: "Web Development",
            icon: React.createElement(CodeIcon),
            iconName: "CodeIcon",
            description: "Building responsive and functional websites using foundational web technologies.",
            technologies: ["HTML", "CSS (Basic)", "WordPress"],
        },
        {
            name: "Graphic Design",
            icon: React.createElement(DesignIcon),
            iconName: "DesignIcon",
            description: "Creating visual content and user interface elements using design software.",
            technologies: ["Photoshop"],
        },
    ],
    projectsData: [
        {
            category: "Community Event",
            title: "NKG E-Sports Tournament",
            description: "Organized and managed a local e-sports tournament, handling logistics and promotion.",
            services: [
                { name: "Event Management", icon: React.createElement(AutomationIcon), iconName: "AutomationIcon" },
                { name: "Community Engagement", icon: React.createElement(DevOpsIcon), iconName: "DevOpsIcon" }
            ],
            imageUrl: "",
            liveUrl: "#"
        }
    ],
    testimonials: [
        {
            name: "Sarah Jenkins",
            role: "Product Manager",
            company: "TechNova",
            image: "https://i.pravatar.cc/150?img=47",
            content: "Shariar delivered exceptional quality on our project. Not only did he write clean, maintainable code, but he also provided great design insights that completely transformed our user experience.",
            rating: 5
        },
        {
            name: "David Chen",
            role: "Startup Founder",
            company: "Innovate Labs",
            image: "https://i.pravatar.cc/150?img=11",
            content: "Working with Shariar was seamless. He communicates clearly, hits deadlines, and balances clean engineering with polished UI decisions.",
            rating: 5
        },
        {
            name: "Emily Rodriguez",
            role: "Creative Director",
            company: "Studio Eight",
            image: "https://i.pravatar.cc/150?img=5",
            content: "He translated rough wireframes into a polished, responsive application with excellent performance and attention to detail.",
            rating: 5
        }
    ],
    timeline: [
        {
            year: "2020",
            title: "The Beginning",
            description: "Discovered a passion for programming and started learning foundational web technologies."
        },
        {
            year: "2022",
            title: "Freelance Growth",
            description: "Delivered client projects in design and front-end development while sharpening communication and delivery."
        },
        {
            year: "2024",
            title: "Full-Stack Expansion",
            description: "Focused on modern frameworks, TypeScript, and scalable backend architecture for production-ready apps."
        }
    ],
    blogPosts: [
        {
            slug: "build-fast-accessible-portfolio-websites",
            title: "How I Build Fast, Accessible Portfolio Websites",
            excerpt: "My practical checklist for balancing performance, accessibility, and visual polish in client-facing web projects.",
            content: [
                "I begin by setting clear performance budgets before writing UI code. This keeps bundle growth intentional and helps me decide when to split components or defer non-critical features.",
                "Accessibility is not a final audit step for me. I add semantic structure, keyboard navigation checks, and sufficient color contrast while building each section so quality compounds over time.",
                "For visual polish, I prioritize meaningful motion and spacing consistency over excessive effects. Small interactions that reinforce hierarchy usually improve perception more than heavy animation."
            ],
            date: "2026-03-10",
            readTime: "5 min read",
            url: "/blog/build-fast-accessible-portfolio-websites"
        },
        {
            slug: "design-to-code-workflow-that-saves-hours",
            title: "Design-to-Code Workflow That Saves Me Hours",
            excerpt: "A repeatable process for turning rough UI ideas into reusable components without sacrificing iteration speed.",
            content: [
                "I translate each design into tokens first: typography, spacing, color, and interaction states. This gives me a stable base and reduces visual drift as sections evolve.",
                "Then I scaffold reusable primitives and compose larger blocks from those primitives. It avoids one-off styling and makes future revisions significantly faster.",
                "Finally, I validate responsiveness and edge cases early by testing the same component in multiple contexts before shipping."
            ],
            date: "2026-02-01",
            readTime: "4 min read",
            url: "/blog/design-to-code-workflow-that-saves-hours"
        },
        {
            slug: "lessons-from-shipping-full-stack-portfolio-features",
            title: "Lessons From Shipping Full-Stack Portfolio Features",
            excerpt: "What I learned while integrating CMS editing, forms, and live activity widgets into one coherent experience.",
            content: [
                "End-to-end consistency matters more than isolated features. I define shared data models first, then map UI and backend around those models.",
                "For form workflows, I treat delivery and persistence separately. Users get reliable submission feedback while admin tools still receive structured inbox data.",
                "Live widgets like GitHub activity are strongest when they degrade gracefully. Fallback behavior keeps the experience stable even when external data sources are unavailable."
            ],
            date: "2026-01-15",
            readTime: "6 min read",
            url: "/blog/lessons-from-shipping-full-stack-portfolio-features"
        }
    ],
    footerContent: {
        description: "A multidisciplinary professional specializing in Web Development and Design.",
        services: ["Web Development", "Graphic Design", "Consulting"]
    },
    contactInfo: {
        email: USER_EMAIL,
        phone: "Available upon request",
        location: USER_LOCATION,
    },
    socialLinks: {
        linkedin: "#",
        github: "#",
        behance: "#",
        instagram: "#",
        website: "#",
        dribbble: "#"
    },
    sectionTitles: {
        about: "About Me",
        skills: "Technical Skills",
        work: "My Projects",
        pricing: "Pricing Plans",
        contact: "Get In Touch"
    },
    pricingPlans: [
        {
            name: "Basic",
            description: "Perfect for small projects and simple websites.",
            price: "$150",
            period: "per project",
            features: [
                "Single page website",
                "Responsive design",
                "Contact form integration",
                "Basic SEO setup",
                "7 days support"
            ],
            buttonText: "Get Started"
        },
        {
            name: "Standard",
            description: "Ideal for growing businesses and portfolios.",
            price: "$350",
            period: "per project",
            features: [
                "Up to 5 pages",
                "Custom design",
                "CMS integration",
                "Advanced SEO",
                "Social media links",
                "30 days support"
            ],
            isPopular: true,
            buttonText: "Get Started"
        },
        {
            name: "Premium",
            description: "Complete solution for businesses and e-commerce.",
            price: "$750",
            period: "per project",
            features: [
                "Unlimited pages",
                "E-commerce functionality",
                "Custom animations",
                "Payment integration",
                "Priority support",
                "3 months maintenance"
            ],
            buttonText: "Contact Me"
        }
    ],
    navLinks: {
        about: true,
        skills: true,
        work: true,
        blog: true,
        contact: true
    },
    stats: [
        { endValue: 5, label: "Years of Experience", suffix: "+" },
        { endValue: 20, label: "Projects Completed", suffix: "+" },
        { endValue: 15, label: "Happy Clients", suffix: "+" },
        { endValue: 10, label: "Tech Mastered", suffix: "+" }
    ]
};
