import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Mail, MapPin, ExternalLink, Instagram } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Contact = () => {
    const { t } = useTranslation();

    return (
        <section id="contact" className="section">
            <div className="container">
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('contact.title')}</h2>
                    <div className="w-20 h-1 bg-[var(--accent-secondary)] mx-auto rounded-full mb-6"></div>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        {t('contact.subtitle')}
                    </p>
                </Motion.div>

                <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                    <Motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="card space-y-8"
                    >
                        <h3 className="text-2xl font-bold mb-6">{t('contact.info.title')}</h3>

                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/20 rounded-full text-blue-400">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-300">{t('contact.info.email')}</h4>
                                <a href="mailto:ivansevillano2005@gmail.com" className="hover:text-[var(--accent-primary)] transition-colors">
                                    ivansevillano2005@gmail.com
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-500/20 rounded-full text-purple-400">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-300">{t('contact.info.location')}</h4>
                                <p className="text-gray-400">
                                    {t('contact.info.city')}
                                </p>
                            </div>
                        </div>
                    </Motion.div>

                    {/* Social Links / Message Form Placeholder */}
                    <Motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col justify-center space-y-6"
                    >
                        <div className="card text-center p-8 hover:border-[var(--accent-primary)] group">
                            <h3 className="text-2xl font-bold mb-4">{t('contact.connect')}</h3>
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
                                "{t('contact.quote')}"
                            </p>
                            <a href="mailto:ivansevillano2005@gmail.com" className="btn-primary inline-block">
                                {t('contact.sayHello')}
                            </a>
                        </div>
                    </Motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
