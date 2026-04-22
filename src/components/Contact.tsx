import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { MailIcon, PhoneIcon, LocationIcon, GithubIcon, LinkedInIcon, BehanceIcon, ExternalLinkIcon, LinkIcon, DribbbleIcon, InstagramIcon } from './Icons';
import FadeIn from './FadeIn';
import { supabase } from '../lib/supabaseClient';
import { useToast } from './Toast';

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

const Contact: React.FC = () => {
    const { content, t } = usePortfolio();
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
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">{sectionTitles?.contact || t.contact.title}</h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            {t.contact.subtitle}
                        </p>
                    </div>
                </FadeIn>

                {/* Calendly Booking Button */}
                {content.bookingUrl && (
                    <FadeIn direction="up" delay={0.1}>
                        <div className="text-center mb-8">
                            <a
                                href={content.bookingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105 transition-all duration-300"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Book a Call
                            </a>
                            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                                Schedule a call to discuss your project
                            </p>
                        </div>
                    </FadeIn>
                )}
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
                            {/* Honeypot field - hidden from users, filled by bots */}
                            <input 
                                type="text" 
                                name="honeypot" 
                                autoComplete="off" 
                                style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}
                                tabIndex={-1}
                                onChange={() => {}}
                            />
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.contact.name}</label>
                                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-primary focus:border-primary" placeholder={t.contact.name}/>
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.contact.email}</label>
                                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-primary focus:border-primary" placeholder={t.contact.email}/>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                                <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-primary focus:border-primary" placeholder="Subject"/>
                            </div>
                             <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.contact.message}</label>
                                <textarea id="message" name="message" rows={5} value={formData.message} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-primary focus:border-primary" placeholder={t.contact.message}></textarea>
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
                                    {status !== 'loading' && t.contact.send}
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
