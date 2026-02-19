import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Hero = () => {
    const { t } = useLanguage();

    return (
        <section id="hero" className="h-screen flex flex-col justify-center items-center text-center relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="z-10 px-4"
            >
                <h2 className="text-xl md:text-2xl text-[var(--accent-secondary)] mb-4 font-light tracking-wider">
                    {t.hero.greeting}
                </h2>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
                    Iván Jesús<br />Sevillano Plaza
                </h1>
                <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                    {t.hero.role}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="#projects" className="btn-primary">
                        {t.hero.viewWork}
                    </a>
                    <a href="#contact" className="px-8 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-colors font-semibold">
                        {t.hero.contactMe}
                    </a>
                </div>
            </motion.div>

            <motion.a
                href="#about"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ delay: 1, duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-gray-400 hover:text-white"
            >
                <ChevronDown size={32} />
            </motion.a>
        </section>
    );
};

export default Hero;
