import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ExternalLink, Instagram } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
    const { t } = useLanguage();

    return (
        <section id="contact" className="section">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.contact.title}</h2>
                    <div className="w-20 h-1 bg-[var(--accent-secondary)] mx-auto rounded-full mb-6"></div>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        {t.contact.subtitle}
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="card space-y-8"
                    >
                        <h3 className="text-2xl font-bold mb-6">Contact Information</h3>

                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/20 rounded-full text-blue-400">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-300">Email</h4>
                                <a href="mailto:ivansevillano2005@gmail.com" className="hover:text-[var(--accent-primary)] transition-colors">
                                    ivansevillano2005@gmail.com
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-500/20 rounded-full text-green-400">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-300">Phone</h4>
                                <a href="tel:+34603438647" className="hover:text-[var(--accent-primary)] transition-colors">
                                    (+34) 603 438 647
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-500/20 rounded-full text-purple-400">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-300">Location</h4>
                                <p className="text-gray-400">
                                    Virgen de Guadalupe B25 1E<br />41620 Seville (Spain)
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Social Links / Message Form Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col justify-center space-y-6"
                    >
                        <div className="card text-center p-8 hover:border-[var(--accent-primary)] group">
                            <h3 className="text-2xl font-bold mb-4">{t.contact.connect}</h3>
                            <div className="flex justify-center gap-4">
                                <a
                                    href="https://www.instagram.com/ivansevill/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-4 bg-white/5 rounded-full hover:bg-pink-600 hover:scale-110 transition-all"
                                >
                                    <Instagram size={32} />
                                </a>
                                <a
                                    href="https://linktr.ee/IvanSevill"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-4 bg-white/5 rounded-full hover:bg-green-600 hover:scale-110 transition-all"
                                >
                                    <ExternalLink size={32} />
                                </a>
                            </div>
                        </div>

                        <div className="card text-center p-8">
                            <p className="text-gray-300 mb-6">
                                "The only way to do great work is to love what you do."
                            </p>
                            <a href="mailto:ivansevillano2005@gmail.com" className="btn-primary inline-block">
                                {t.contact.sayHello}
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
