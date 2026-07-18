import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { motion } from 'framer-motion';

const getServiceIcon = (name: string) => {
    const lower = name.toLowerCase();
    
    // Web Development
    if (lower.includes('web') || lower.includes('development') || lower.includes('code') || lower.includes('full stack')) {
        return (
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
            </svg>
        );
    }
    
    // UI/UX Design
    if (lower.includes('ui') || lower.includes('ux') || lower.includes('user') || lower.includes('interface')) {
        return (
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
            </svg>
        );
    }
    
    // Graphic Design
    if (lower.includes('graphic') || lower.includes('design') || lower.includes('branding') || lower.includes('visual')) {
        return (
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122A3 3 0 00.879 2.122l-.621.621A3 3 0 002.378 5.62l.621-.621A3 3 0 002.378 1.38L1.757 2a3 3 0 00.879 2.122M12 18.75a6 6 0 006-6c0-1.88-.865-3.557-2.227-4.66a9.056 9.056 0 00-5.113-1.897C9.84 6.142 9 6.82 9 7.747v1.173A3.75 3.75 0 015.25 12.5H3.75a.75.75 0 00-.75.75v1.875c0 .621.504 1.125 1.125 1.125h1.875a3.75 3.75 0 013.75 3.75V21a.75.75 0 00.75.75H12z" />
            </svg>
        );
    }
    
    // Multimedia Design
    if (lower.includes('multimedia') || lower.includes('video') || lower.includes('animation') || lower.includes('media')) {
        return (
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 12l-6.75 3.897V8.103L15.75 12z" />
            </svg>
        );
    }
    
    // Fallback/Default service icon
    return (
        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .621-.504 1.125-1.125 1.125H4.875c-.621 0-1.125-.504-1.125-1.125v-4.25m16.5 0a2.25 2.25 0 00-2.25-2.25H5.625a2.25 2.25 0 00-2.25 2.25m16.5 0V7.125c0-.621-.504-1.125-1.125-1.125H4.875c-.621 0-1.125.504-1.125 1.125V14.15M12 9.75v3.375c0 .104-.084.188-.188.188H9.75M12 18.75h.008v.008H12v-.008z" />
        </svg>
    );
};

const About: React.FC = () => {
    const { content, t } = usePortfolio();
    const { 
        careerObjective, 
        expertiseAreas, 
        skillsData
    } = content;

    // Staggered motion variants for elements
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        },
        hover: {
            y: -8,
            scale: 1.01,
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 15px rgba(0, 223, 143, 0.15)",
            borderColor: "rgba(0, 223, 143, 0.35)",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20
            }
        }
    };

    const chipVariants = {
        hidden: { opacity: 0, y: 15, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 260,
                damping: 20
            }
        }
    };

    // Keyword highlighter to dynamically highlight terms
    const highlightObjective = (text: string) => {
        if (!text) return "";
        const keywords = [
            "higher education", 
            "global work experience", 
            "expanding my skills", 
            "contributing effectively",
            "web development",
            "graphic design",
            "ui/ux design",
            "multimedia design",
            "creative mindset",
            "go abroad",
            "developer"
        ];
        let highlighted = text;
        keywords.forEach(word => {
            // Use word boundary check to match exact phrases
            const regex = new RegExp(`\\b(${word})\\b`, 'gi');
            highlighted = highlighted.replace(regex, '<span class="text-primary font-bold">$1</span>');
        });
        return highlighted;
    };

    // Extract all unique skills & techs
    const allSkills = skillsData || [];
    const skillChips = Array.from(new Set(allSkills.flatMap(s => [s.name, ...s.technologies])));

    return (
        <section id="about" className="py-28 bg-[#0d1116] relative overflow-hidden border-y border-white/10 scroll-mt-20">
            {/* Subtle glow background */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 right-0 w-80 h-80 bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                
                {/* Section Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <h2 className="section-heading tracking-tight font-space uppercase">
                        {t.sections.about || 'About Me'}
                    </h2>
                    <p className="mt-4 text-gray-400 max-w-xl mx-auto font-medium text-base md:text-lg">
                        A view into my professional foundation, experience, skills, and career journey.
                    </p>
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="space-y-12"
                >
                    {/* SECTION 1: WHO I AM */}
                    <motion.div
                        variants={fadeUp}
                        whileHover="hover"
                        className="glass-card p-8 md:p-12 rounded-[24px] border border-white/[0.08] bg-[#161b22]/70 relative overflow-hidden group shadow-lg transition-all duration-300"
                    >
                        <h3 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider font-space">
                            Who I Am
                        </h3>
                        <p 
                            className="text-white text-lg md:text-2xl font-medium leading-relaxed font-outfit" 
                            dangerouslySetInnerHTML={{ __html: highlightObjective(careerObjective) }} 
                        />
                    </motion.div>

                    {/* SECTION 2: EXPERIENCE & EDUCATION */}
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* LEFT CARD: Experience */}
                        <motion.div
                            variants={fadeUp}
                            whileHover="hover"
                            className="glass-card p-8 md:p-10 rounded-[24px] border border-white/[0.08] bg-[#161b22]/70 relative overflow-hidden group shadow-lg transition-all duration-300"
                        >
                            <h3 className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-wider font-space">
                                Experience
                            </h3>
                            <div className="space-y-8">
                                {content.timeline && content.timeline.length > 0 ? (
                                    content.timeline.map((item, index) => (
                                        <div key={index} className="relative pl-6 border-l border-primary/20 hover:border-primary/50 transition-colors">
                                            <div className="absolute left-0 top-1.5 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-primary shadow-[0_0_10px_rgba(0,223,143,0.6)]" />
                                            <span className="text-xs font-bold text-primary font-space tracking-wide">{item.year}</span>
                                            <h4 className="text-lg font-bold text-white mt-1 font-space">{item.title}</h4>
                                            <p className="text-sm text-gray-400 mt-2 leading-relaxed font-medium">{item.description}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-450">No timeline information found.</p>
                                )}
                            </div>
                        </motion.div>

                        {/* RIGHT CARD: Education */}
                        <motion.div
                            variants={fadeUp}
                            whileHover="hover"
                            className="glass-card p-8 md:p-10 rounded-[24px] border border-white/[0.08] bg-[#161b22]/70 relative overflow-hidden group shadow-lg transition-all duration-300"
                        >
                            <h3 className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-wider font-space">
                                Education
                            </h3>
                            <div className="space-y-8">
                                {content.education && content.education.length > 0 ? (
                                    content.education.map((item, index) => (
                                        <div key={index} className="relative pl-6 border-l border-primary/20 hover:border-primary/50 transition-colors">
                                            <div className="absolute left-0 top-1.5 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-secondary shadow-[0_0_10px_rgba(0,179,115,0.6)]" />
                                            <span className="text-xs font-bold text-secondary font-space tracking-wide">{item.year}</span>
                                            <h4 className="text-lg font-bold text-white mt-1 font-space">{item.degree}</h4>
                                            <span className="text-xs font-semibold text-gray-400 block mt-0.5">{item.institution}</span>
                                            {item.description && <p className="text-sm text-gray-400 mt-2 leading-relaxed font-medium">{item.description}</p>}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-450">No education information found.</p>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* SECTION 3: CORE SKILLS & TECHNOLOGIES */}
                    <motion.div
                        variants={fadeUp}
                        whileHover="hover"
                        className="glass-card p-8 md:p-10 rounded-[24px] border border-white/[0.08] bg-[#161b22]/70 relative overflow-hidden group shadow-lg transition-all duration-300"
                    >
                        <h3 className="text-xs font-bold text-gray-400 mb-8 uppercase tracking-wider font-space text-center md:text-left">
                            Core Skills & Technologies
                        </h3>
                        <motion.div 
                            className="flex flex-wrap gap-3.5 justify-center md:justify-start"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            {skillChips.map((chip, idx) => (
                                <motion.span
                                    key={idx}
                                    variants={chipVariants}
                                    whileHover={{ 
                                        scale: 1.08, 
                                        y: -3,
                                        boxShadow: "0 0 20px rgba(0, 223, 143, 0.45)",
                                        borderColor: "rgba(0, 223, 143, 0.9)",
                                        color: "#ffffff"
                                    }}
                                    className="px-5 py-2.5 bg-[#0d1116] border border-white/[0.08] rounded-full text-sm font-semibold text-gray-300 transition-colors duration-300 cursor-pointer select-none font-space"
                                >
                                    {chip}
                                </motion.span>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* SECTION 4: WHAT I DO (Services) */}
                    <div className="pt-8">
                        <div className="text-center mb-12">
                            <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-space uppercase">
                                What I Do
                            </h3>
                            <p className="mt-3 text-gray-400 max-w-xl mx-auto font-medium text-sm md:text-base">
                                Services I offer to build high-performance products and premium layouts.
                            </p>
                        </div>

                        <motion.div 
                            className="grid md:grid-cols-2 gap-6 lg:gap-8"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            {expertiseAreas?.map((area, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeUp}
                                    whileHover={{ 
                                        y: -6,
                                        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.35), 0 0 12px rgba(0, 223, 143, 0.1)",
                                        borderColor: "rgba(0, 223, 143, 0.25)"
                                    }}
                                    className="glass-card p-6 md:p-8 rounded-[24px] border border-white/[0.08] bg-[#161b22]/70 relative overflow-hidden group shadow-lg flex items-start gap-6 transition-all duration-300"
                                >
                                    <div className="p-3 bg-primary/10 rounded-2xl flex items-center justify-center min-w-[56px] min-h-[56px] border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                                        {getServiceIcon(area.name)}
                                    </div>
                                    <div>
                                        <h4 className="text-lg md:text-xl font-bold text-white font-space group-hover:text-primary transition-colors">
                                            {area.name}
                                        </h4>
                                        <p className="text-sm text-gray-400 mt-2 leading-relaxed font-medium">
                                            {area.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                </motion.div>
            </div>
        </section>
    );
};

export default About;