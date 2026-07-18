import React, { useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { motion } from 'framer-motion';

const Expertise: React.FC = () => {
    const { content, t } = usePortfolio();
    const { 
        careerObjective, 
        skillsData, 
        timeline 
    } = content;

    const fadeUp = {
        hidden: { opacity: 0, y: 25 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 90,
                damping: 15
            }
        }
    };

    const allSkills = skillsData || [];

    return (
        <section id="expertise" className="py-24 bg-[#0d1116] relative overflow-hidden border-y border-white/10 scroll-mt-20">
            {/* Ambient subtle glow */}
            <div className="absolute top-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-72 h-72 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                
                {/* Section Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <h2 className="section-heading tracking-tight font-space uppercase">
                        Professional Journey
                    </h2>
                    <p className="mt-3 text-gray-400 max-w-xl mx-auto font-medium text-sm md:text-base">
                        My experience, education & expertise.
                    </p>
                </motion.div>

                {/* Minimal, Spaced Two-Column Layout */}
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                    
                    {/* LEFT COLUMN: Minimal Professional Timeline (45%) */}
                    <div className="lg:col-span-5 space-y-8">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-space">
                            Timeline & Growth
                        </h3>
                        
                        <div className="relative pl-6 space-y-12">
                            {/* Thin vertical line with soft neon glow */}
                            <div className="absolute left-[3px] top-[13px] bottom-[13px] w-[2px] bg-primary/20 shadow-[0_0_8px_rgba(0,223,143,0.3)] z-0" />

                            {timeline && timeline.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={fadeUp}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-100px" }}
                                    className="relative group"
                                >
                                    {/* Small Glowing Accent Dot */}
                                    <div className="absolute left-[-21px] top-[8px] w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_#00df8f] z-10 transition-transform duration-300 group-hover:scale-125">
                                        {/* Subtle pulse animation for the active/latest node */}
                                        {idx === timeline.length - 1 && (
                                            <span className="absolute inset-0 rounded-full bg-primary/50 animate-ping scale-150 opacity-75" />
                                        )}
                                    </div>

                                    <div>
                                        <span className="text-xs font-bold text-primary font-space tracking-wider uppercase block">
                                            {item.year}
                                        </span>
                                        <h4 className="text-lg font-bold text-white mt-1 font-space transition-colors group-hover:text-primary-light">
                                            {item.title}
                                        </h4>
                                        <p className="text-sm text-gray-400 mt-2 leading-relaxed font-medium max-w-md">
                                            {item.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Professional Expertise & Current Focus (55%) */}
                    <div className="lg:col-span-7 space-y-12">
                        
                        {/* Overview Statement */}
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            className="space-y-4"
                        >
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-space">
                                Professional Expertise
                            </h3>
                            <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-medium font-outfit max-w-2xl">
                                {careerObjective}
                            </p>
                        </motion.div>

                        {/* Current Focus Card */}
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            className="glass-card p-6 rounded-[24px] border border-white/[0.06] bg-[#161b22]/40 shadow-sm"
                        >
                            <h4 className="text-xs font-bold text-primary uppercase tracking-wider font-space mb-4">
                                Current Focus
                            </h4>
                            <div className="space-y-4 text-sm text-gray-400 font-medium">
                                <div className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                    <span>Expanding technical expertise in modern front-end frameworks & full-stack integrations</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                    <span>Preparing for higher education & global collaboration opportunities</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                    <span>Refining user interface craftsmanship and visual branding design</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Core Skills Responsive Grid */}
                        {allSkills.length > 0 && (
                            <motion.div
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-100px" }}
                                className="space-y-6"
                            >
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-space">
                                    Core Skills
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 pt-2">
                                    {allSkills.map((skill, idx) => (
                                        <div key={idx} className="space-y-1.5">
                                            <span className="text-sm font-bold text-white font-space">
                                                {skill.name}
                                            </span>
                                            <div className="flex flex-wrap gap-2">
                                                {skill.technologies.map((tech, techIdx) => (
                                                    <span 
                                                        key={techIdx} 
                                                        className="text-xs text-gray-450 font-medium bg-[#14181f] border border-white/[0.04] px-2.5 py-1 rounded-md"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                    </div>

                </div>

            </div>
        </section>
    );
};

export default Expertise;