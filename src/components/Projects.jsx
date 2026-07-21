import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Monitor, Scissors, Cpu, Camera, Database, Dumbbell, Thermometer, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Projects = () => {
    const { t } = useTranslation();
    const [showAll, setShowAll] = useState(false);

    const projects = [
        {
            key: "gymhub",
            tags: ["FastAPI", "React", "Android", "SQLite"],
            link: "https://github.com/IvanSevill/GymHub",
            icon: <Dumbbell size={40} className="text-sky-400" />,
            image: "/images/gymhub.svg"
        },
        {
            key: "aissMiner",
            tags: ["Java", "Spring Boot", "Microservices", "Docker"],
            link: "https://github.com/IvanSevill/AISS-Miner",
            icon: <Database size={40} className="text-orange-400" />,
            image: "/images/aiss-miner.svg"
        },
        {
            key: "heatDistribution",
            tags: ["C++", "OpenMP", "Raylib", "HPC"],
            link: "https://github.com/IvanSevill/HeatDistribution",
            icon: <Thermometer size={40} className="text-rose-400" />,
            image: "/images/heat-distribution.svg"
        },
        {
            key: "usbGpt",
            tags: ["Python", "AI", "Local-LLM"],
            link: "https://github.com/IvanSevill/Usb-GPT",
            icon: <Cpu size={40} className="text-blue-400" />,
            image: "/images/usb-gpt.svg"
        },
        {
            key: "rockPaperScissors",
            tags: ["React", "FastAPI", "MediaPipe", "Computer Vision"],
            link: "https://github.com/IvanSevill/RockPaperScissors",
            icon: <Scissors size={40} className="text-yellow-400" />,
            image: "/images/rock-paper-scissors.svg"
        },
        {
            key: "aiTravelAssistant",
            tags: ["Streamlit", "Gemini API", "Python", "TTS"],
            link: "https://github.com/IvanSevill/AI-travel-assistant",
            icon: <Monitor size={40} className="text-green-400" />,
            image: "/images/ai-travel-assistant.svg"
        },
        {
            key: "lensPortExtension",
            tags: ["JavaScript", "Browser Extension", "OCR", "Flask"],
            link: "https://github.com/IvanSevill/LensPortExtension",
            icon: <Camera size={40} className="text-red-400" />,
            image: "/images/lens-port-extension.svg"
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
        <section id="projects" className="section bg-black/20 py-24">
            <div className="container px-6 mx-auto">
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('projects.title')}</h2>
                    <div className="w-20 h-1 bg-[var(--accent-primary)] mx-auto rounded-full mb-6"></div>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        {t('projects.subtitle')}
                    </p>
                </Motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    <AnimatePresence mode="popLayout">
                        {visibleProjects.map((project, index) => (
                            <Motion.div
                                key={project.key}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                layout
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="group relative"
                            >
                                <div className="relative h-full bg-[#08080c] rounded-none overflow-hidden flex flex-col border border-[var(--accent-primary)]/20 transition-all duration-500 hover:-translate-y-2 hover:border-[var(--accent-primary)] hover:shadow-[0_0_24px_-4px_var(--accent-glow)]">
                                    <div className="terminal-bar text-[var(--text-secondary)]">
                                        <span className="terminal-dot"></span>
                                        <span className="terminal-dot"></span>
                                        <span className="terminal-dot"></span>
                                    </div>
                                    <div className="relative h-44 w-full overflow-hidden">
                                        <img src={project.image} alt={t(`projects.list.${project.key}.title`)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute bottom-4 left-6 z-10 p-2.5 bg-black/50 rounded-none border border-white/10 text-white">
                                            {React.cloneElement(project.icon, { size: 24, className: project.icon.props.className + " !opacity-100" })}
                                        </div>
                                        {project.isEarly && (
                                            <div className="absolute top-4 right-4 bg-black/60 text-[var(--accent-primary)] text-[9px] px-2 py-1 rounded-none border border-[var(--accent-primary)]/40 font-bold uppercase tracking-widest z-10">
                                                Alpha
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-8 pb-6 flex flex-col flex-grow">
                                        <h3 className="text-xl font-bold mb-4 tracking-tight group-hover:text-[var(--accent-primary)] transition-colors">
                                            {t(`projects.list.${project.key}.title`)}
                                        </h3>
                                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6 font-light line-clamp-3">
                                            {t(`projects.list.${project.key}.description`)}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                                            {project.tags.map((tag, i) => (
                                                <span key={i} className="text-[9px] font-bold uppercase tracking-widest bg-white/5 text-[var(--text-secondary)] px-3 py-1.5 rounded-none border border-white/10 group-hover:border-[var(--accent-primary)]/40 group-hover:text-white transition-all">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 text-xs font-bold text-[var(--accent-primary)] group/link pt-4 border-t border-white/10">
                                            <span className="group-hover/link:translate-x-1 transition-transform">{t('projects.viewProject')}</span>
                                            <Github size={16} className="group-hover/link:rotate-12 transition-transform" />
                                        </a>
                                    </div>
                                </div>
                            </Motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* View More Button */}
                <div className="text-center mt-12 flex flex-col items-center gap-6">
                    <button
                        onClick={handleShowAll}
                        className="flex items-center gap-2 px-8 py-3 rounded-none border border-[var(--accent-primary)]/30 bg-white/5 hover:bg-[var(--accent-primary)]/10 hover:border-[var(--accent-primary)] transition-all font-bold text-sm uppercase tracking-widest text-[var(--text-secondary)] hover:text-white"
                    >
                        {showAll ? (
                            <> {t('projects.showLess')} <ChevronUp size={20} /> </>
                        ) : (
                            <> {t('projects.showMore')} <ChevronDown size={20} /> </>
                        )}
                    </button>

                    <div className="mt-8">
                        <a
                            href="https://linktr.ee/IvanSevill"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            {t('projects.openLinktree')} <ExternalLink size={18} />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Projects;
