import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import type { PricingPlan } from '../types';
import FadeIn from './FadeIn';

const PricingCard: React.FC<{ plan: PricingPlan; index: number }> = ({ plan, index }) => {
    return (
        <FadeIn direction="up" delay={index * 0.1} className="h-full">
            <div className={`relative glass-card rounded-2xl p-6 md:p-8 flex flex-col h-full ${plan.isPopular ? 'ring-2 ring-primary scale-105 md:scale-110 z-10' : ''}`}>
                {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-purple-600 text-white text-xs font-bold rounded-full shadow-lg">
                        Most Popular
                    </div>
                )}

                <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{plan.description}</p>
                </div>

                <div className="text-center mb-6">
                    <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{plan.price}</span>
                    {plan.period && <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">/{plan.period}</span>}
                </div>

                <ul className="flex-1 space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-300 text-sm">
                            <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                        </li>
                    ))}
                </ul>

                <a
                    href="#contact"
                    className={`w-full py-3 px-6 rounded-xl font-semibold text-center transition-all duration-300 ${
                        plan.isPopular
                            ? 'bg-gradient-to-r from-primary to-purple-600 text-white hover:shadow-lg hover:shadow-primary/30 hover:scale-105'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white'
                    }`}
                >
                    {plan.buttonText || 'Choose Plan'}
                </a>
            </div>
        </FadeIn>
    );
};

const Pricing: React.FC = () => {
    const { content, t } = usePortfolio();
    const { pricingPlans, sectionTitles } = content;

    if (!pricingPlans || pricingPlans.length === 0) return null;

    return (
        <section id="pricing" className="py-20 scroll-mt-20 relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <FadeIn direction="up">
                    <div className="text-center mb-12">
                        <h2 className="section-heading">
                            {sectionTitles?.pricing || t.sections.pricing || "Pricing Plans"}
                        </h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Choose the perfect plan for your needs. All plans include professional quality and dedicated support.
                        </p>
                    </div>
                </FadeIn>

                <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
                    {pricingPlans.map((plan, index) => (
                        <PricingCard key={index} plan={plan} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;