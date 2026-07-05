import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTimeMode } from '../context/TimeModeContext';

const Hero = () => {
    const { t } = useTranslation();
    const { resolvedPeriod } = useTimeMode();

    return (
        <section id="hero" className="min-h-screen flex items-end lg:items-center pt-24 pb-32 lg:pb-12 relative overflow-hidden bg-[#05050a]">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--accent-primary)]/10 rounded-full blur-[120px] animate-pulse"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center lg:text-left z-20"
                    >
                        <p className="text-sm text-[var(--accent-primary)]/70 mb-3 tracking-wide">
                            {t(`hero.bootLine.${resolvedPeriod}`)}
                        </p>
                        <h2 className="text-xl md:text-2xl text-[var(--accent-secondary)] mb-4 font-light tracking-[0.4em] uppercase">
                            <span className="text-[var(--accent-primary)]">$ </span>{t('hero.greeting')}
                        </h2>
                        <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tighter">
                            <span className="gradient-text">Iván</span><span className="cursor-blink h-[0.85em] align-middle"></span>
                        </h1>
                        <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                            {t('hero.role')}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                            <a href="#projects" className="btn-primary flex items-center justify-center gap-2 group">
                                {t('hero.viewWork')}
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </a>
                            <a href="#contact" className="btn-outline">
                                {t('hero.contactMe')}
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Cinematic Background Image */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="relative w-full h-full">
                    <img
                        src="/images/profile.jpg"
                        alt="Iván"
                        className="w-full h-full object-cover object-top scale-[1.15] -translate-y-[15%] -translate-x-[5%] lg:translate-x-[20%] lg:translate-y-0 lg:object-right lg:scale-110 brightness-90 lg:brightness-[0.8] contrast-105 transition-transform duration-1000"
                    />
                    {/* Time-of-day accent tint */}
                    <div className="absolute inset-0 bg-[var(--accent-primary)]/10 mix-blend-color"></div>

                    {/* Mobile: Gradient covering only the bottom to center the "air" */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05050a] via-[#05050a]/70 to-transparent lg:hidden"></div>

                    {/* Desktop: Solid black on the left that fades out to the right - NO MORE CUTS */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#05050a] via-[#05050a] via-[35%] to-transparent hidden lg:block"></div>

                    {/* Bottom blend for section continuity */}
                    <div className="absolute inset-x-0 bottom-0 h-1/6 bg-gradient-to-t from-[#05050a] to-transparent z-10"></div>
                </div>
            </div>

            <motion.a
                href="#about"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ delay: 1, duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hidden md:block z-20"
            >
                <ChevronDown size={32} />
            </motion.a>
        </section>
    );
};

export default Hero;
