export type Language = 'en' | 'bn';

export interface Translations {
    nav: {
        home: string;
        about: string;
        skills: string;
        work: string;
        blog: string;
        contact: string;
        services: string;
        timeline: string;
        resume: string;
        guestbook: string;
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
        services: string;
        timeline: string;
        about: string;
        resume: string;
        pricing: string;
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
    booking: {
        book: string;
        schedule: string;
    };
    cookies: {
        message: string;
        accept: string;
        decline: string;
    };
    guestbook: {
        title: string;
        subtitle: string;
        namePlaceholder: string;
        messagePlaceholder: string;
        submit: string;
        empty: string;
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
            services: 'Services',
            timeline: 'Timeline',
            resume: 'Resume',
            guestbook: 'Guestbook',
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
            services: 'Services',
            timeline: 'My Journey',
            about: 'About Me',
            resume: 'Resume',
            pricing: 'Pricing Plans',
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
        booking: {
            book: 'Book a Call',
            schedule: 'Schedule a Meeting',
        },
        cookies: {
            message: 'We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.',
            accept: 'Accept',
            decline: 'Decline',
        },
        guestbook: {
            title: 'Guestbook',
            subtitle: 'Leave a message or just say hello!',
            namePlaceholder: 'Your name',
            messagePlaceholder: 'Your message',
            submit: 'Sign Guestbook',
            empty: 'No messages yet. Be the first to sign!',
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
            services: 'সেবাসমূহ',
            timeline: 'যাত্রা',
            resume: 'রিজিউমে',
            guestbook: 'গেস্টবুক',
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
            services: 'সেবাসমূহ',
            timeline: 'আমার যাত্রা',
            about: 'আমার সম্পর্কে',
            resume: 'রিজিউমে',
            pricing: 'প্রাইসিং প্ল্যান',
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
        booking: {
            book: 'কল বুক করুন',
            schedule: 'মিটিং শিডিউল করুন',
        },
        cookies: {
            message: 'আমরা আপনার অভিজ্ঞতা উন্নত করতে কুকি ব্যবহার করি। এই সাইটে ভিজিট করে আপনি আমাদের কুকি ব্যবহারে সম্মতি দিচ্ছেন।',
            accept: 'গ্রহণ করুন',
            decline: 'অস্বীকার করুন',
        },
        guestbook: {
            title: 'গেস্টবুক',
            subtitle: 'একটি মেসেজ রাখুন বা শুধু হ্যালো বলুন!',
            namePlaceholder: 'আপনার নাম',
            messagePlaceholder: 'আপনার মেসেজ',
            submit: 'গেস্টবুকে সাইন করুন',
            empty: 'এখনো কোনো মেসেজ নেই। প্রথম সাইন করুন!',
        },
    },
};