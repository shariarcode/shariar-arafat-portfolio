import React from 'react';
import type { PortfolioData } from './types';
import { CodeIcon, DesignIcon, DevOpsIcon, AutomationIcon } from './components/Icons';

const USER_NAME = "Shariar Arafat";
const USER_EMAIL = "shariararafar123@gmail.com";
const USER_LOCATION = "Sonapur, Noakhali, Bangladesh";
const DEFAULT_HERO_IMAGE = `https://i.pravatar.cc/400?u=${USER_EMAIL}`;

export const DEFAULT_PORTFOLIO_DATA: PortfolioData = {
    userName: USER_NAME,
    userEmail: USER_EMAIL,
    userLocation: USER_LOCATION,
    heroImage: DEFAULT_HERO_IMAGE,
    heroRoles: ["Web Developer", "Designer", "Creative Thinker"],
    heroSubheading: "Developing intelligent solutions with a creative mindset.",
    careerObjective: "I aspire to go abroad to gain higher education and global work experience, expanding my skills and contributing effectively to my chosen field.",
    expertiseAreas: [
        { name: "Web Development", description: "Building basic websites and web applications." },
        { name: "Graphic Design", description: "Creating visuals with design tools." },
    ],
    skillsData: [
        {
            name: "Web Development",
            icon: React.createElement(CodeIcon),
            description: "Building responsive and functional websites using foundational web technologies.",
            technologies: ["HTML", "CSS (Basic)", "WordPress"],
        },
        {
            name: "Graphic Design",
            icon: React.createElement(DesignIcon),
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
                { name: "Event Management", icon: React.createElement(AutomationIcon) },
                { name: "Community Engagement", icon: React.createElement(DevOpsIcon) }
            ]
        }
    ],
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
    }
};