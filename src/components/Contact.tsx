import React, { useState } from 'react';
import type { PortfolioData } from '../types';
import { MailIcon, PhoneIcon, LocationIcon, GithubIcon, LinkedInIcon, BehanceIcon, ExternalLinkIcon, LinkIcon, DribbbleIcon, InstagramIcon } from './Icons';
import FadeIn from './FadeIn';
import { supabase } from '../lib/supabaseClient';
import { useToast } from './Toast';

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


const WEB3FORMS_ACCESS_KEY = 'e3aeb435-16aa-49cd-a295-db833c402398';

const Contact: React.FC<ContactProps> = ({ content }) => {
    const { contactInfo, socialLinks, sectionTitles } = content;
    const { showToast } = useToast();
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (status === 'loading') return;
        setStatus('loading');

        try {
            const payload = { access_key: WEB3FORMS_ACCESS_KEY, ...formData };
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (!data.success) throw new Error(data.message || 'Failed to send message.');

            // Also store in Supabase for Admin Inbox
            try {
                await supabase.from('contact_submissions').insert([{
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                    created_at: new Date().toISOString()
                }]);
            } catch (dbError) {
                console.error("Failed to save to Supabase inbox:", dbError);
            }

            setStatus('success');
            showToast('Message sent! I\'ll get back to you shortly. 🎉', 'success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error: any) {
            console.error('Error submitting message:', error);
            setStatus('error');
            showToast(`Failed to send: ${error.message}`, 'error');
        }
    };

    return (
        <section id="contact" className="py-20 scroll-mt-20">
            <div className="container mx-auto px-6">
                <FadeIn direction="up">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">{sectionTitles?.contact || "Get In Touch"}</h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Have a project in mind or want to discuss potential opportunities? I'd love to hear from you.
                        </p>
                    </div>
                </FadeIn>
                <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 bg-white dark:bg-dark-card p-4 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                    <FadeIn direction="left" className="lg:w-1/3 space-y-8">
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
                                {socialLinks.linkedin && socialLinks.linkedin !== '#' && socialLinks.linkedin !== '' && <SocialProfile icon={<LinkedInIcon />} name="LinkedIn" href={socialLinks.linkedin} />}
                                {socialLinks.github && socialLinks.github !== '#' && socialLinks.github !== '' && <SocialProfile icon={<GithubIcon />} name="GitHub" href={socialLinks.github} />}
                                {socialLinks.behance && socialLinks.behance !== '#' && socialLinks.behance !== '' && <SocialProfile icon={<BehanceIcon />} name="Behance" href={socialLinks.behance} />}
                                {socialLinks.website && socialLinks.website !== '#' && socialLinks.website !== '' && <SocialProfile icon={<LinkIcon />} name="Website" href={socialLinks.website} />}
                                {socialLinks.dribbble && socialLinks.dribbble !== '#' && socialLinks.dribbble !== '' && <SocialProfile icon={<DribbbleIcon />} name="Dribbble" href={socialLinks.dribbble} />}
                                {socialLinks.instagram && socialLinks.instagram !== '#' && socialLinks.instagram !== '' && <SocialProfile icon={<InstagramIcon />} name="Instagram" href={socialLinks.instagram} />}
                             </div>
                        </div>
                    </FadeIn>
                    <FadeIn direction="right" className="lg:w-2/3">
                        <form onSubmit={handleSubmit} className="space-y-6">
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-primary focus:border-primary" placeholder="Your name"/>
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-primary focus:border-primary" placeholder="Your email"/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                                <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-primary focus:border-primary" placeholder="Subject of your message"/>
                            </div>
                             <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                                <textarea id="message" name="message" rows={5} value={formData.message} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-primary focus:border-primary" placeholder="Your message"></textarea>
                            </div>
                            <div>
                                <button type="submit" disabled={status === 'loading'} className="w-full px-6 py-3 text-white font-semibold rounded-xl shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                                    {status === 'loading' && (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                            </svg>
                                            Sending...
                                        </span>
                                    )}
                                    {status !== 'loading' && 'Send Message'}
                                </button>
                            </div>
                        </form>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
};

export default Contact;
