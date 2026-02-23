import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Hero = () => {
    const { t } = useLanguage();

    return (
        <section id="hero" className="min-h-screen flex items-center pt-24 pb-12 relative overflow-hidden bg-[#0f172a]">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse"></div>
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
                        <h2 className="text-xl md:text-2xl text-[var(--accent-secondary)] mb-4 font-light tracking-[0.4em] uppercase">
                            {t.hero.greeting}
                        </h2>
                        <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tighter">
                            <span className="gradient-text block">Iván</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                            {t.hero.role}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                            <a href="#projects" className="btn-primary flex items-center justify-center gap-2 group">
                                {t.hero.viewWork}
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </a>
                            <a href="#contact" className="px-8 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-all font-semibold backdrop-blur-sm">
                                {t.hero.contactMe}
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Cinematic Background Image - More visible and clearer */}
            <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full z-0 opacity-60 lg:opacity-90 pointer-events-none transition-opacity duration-1000">
                <div className="relative w-full h-full">
                    <img
                        src="/images/profile.jpg"
                        alt="Iván"
                        className="w-full h-full object-cover object-center lg:object-right brightness-50 lg:brightness-90 contrast-110"
                    />
                    {/* Softer fade to make the photo pop more */}
                    <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[#0f172a] lg:via-[#0f172a]/20 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent"></div>
                    {/* Mobile-only dark overlay for better text contrast */}
                    <div className="absolute inset-0 bg-[#0f172a]/30 lg:hidden"></div>
                </div>
            </div>

            <motion.a
                href="#about"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ delay: 1, duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-gray-500 hover:text-white hidden md:block z-20"
            >
                <ChevronDown size={32} />
            </motion.a>
        </section>
    );
};

export default Hero;
