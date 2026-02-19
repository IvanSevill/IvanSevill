import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Education = () => {
    const { t } = useLanguage();

    const education = [
        {
            degree: t.education.degree,
            institution: "University of Seville",
            period: "2023 – Current",
            details: [
                "Field of study: Information and Communication Technologies",
                "Focus on Software Development and Engineering Principles"
            ]
        },
        {
            degree: t.education.bachelor,
            institution: "I.E.S. Lopez de Arenas",
            period: "2021 – 2023",
            details: ["Pre-university preparation with focus on technical sciences."]
        }
    ];

    const certifications = [
        {
            title: "Introduction to Data Science",
            issuer: "Cisco Networking Academy",
            date: "27/12/2025"
        },
        {
            title: "CCNA: Introduction to Networks",
            issuer: "Cisco Networking Academy",
            date: "29/12/2025"
        },
        {
            title: "Computer Security",
            issuer: "Cisco Networking Academy",
            date: "29/12/2025"
        }
    ];

    return (
        <section id="education" className="section">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.education.title}</h2>
                    <div className="w-20 h-1 bg-[var(--accent-primary)] mx-auto rounded-full"></div>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Education Column */}
                    <div>
                        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                            <GraduationCap className="text-[var(--accent-primary)]" /> {t.education.education}
                        </h3>
                        <div className="space-y-8">
                            {education.map((edu, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="card group hover:border-[var(--accent-primary)]"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-xl font-bold group-hover:text-[var(--accent-primary)] transition-colors">{edu.degree}</h4>
                                        <span className="text-xs bg-white/10 px-2 py-1 rounded text-nowrap ml-2">{edu.period}</span>
                                    </div>
                                    <h5 className="text-lg text-gray-400 mb-4">{edu.institution}</h5>
                                    <ul className="text-gray-300 text-sm list-disc list-inside">
                                        {edu.details.map((detail, i) => (
                                            <li key={i}>{detail}</li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Certifications Column */}
                    <div>
                        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                            <Award className="text-[var(--accent-secondary)]" /> {t.education.certifications}
                        </h3>
                        <div className="space-y-4">
                            {certifications.map((cert, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="card py-4 px-6 flex items-center justify-between hover:bg-white/5 transition-colors"
                                >
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">{cert.title}</h4>
                                        <p className="text-sm text-gray-400">{cert.issuer}</p>
                                    </div>
                                    <span className="text-xs text-gray-500 border border-gray-700 px-2 py-1 rounded">{cert.date}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Education;
