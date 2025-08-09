import React from 'react';
import type { PortfolioData } from '../types';
import { MailIcon, PhoneIcon, LocationIcon, GithubIcon, LinkedInIcon, BehanceIcon, ExternalLinkIcon } from './Icons';

interface ContactProps {
    content: PortfolioData;
}

const InfoCard: React.FC<{ icon: React.ReactNode; title: string; value: string }> = ({ icon, title, value }) => (
    <div className="flex items-start gap-4">
        <div className="text-primary mt-1">{icon}</div>
        <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">{title}</h4>
            <p className="text-gray-500 dark:text-gray-400">{value}</p>
        </div>
    </div>
);

const SocialProfile: React.FC<{ icon: React.ReactNode; name: string; href: string }> = ({ icon, name, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors">
        {icon}
        <span className="ml-2">{name}</span>
        <ExternalLinkIcon />
    </a>
);


const Contact: React.FC<ContactProps> = ({ content }) => {
    const { contactInfo, socialLinks } = content;

    return (
        <section id="contact" className="py-20 scroll-mt-20">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Get In Touch</h2>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Have a project in mind or want to discuss potential opportunities? I'd love to hear from you.
                    </p>
                </div>
                <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 bg-white dark:bg-dark-card p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                    <div className="lg:w-1/3 space-y-8">
                        <div>
                           <InfoCard icon={<MailIcon />} title="Email" value={contactInfo.email} />
                        </div>
                        <div>
                            <InfoCard icon={<PhoneIcon />} title="Phone" value={contactInfo.phone} />
                        </div>
                        <div>
                            <InfoCard icon={<LocationIcon />} title="Location" value={contactInfo.location} />
                        </div>
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                             <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Professional Profiles</h4>
                             <div className="space-y-4">
                                <SocialProfile icon={<LinkedInIcon />} name="LinkedIn" href={socialLinks.linkedin} />
                                <SocialProfile icon={<GithubIcon />} name="GitHub" href={socialLinks.github} />
                                <SocialProfile icon={<BehanceIcon />} name="Behance" href={socialLinks.behance} />
                             </div>
                        </div>
                    </div>
                    <div className="lg:w-2/3">
                        <form className="space-y-6">
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                    <input type="text" id="name" name="name" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-primary focus:border-primary" placeholder="Your name"/>
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                    <input type="email" id="email" name="email" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-primary focus:border-primary" placeholder="Your email"/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                                <input type="text" id="subject" name="subject" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-primary focus:border-primary" placeholder="Subject of your message"/>
                            </div>
                             <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                                <textarea id="message" name="message" rows={5} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-primary focus:border-primary" placeholder="Your message"></textarea>
                            </div>
                            <div>
                                <button type="submit" className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition-colors duration-300">
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;