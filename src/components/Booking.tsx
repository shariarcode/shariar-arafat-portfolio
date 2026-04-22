import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { CalendarIcon, XIcon } from './Icons';
import FadeIn from './FadeIn';

declare global {
    interface Window {
        Calendly?: {
            initInlineWidget: (options: { url: string; parentElement: Element }) => void;
        };
    }
}

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    calendlyUrl?: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, calendlyUrl }) => {
    const { t } = usePortfolio();

    useEffect(() => {
        if (isOpen && calendlyUrl) {
            const script = document.createElement('script');
            script.src = 'https://assets.calendly.com/assets/external/widget.js';
            script.async = true;
            document.body.appendChild(script);

            return () => {
                document.body.removeChild(script);
            };
        }
    }, [isOpen, calendlyUrl]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <FadeIn>
                <div className="relative bg-white dark:bg-dark-card rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {t.booking?.schedule || 'Schedule a Meeting'}
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <XIcon className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                    <div className="h-[600px]">
                        {calendlyUrl ? (
                            <div
                                className="calendly-inline-widget"
                                data-url={calendlyUrl}
                                style={{ minWidth: '320px', height: '600px' }}
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">
                                <p>No booking URL configured. Contact via email instead.</p>
                            </div>
                        )}
                    </div>
                </div>
            </FadeIn>
        </div>
    );
};

const Booking: React.FC = () => {
    const { content, t } = usePortfolio();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const calendlyUrl = content.bookingUrl?.trim();

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
                <CalendarIcon /> {t.booking?.book || 'Book a Call'}
            </button>
            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                calendlyUrl={calendlyUrl}
            />
        </>
    );
};

export default Booking;