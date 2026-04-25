import type React from 'react';

export interface Skill {
    name: string;
    icon?: React.ReactNode;
    iconName?: string;
    description: string;
    technologies: string[];
    proficiency?: number;
}

export interface ProjectService {
    name: string;
    icon?: React.ReactNode;
    iconName?: string;
}

export interface Project {
    category: string;
    title: string;
    description: string;
    services: ProjectService[];
    imageUrl?: string;
    liveUrl?: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface Testimonial {
    name: string;
    role: string;
    company: string;
    image: string;
    content: string;
    rating: number;
}

export interface TimelineEvent {
    year: string;
    title: string;
    description: string;
}

export interface PricingPlan {
    name: string;
    description: string;
    price: string;
    period?: string;
    features: string[];
    isPopular?: boolean;
    buttonText?: string;
}

export interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    content: string[];
    date: string;
    readTime: string;
    url?: string;
}

export interface Stat {
    endValue: number;
    label: string;
    suffix?: string;
}

export interface SectionConfig {
    id: string;
    navLabel: string;
    sectionTitle?: string;
    visible: boolean;
}

export interface AiSettings {
    enabled: boolean;
    systemInstruction: string;
    welcomeMessage: string;
    quickReplies: string[];
}

export interface PortfolioData {
    userName: string;
    userEmail: string;
    userLocation: string;
    heroImage: string;
    heroRoles: string[];
    heroSubheading: string;
    heroAvailableText?: string;
    resumeUrl?: string;
    careerObjective: string;
    expertiseAreas: { name: string; description: string }[];
    sections?: SectionConfig[];
    skillsData: Skill[];
    projectsData: Project[];
    testimonials?: Testimonial[];
    timeline?: TimelineEvent[];
    blogPosts?: BlogPost[];
    footerContent?: {
        description?: string;
        services?: string[];
    };
    contactInfo: {
        email: string;
        phone: string;
        location: string;
    };
    socialLinks: {
        linkedin: string;
        github: string;
        behance: string;
        instagram: string;
        website: string;
        dribbble: string;
    };
    sectionTitles?: {
        about?: string;
        skills?: string;
        work?: string;
        pricing?: string;
        contact?: string;
        services?: string;
        timeline?: string;
        resume?: string;
        expertise?: string;
        blog?: string;
        testimonials?: string;
    };
    pricingPlans?: PricingPlan[];
    navLinks?: {
        about?: boolean;
        skills?: boolean;
        work?: boolean;
        blog?: boolean;
        contact?: boolean;
        services?: boolean;
        timeline?: boolean;
        resume?: boolean;
        expertise?: boolean;
        testimonials?: boolean;
    };
    githubConfig?: {
        username?: string;
        sectionTitle?: string;
        description?: string;
        showStats?: boolean;
        showLanguages?: boolean;
    };
    customPages?: CustomPage[];
    bookingUrl?: string;
    stats?: Stat[];
    aiSettings?: AiSettings;
}

export interface CustomPage {
    id: string;
    slug: string;
    title: string;
    navLabel: string;
    showInNav: boolean;
    content: string;
    layout: 'standard' | 'narrow' | 'wide';
    theme: 'default' | 'glass' | 'minimal';
    visible: boolean;
}