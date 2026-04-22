import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ChartIcon, EyeIcon, UsersIcon, ArrowUpIcon, ArrowDownIcon } from './Icons';
import FadeIn from './FadeIn';

interface AnalyticsData {
    pageViews: number;
    uniqueVisitors: number;
    avgTimeOnSite: string;
    bounceRate: string;
    topPages: { path: string; views: number }[];
    recentVisits: { time: string; page: string }[];
}

const AnalyticsDashboard: React.FC = () => {
    const { isAdmin } = usePortfolio();

    const mockData: AnalyticsData = {
        pageViews: 12453,
        uniqueVisitors: 8234,
        avgTimeOnSite: '3m 24s',
        bounceRate: '42%',
        topPages: [
            { path: '/', views: 5420 },
            { path: '/blog', views: 3210 },
            { path: '/work', views: 2150 },
            { path: '/about', views: 1230 },
        ],
        recentVisits: [
            { time: '2 min ago', page: 'Home' },
            { time: '5 min ago', page: 'Projects' },
            { time: '12 min ago', page: 'Blog' },
            { time: '15 min ago', page: 'Contact' },
        ],
    };

    if (!isAdmin) return null;

    const stats = [
        { label: 'Page Views', value: mockData.pageViews.toLocaleString(), change: '+12%', up: true, icon: <EyeIcon /> },
        { label: 'Unique Visitors', value: mockData.uniqueVisitors.toLocaleString(), change: '+8%', up: true, icon: <UsersIcon /> },
        { label: 'Avg. Time', value: mockData.avgTimeOnSite, change: '+5%', up: true, icon: <ChartIcon /> },
        { label: 'Bounce Rate', value: mockData.bounceRate, change: '-3%', up: false, icon: <ChartIcon /> },
    ];

    return (
        <section id="analytics" className="py-12 bg-white dark:bg-dark-card border-t border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-6">
                <FadeIn>
                    <div className="flex items-center gap-3 mb-8">
                        <ChartIcon className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Analytics Dashboard
                        </h2>
                    </div>
                </FadeIn>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, index) => (
                        <FadeIn key={index} delay={index * 0.1}>
                            <div className="bg-slate-50 dark:bg-dark-bg rounded-xl p-5 border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-gray-500 dark:text-gray-400 text-sm">{stat.label}</span>
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                        {stat.icon}
                                    </div>
                                </div>
                                <div className="flex items-end justify-between">
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                                    <span className={`text-sm font-medium flex items-center ${stat.up ? 'text-green-500' : 'text-red-500'}`}>
                                        {stat.up ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />}
                                        {stat.change}
                                    </span>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <FadeIn delay={0.2}>
                        <div className="bg-slate-50 dark:bg-dark-bg rounded-xl p-5 border border-gray-100 dark:border-gray-800">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Top Pages</h3>
                            <div className="space-y-3">
                                {mockData.topPages.map((page, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">{page.path}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                                                    style={{ width: `${(page.views / mockData.topPages[0].views) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                                                {page.views.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.3}>
                        <div className="bg-slate-50 dark:bg-dark-bg rounded-xl p-5 border border-gray-100 dark:border-gray-800">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Visits</h3>
                            <div className="space-y-3">
                                {mockData.recentVisits.map((visit, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">{visit.page}</span>
                                        <span className="text-xs text-gray-400">{visit.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
};

export default AnalyticsDashboard;