import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Building2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Experience = () => {
    const { t } = useLanguage();

    const experiences = [
        {
            title: t.experience.erasmus.company,
            role: t.experience.erasmus.role,
            period: t.experience.erasmus.period,
            location: t.experience.erasmus.location,
            description: [t.experience.erasmus.desc],
            icon: <Building2 size={24} className="text-purple-400" />
        },
        {
            title: t.experience.student.company,
            role: t.experience.student.role,
            period: t.experience.student.period,
            location: t.experience.student.location,
            description: [t.experience.student.desc],
            icon: <Building2 size={24} className="text-purple-400" />
        },
        {
            title: t.experience.freelance.company,
            role: t.experience.freelance.role,
            period: t.experience.freelance.period,
            location: t.experience.freelance.location,
            description: t.experience.freelance.desc,
            icon: <Briefcase size={24} className="text-blue-400" />
        }
    ];

    return (
        <section id="experience" className="section bg-black/20">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.experience.title}</h2>
                    <div className="w-20 h-1 bg-[var(--accent-secondary)] mx-auto rounded-full"></div>
                </motion.div>

                <div className="max-w-3xl mx-auto">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="timeline-item pl-8 pb-8 last:pb-0"
                        >
                            <div className="card relative">
                                <div className="absolute -left-[3.25rem] top-0 p-2 bg-[var(--bg-color)] border border-[var(--accent-secondary)] rounded-full z-10 hidden md:block">
                                    {exp.icon}
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-[var(--accent-primary)]">{exp.role}</h3>
                                        <h4 className="text-lg font-semibold text-gray-300">{exp.title}</h4>
                                    </div>
                                    <div className="text-sm text-gray-400 mt-2 md:mt-0 bg-white/5 px-3 py-1 rounded-full inline-block">
                                        {exp.period}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                                    <Briefcase size={14} /> {exp.location}
                                </p>
                                <ul className="list-disc list-inside text-gray-300 space-y-2">
                                    {exp.description.map((desc, i) => (
                                        <li key={i}>{desc}</li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
