import React, { useState, useEffect, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { MailIcon, PhoneIcon, LocationIcon, GithubIcon, LinkedInIcon, BehanceIcon, ExternalLinkIcon, LinkIcon, DribbbleIcon, InstagramIcon } from './Icons';
import { supabase } from '../lib/supabaseClient';
import { useToast } from './Toast';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const InfoCard: React.FC<{ icon: React.ReactNode; title: string; value: string }> = ({ icon, title, value }) => (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-100/50 dark:hover:bg-gray-800/40 transition-all duration-300">
        <div className="text-primary mt-1 p-2 bg-primary/10 rounded-lg" data-magnetic>{icon}</div>
        <div>
            <h4 className="font-bold text-gray-850 dark:text-gray-200 text-sm uppercase tracking-wider">{title}</h4>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-medium">{value}</p>
        </div>
    </div>
);

const SocialProfile: React.FC<{ icon: React.ReactNode; name: string; href: string }> = ({ icon, name, href }) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex items-center justify-between p-3 rounded-xl border border-gray-200/50 dark:border-gray-800 bg-white/50 dark:bg-dark-card/50 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-300 group"
        data-magnetic
    >
        <div className="flex items-center gap-3">
            <span className="text-gray-500 group-hover:text-primary transition-colors">{icon}</span>
            <span className="text-sm font-bold uppercase tracking-wider">{name}</span>
        </div>
        <ExternalLinkIcon className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </a>
);

const WEB3FORMS_ACCESS_KEY = 'e3aeb435-16aa-49cd-a295-db833c402398';

const Contact: React.FC = () => {
    const { content, t } = usePortfolio();
    const { contactInfo, socialLinks, sectionTitles } = content;
    const { showToast } = useToast();
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.contact-reveal-header',
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: '.contact-reveal-header',
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );

            gsap.fromTo('.contact-pane',
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: '.contact-pane',
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

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

            // Store in Supabase for Admin Inbox
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
        <section ref={containerRef} id="contact" className="py-24 bg-slate-50 dark:bg-dark-bg scroll-mt-20 relative overflow-hidden transition-colors duration-300">
            {/* Ambient glows */}
            <div className="absolute top-1/4 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[110px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-[130px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="contact-reveal-header text-center mb-16">
                    <span className="text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">Get In Touch</span>
                    <h2 className="text-3xl md:text-5xl font-extrabold mt-4 text-gray-900 dark:text-white tracking-tight">{sectionTitles?.contact || t.contact.title}</h2>
                    <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto font-medium">
                        {t.contact.subtitle}
                    </p>
                </div>

                {/* Calendly Booking Button */}
                {content.bookingUrl && (
                    <div className="text-center mb-12">
                        <a
                            href={content.bookingUrl.trim()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all duration-300"
                            data-magnetic
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Book a Strategy Call
                        </a>
                        <p className="mt-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Let's map out a plan for your product.
                        </p>
                    </div>
                )}

                <div className="contact-pane max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 bg-white/70 dark:bg-dark-card/75 backdrop-blur-md p-6 sm:p-10 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-800/80">
                    {/* Left Pane (Details/Profiles) */}
                    <div className="lg:w-2/5 space-y-6">
                        <div className="space-y-4">
                            <InfoCard icon={<MailIcon />} title="Email" value={contactInfo.email} />
                            <InfoCard icon={<PhoneIcon />} title="Phone" value={contactInfo.phone} />
                            <InfoCard icon={<LocationIcon />} title="Location" value={contactInfo.location} />
                        </div>
                        <div className="pt-6 border-t border-gray-200/50 dark:border-gray-800">
                             <h4 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider mb-4 px-2">Professional Profiles</h4>
                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                                {socialLinks.linkedin && socialLinks.linkedin !== '#' && socialLinks.linkedin !== '' && <SocialProfile icon={<LinkedInIcon />} name="LinkedIn" href={socialLinks.linkedin} />}
                                {socialLinks.github && socialLinks.github !== '#' && socialLinks.github !== '' && <SocialProfile icon={<GithubIcon />} name="GitHub" href={socialLinks.github} />}
                                {socialLinks.behance && socialLinks.behance !== '#' && socialLinks.behance !== '' && <SocialProfile icon={<BehanceIcon />} name="Behance" href={socialLinks.behance} />}
                                {socialLinks.website && socialLinks.website !== '#' && socialLinks.website !== '' && <SocialProfile icon={<LinkIcon />} name="Website" href={socialLinks.website} />}
                                {socialLinks.dribbble && socialLinks.dribbble !== '#' && socialLinks.dribbble !== '' && <SocialProfile icon={<DribbbleIcon />} name="Dribbble" href={socialLinks.dribbble} />}
                                {socialLinks.instagram && socialLinks.instagram !== '#' && socialLinks.instagram !== '' && <SocialProfile icon={<InstagramIcon />} name="Instagram" href={socialLinks.instagram} />}
                             </div>
                        </div>
                    </div>

                    {/* Right Pane (Form Submission) */}
                    <div className="lg:w-3/5">
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
                                    <label htmlFor="name" className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">{t.contact.name}</label>
                                    <input 
                                        type="text" 
                                        id="name" 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleChange} 
                                        required 
                                        className="w-full px-4 py-3 border border-gray-200/50 dark:border-gray-800 rounded-xl bg-slate-50 dark:bg-gray-800/40 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium text-sm" 
                                        placeholder={t.contact.name}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">{t.contact.email}</label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        required 
                                        className="w-full px-4 py-3 border border-gray-200/50 dark:border-gray-800 rounded-xl bg-slate-50 dark:bg-gray-800/40 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium text-sm" 
                                        placeholder={t.contact.email}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Subject</label>
                                <input 
                                    type="text" 
                                    id="subject" 
                                    name="subject" 
                                    value={formData.subject} 
                                    onChange={handleChange} 
                                    required 
                                    className="w-full px-4 py-3 border border-gray-200/50 dark:border-gray-800 rounded-xl bg-slate-50 dark:bg-gray-800/40 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium text-sm" 
                                    placeholder="Subject"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">{t.contact.message}</label>
                                <textarea 
                                    id="message" 
                                    name="message" 
                                    rows={5} 
                                    value={formData.message} 
                                    onChange={handleChange} 
                                    required 
                                    className="w-full px-4 py-3 border border-gray-200/50 dark:border-gray-800 rounded-xl bg-slate-50 dark:bg-gray-800/40 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium text-sm resize-none" 
                                    placeholder={t.contact.message}
                                />
                            </div>
                            <div>
                                <button 
                                    type="submit" 
                                    disabled={status === 'loading'} 
                                    className="w-full px-6 py-4 text-white font-bold rounded-xl shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-purple-600 hover:shadow-primary/35 hover:scale-[1.01] active:scale-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 uppercase tracking-wider text-xs"
                                    data-magnetic
                                >
                                    {status === 'loading' ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                            </svg>
                                            Sending...
                                        </span>
                                    ) : t.contact.send}
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
