export type Language = 'en' | 'bn';

export interface Translations {
    nav: {
        home: string;
        about: string;
        skills: string;
        work: string;
        blog: string;
        contact: string;
    };
    hero: {
        availableForHire: string;
        roles: string[];
        subheading: string;
        getInTouch: string;
        downloadResume: string;
    };
    sections: {
        expertise: string;
        skills: string;
        work: string;
        blog: string;
        testimonials: string;
        contact: string;
    };
    contact: {
        title: string;
        subtitle: string;
        name: string;
        email: string;
        message: string;
        send: string;
        success: string;
        error: string;
    };
    footer: {
        description: string;
        quickLinks: string;
        connect: string;
        rights: string;
    };
}

export const translations: Record<Language, Translations> = {
    en: {
        nav: {
            home: 'Home',
            about: 'About',
            skills: 'Skills',
            work: 'Work',
            blog: 'Blog',
            contact: 'Contact',
        },
        hero: {
            availableForHire: 'Available for hire',
            roles: ['Full Stack Developer', 'UI/UX Designer', 'React Expert'],
            subheading: 'Building beautiful, functional websites and applications with modern technologies.',
            getInTouch: 'Get in Touch',
            downloadResume: 'Download Resume',
        },
        sections: {
            expertise: 'My Expertise',
            skills: 'Technical Skills',
            work: 'Bringing Ideas to Life',
            blog: 'Latest Posts',
            testimonials: 'What Clients Say',
            contact: 'Get In Touch',
        },
        contact: {
            title: "Let's Talk",
            subtitle: 'Have a project in mind? Let\'s create something amazing together.',
            name: 'Your Name',
            email: 'Your Email',
            message: 'Your Message',
            send: 'Send Message',
            success: 'Message sent successfully!',
            error: 'Failed to send message. Please try again.',
        },
        footer: {
            description: 'Creating beautiful digital experiences with modern technologies.',
            quickLinks: 'Quick Links',
            connect: 'Connect',
            rights: 'All rights reserved.',
        },
    },
    bn: {
        nav: {
            home: 'হোম',
            about: 'সম্পর্কে',
            skills: 'দক্ষতা',
            work: 'কাজ',
            blog: 'ব্লগ',
            contact: 'যোগাযোগ',
        },
        hero: {
            availableForHire: 'চাকরির জন্য প্রস্তুত',
            roles: ['ফুল স্ট্যাক ডেভেলপার', 'ইউআই/ইউএক্স ডিজাইনার', 'রিঅ্যাক্ট বিশেষজ্ঞ'],
            subheading: 'আধুনিক প্রযুক্তি ব্যবহারে সুন্দর এবং কার্যকরী ওয়েবসাইট ও অ্যাপ্লিকেশন তৈরি করছি।',
            getInTouch: 'যোগাযোগ করুন',
            downloadResume: 'রিজিউমে ডাউনলোড',
        },
        sections: {
            expertise: 'আমার বিশেষত্ব',
            skills: 'প্রযুক্তিগত দক্ষতা',
            work: 'আইডিয়া থেকে বাস্তবায়ন',
            blog: 'সাম্প্রতিক পোস্ট',
            testimonials: 'ক্লায়েন্টদের মতামত',
            contact: 'যোগাযোগ',
        },
        contact: {
            title: 'চলুন কথা বলি',
            subtitle: 'কোনো প্রজেক্ট মাথায় আছে? চলুন কিছু অসাধারণ তৈরি করি।',
            name: 'আপনার নাম',
            email: 'আপনার ইমেইল',
            message: 'আপনার মেসেজ',
            send: 'মেসেজ পাঠান',
            success: 'মেসেজ সফলভাবে পাঠানো হয়েছে!',
            error: 'মেসেজ পাঠাতে ব্যর্থ। আবার চেষ্টা করুন।',
        },
        footer: {
            description: 'আধুনিক প্রযুক্তি ব্যবহারে সুন্দর ডিজিটাল অভিজ্ঞতা তৈরি করছি।',
            quickLinks: 'দ্রুত লিংক',
            connect: 'যোগাযোগ',
            rights: 'সকল অধিকার সংরক্ষিত।',
        },
    },
};