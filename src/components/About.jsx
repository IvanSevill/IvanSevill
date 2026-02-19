import React from 'react';
import { motion } from 'framer-motion';
import { User, Heart, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const About = () => {
    const { t } = useLanguage();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <section id="about" className="section relative">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.about.title}</h2>
                    <div className="w-20 h-1 bg-[var(--accent-primary)] mx-auto rounded-full"></div>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="card"
                    >
                        <p className="text-lg leading-relaxed text-gray-300 mb-6">
                            {t.about.desc1} <span className="text-[var(--accent-primary)] font-semibold">{t.about.desc1_highlight}</span>
                            {t.about.desc1_cont} <span className="text-[var(--accent-secondary)] font-semibold">{t.about.desc2_highlight}</span>.
                        </p>
                        <p className="text-lg leading-relaxed text-gray-300">
                            {t.about.desc2}
                        </p>
                    </motion.div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid gap-6"
                    >
                        <motion.div variants={item} className="card flex items-start gap-4 hover:border-[var(--accent-primary)]">
                            <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                                <Zap size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">{t.about.growth}</h3>
                                <p className="text-gray-400">{t.about.growthDesc}</p>
                            </div>
                        </motion.div>

                        <motion.div variants={item} className="card flex items-start gap-4 hover:border-[var(--accent-secondary)]">
                            <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
                                <User size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">{t.about.team}</h3>
                                <p className="text-gray-400">{t.about.teamDesc}</p>
                            </div>
                        </motion.div>

                        <motion.div variants={item} className="card flex items-start gap-4 hover:border-green-500/50">
                            <div className="p-3 bg-green-500/20 rounded-lg text-green-400">
                                <Heart size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">{t.about.passions}</h3>
                                <p className="text-gray-400">{t.about.passionsDesc}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
