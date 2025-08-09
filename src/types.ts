import type React from 'react';

export interface Skill {
    name: string;
    icon: React.ReactNode;
    description: string;
    technologies: string[];
}

export interface ProjectService {
    name: string;
    icon: React.ReactNode;
}

export interface Project {
    category: string;
    title: string;
    description: string;
    services: ProjectService[];
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
}