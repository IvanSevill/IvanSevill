import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Hero = () => {
    const { t } = useLanguage();

    return (
        <section id="hero" className="min-h-screen flex items-center pt-24 pb-12 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="container grid lg:grid-cols-2 gap-12 items-center">

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, x: 30 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="order-1 lg:order-2 flex justify-center lg:justify-end px-4"
                >
                    <div className="relative group w-full max-w-[300px] sm:max-w-md">
                        {/* Decorative glow */}
                        <div className="absolute -inset-4 bg-gradient-to-tr from-[var(--accent-primary)]/20 to-transparent rounded-[2.5rem] blur-2xl -z-10 opacity-60"></div>

                        <div className="relative z-10 rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-xl p-3 shadow-2xl overflow-hidden group">
                            <img
                                src="/images/profile.jpg"
                                alt="IvanSevill"
                                className="w-full h-auto rounded-[2rem] grayscale group-hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-[1.02]"
                            />
                            <div className="absolute top-8 right-8 bg-green-500/80 backdrop-blur-md text-[#0f172a] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                                Life & Tech
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center lg:text-left order-2 lg:order-1 px-4"
                >
                    <h2 className="text-xl md:text-2xl text-[var(--accent-secondary)] mb-4 font-light tracking-[0.3em] uppercase">
                        {t.hero.greeting}
                    </h2>
                    <h1 className="text-5xl md:text-7xl xl:text-8xl font-bold mb-6 gradient-text leading-tight">
                        IvanSevill
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

            <motion.a
                href="#about"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ delay: 1, duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-gray-500 hover:text-white hidden md:block"
            >
                <ChevronDown size={32} />
            </motion.a>
        </section>
    );
};

export default Hero;
