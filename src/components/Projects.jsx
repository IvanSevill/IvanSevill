import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Monitor, Scissors, Cpu, Camera, Database, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Projects = () => {
    const { t, language } = useLanguage();
    const [showAll, setShowAll] = useState(false);

    const projects = [
        {
            title: t.aissMiner.title,
            description: {
                en: t.aissMiner.description,
                es: t.aissMiner.description
            },
            tags: ["Java", "Spring Boot", "Microservices", "Docker"],
            link: "https://github.com/IvanSevill/AISS-Miner",
            icon: <Database size={40} className="text-orange-400" />,
            image: "/images/aiss-miner.jpg"
        },
        {
            title: "Usb-GPT",
            description: {
                en: "Only working interface with loaded models to use on a USB or a HardDisk to talk with an Artificial Intelligence model offline.",
                es: "Única interfaz funcional con modelos cargados para usar en un USB o disco duro para hablar con un modelo de Inteligencia Artificial sin conexión."
            },
            tags: ["Python", "AI", "Local-LLM"],
            link: "https://github.com/IvanSevill/Usb-GPT",
            icon: <Cpu size={40} className="text-blue-400" />,
            image: "/images/usb-gpt.jpg"
        },
        {
            title: "RockPaperScissors",
            description: {
                en: "AI-powered Rock-Paper-Scissors game using MediaPipe for real-time hand gesture recognition. Built with React (Vite) and FastAPI.",
                es: "Juego de Piedra, Papel o Tijera impulsado por IA usando MediaPipe para reconocimiento de gestos en tiempo real. Construido con React (Vite) y FastAPI."
            },
            tags: ["React", "FastAPI", "MediaPipe", "Computer Vision"],
            link: "https://github.com/IvanSevill/RockPaperScissors",
            icon: <Scissors size={40} className="text-yellow-400" />,
            image: "/images/rock-paper-scissors.jpg"
        },
        {
            title: "AI-travel-assistant",
            description: {
                en: "Interactive web application built with Streamlit that generates detailed, day-by-day travel itineraries using Google Gemini and GoogleTTS.",
                es: "Aplicación web interactiva construida con Streamlit que genera itinerarios de viaje detallados día a día utilizando Google Gemini y GoogleTTS."
            },
            tags: ["Streamlit", "Gemini API", "Python", "TTS"],
            link: "https://github.com/IvanSevill/AI-travel-assistant",
            icon: <Monitor size={40} className="text-green-400" />,
            image: "/images/ai-travel-assistant.jpg"
        },
        {
            title: "LensPortExtension",
            description: {
                en: "A browser extension that replicates Google Lens functionality. Performs real-time OCR and translation on any webpage area.",
                es: "Una extensión de navegador que replica la funcionalidad de Google Lens. Realiza OCR y traducción en tiempo real en cualquier área de una página web."
            },
            tags: ["JavaScript", "Browser Extension", "OCR", "Flask"],
            link: "https://github.com/IvanSevill/LensPortExtension",
            icon: <Camera size={40} className="text-red-400" />,
            image: "/images/lens-port-extension.jpg"
        }
    ];

    const visibleProjects = showAll ? projects : projects.slice(0, 3);

    const handleShowAll = () => {
        if (showAll) {
            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        }
        setShowAll(!showAll);
    };

    return (
        <section id="projects" className="section py-24">
            <div className="container px-6 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.projects.title}</h2>
                    <div className="w-20 h-1 bg-[var(--accent-primary)] mx-auto rounded-full mb-6"></div>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        {t.projects.subtitle}
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    <AnimatePresence mode="popLayout">
                        {visibleProjects.map((project, index) => (
                            <motion.div
                                key={project.title}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                layout
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="group relative"
                            >
                                <div className="absolute -inset-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-[2rem] transition-all duration-500 group-hover:from-[var(--accent-primary)]/40 group-hover:to-[var(--accent-secondary)]/10"></div>

                                <div className="relative h-full bg-[#111111]/80 backdrop-blur-xl rounded-[2rem] overflow-hidden flex flex-col border border-white/5 shadow-2xl transition-all duration-500 hover:-translate-y-2">
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute bottom-4 left-6 z-10 p-2.5 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 shadow-lg text-white">
                                            {React.cloneElement(project.icon, { size: 24, className: project.icon.props.className + " !opacity-100" })}
                                        </div>
                                        {project.isEarly && (
                                            <div className="absolute top-4 right-4 bg-yellow-500/10 backdrop-blur-md text-yellow-500 text-[9px] px-2 py-1 rounded-full border border-yellow-500/20 font-bold uppercase tracking-widest z-10">
                                                Alpha
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-8 pb-6 flex flex-col flex-grow">
                                        <h3 className="text-xl font-bold mb-4 tracking-tight group-hover:text-[var(--accent-primary)] transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm leading-relaxed mb-6 font-light line-clamp-3">
                                            {project.description[language]}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                                            {project.tags.map((tag, i) => (
                                                <span key={i} className="text-[9px] font-bold uppercase tracking-widest bg-white/5 text-gray-400 px-3 py-1.5 rounded-lg border border-white/5 group-hover:border-[var(--accent-primary)]/20 group-hover:text-white transition-all">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 text-xs font-bold text-[var(--accent-primary)] group/link pt-4 border-t border-white/5">
                                            <span className="group-hover/link:translate-x-1 transition-transform">{t.projects.viewProject}</span>
                                            <Github size={16} className="group-hover/link:rotate-12 transition-transform" />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* View More Button */}
                <div className="text-center mt-12 flex flex-col items-center gap-6">
                    <button
                        onClick={handleShowAll}
                        className="flex items-center gap-2 px-8 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[var(--accent-primary)]/30 transition-all font-bold text-sm uppercase tracking-widest text-gray-300 hover:text-white"
                    >
                        {showAll ? (
                            <> {language === 'en' ? 'Show Less' : 'Ver menos'} <ChevronUp size={20} /> </>
                        ) : (
                            <> {language === 'en' ? 'Show More' : 'Ver más'} <ChevronDown size={20} /> </>
                        )}
                    </button>

                    <div className="mt-8">
                        <a
                            href="https://linktr.ee/IvanSevill"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            {t.projects.openLinktree} <ExternalLink size={18} />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Projects;
