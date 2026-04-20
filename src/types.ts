import type React from 'react';

export interface Skill {
    name: string;
    icon?: React.ReactNode;
    iconName?: string;
    description: string;
    technologies: string[];
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
    skillsData: Skill[];
    projectsData: Project[];
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
        contact?: string;
    };
    navLinks?: {
        about?: boolean;
        skills?: boolean;
        work?: boolean;
        contact?: boolean;
    };
}