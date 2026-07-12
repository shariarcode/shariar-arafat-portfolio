import React, { useEffect, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { MapPinIcon, EnvelopeIcon, PhoneIcon, CalendarIcon } from './Icons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
    const { content, t } = usePortfolio();
    const { 
        userName, 
        userEmail, 
        userLocation, 
        careerObjective, 
        expertiseAreas, 
        contactInfo,
        heroImage
    } = content;

    const aboutRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Title reveal
            gsap.fromTo('.about-title',
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: '.about-title',
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );

            // Card reveals
            gsap.fromTo('.about-reveal-card',
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.about-grid-content',
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );

            // Image overlay mask reveal
            gsap.fromTo('.about-image-overlay',
                { xPercent: 0 },
                {
                    xPercent: 101,
                    duration: 1.0,
                    ease: 'power4.inOut',
                    scrollTrigger: {
                        trigger: '.about-image-container',
                        start: 'top 75%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );

            gsap.fromTo('.about-image',
                { scale: 1.25 },
                {
                    scale: 1,
                    duration: 1.4,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.about-image-container',
                        start: 'top 75%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }, aboutRef);

        return () => {
            ctx.revert();
            ScrollTrigger.getAll().forEach(t => {
                if (t.trigger === '.about-title' || t.trigger === '.about-grid-content' || t.trigger === '.about-image-container') {
                    t.kill();
                }
            });
        };
    }, []);

    return (
        <section ref={aboutRef} id="about" className="py-24 bg-white dark:bg-dark-bg transition-colors duration-300 relative overflow-hidden border-y border-gray-100 dark:border-gray-900 scroll-mt-20">
            {/* Subtle glow background */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="about-title text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {t.sections.about || 'About Me'}
                    </h2>
                    <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-xl mx-auto font-medium">
                        A view into my professional foundations and core drive.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-start about-grid-content">
                    {/* Left Column - Image Reveal */}
                    <div className="lg:col-span-4 flex justify-center">
                        <div className="about-image-container relative w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden shadow-2xl border border-gray-200/50 dark:border-gray-800/50 bg-slate-100 dark:bg-dark-card">
                            {/* Slide reveal mask overlay */}
                            <div className="about-image-overlay absolute inset-0 bg-gradient-to-r from-primary to-purple-600 z-10" />
                            <img
                                src={heroImage}
                                alt={userName}
                                className="about-image w-full h-full object-cover object-top will-change-transform"
                            />
                        </div>
                    </div>

                    {/* Center Column - Text Content */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="about-reveal-card bg-slate-50 dark:bg-dark-card rounded-2xl p-8 border border-gray-100 dark:border-gray-850 hover:border-primary/20 transition-all duration-300 shadow-sm relative group">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary transition-colors">
                                Who I Am
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                                {careerObjective || `I'm ${userName}, a passionate developer committed to creating exceptional digital experiences.`}
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {expertiseAreas?.slice(0, 4).map((area, index) => (
                                <div key={index} className="about-reveal-card bg-slate-50/50 dark:bg-dark-card/50 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:scale-[1.02] transition-transform">
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                                        {area.name}
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {area.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Contact Card */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="about-reveal-card bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-6 border border-primary/10 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                                Quick Connect
                            </h3>
                            <div className="space-y-5">
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors" data-magnetic>
                                    <EnvelopeIcon className="w-5 h-5 text-primary" />
                                    <span className="text-sm font-semibold truncate">{contactInfo.email || userEmail}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                    <MapPinIcon className="w-5 h-5 text-primary" />
                                    <span className="text-sm font-semibold truncate">{contactInfo.location || userLocation}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                    <PhoneIcon className="w-5 h-5 text-primary" />
                                    <span className="text-sm font-semibold truncate">{contactInfo.phone || 'Available on request'}</span>
                                </div>
                            </div>
                        </div>

                        <a
                            href="#contact"
                            className="about-reveal-card w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/45 transition-all duration-300"
                            data-magnetic
                        >
                            <CalendarIcon /> Let's Talk
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;