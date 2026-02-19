import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Monitor, Scissors, Cpu, Camera, Wallet } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Projects = () => {
    const { t, language } = useLanguage();

    const projects = [
        {
            title: "Usb-GPT",
            description: {
                en: "Only working interface with loaded models to use on a USB or a HardDisk to talk with an Artificial Intelligence model offline.",
                es: "Única interfaz funcional con modelos cargados para usar en un USB o disco duro para hablar con un modelo de Inteligencia Artificial sin conexión."
            },
            tags: ["Python", "AI", "Local-LLM"],
            link: "https://github.com/IvanSevill/Usb-GPT",
            icon: <Cpu size={40} className="text-blue-400" />
        },
        {
            title: "RockPaperScissors",
            description: {
                en: "AI-powered Rock-Paper-Scissors game using MediaPipe for real-time hand gesture recognition. Built with React (Vite) and FastAPI.",
                es: "Juego de Piedra, Papel o Tijera impulsado por IA usando MediaPipe para reconocimiento de gestos en tiempo real. Construido con React (Vite) y FastAPI."
            },
            tags: ["React", "FastAPI", "MediaPipe", "Computer Vision"],
            link: "https://github.com/IvanSevill/RockPaperScissors",
            icon: <Scissors size={40} className="text-yellow-400" />
        },
        {
            title: "AI-travel-assistant",
            description: {
                en: "Interactive web application built with Streamlit that generates detailed, day-by-day travel itineraries using Google Gemini and GoogleTTS.",
                es: "Aplicación web interactiva construida con Streamlit que genera itinerarios de viaje detallados día a día utilizando Google Gemini y GoogleTTS."
            },
            tags: ["Streamlit", "Gemini API", "Python", "TTS"],
            link: "https://github.com/IvanSevill/AI-travel-assistant",
            icon: <Monitor size={40} className="text-green-400" />
        },
        {
            title: "LensPortExtension",
            description: {
                en: "A browser extension that replicates Google Lens functionality. Performs real-time OCR and translation on any webpage area.",
                es: "Una extensión de navegador que replica la funcionalidad de Google Lens. Realiza OCR y traducción en tiempo real en cualquier área de una página web."
            },
            tags: ["JavaScript", "Browser Extension", "OCR", "Flask"],
            link: "https://github.com/IvanSevill/LensPortExtension",
            icon: <Camera size={40} className="text-red-400" />
        },
        {
            title: "BudgetBuddy",
            description: {
                en: "Hackathon 2023-2024 Project for University of Seville - Telefonica. Financial management tool.",
                es: "Proyecto Hackathon 2023-2024 para la Universidad de Sevilla - Telefónica. Herramienta de gestión financiera."
            },
            tags: ["Hackathon", "Finance", "Team Project"],
            link: "https://github.com/IvanSevill/BudgetBuddy",
            icon: <Wallet size={40} className="text-purple-400" />
        }
    ];

    return (
        <section id="projects" className="section bg-black/30">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.projects.title}</h2>
                    <div className="w-20 h-1 bg-[var(--accent-primary)] mx-auto rounded-full mb-6"></div>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        {t.projects.subtitle}
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -10 }}
                            transition={{ delay: index * 0.1 }}
                            className="card group overflow-hidden relative flex flex-col h-full"
                        >
                            <div className="absolute top-4 right-4 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                {project.icon}
                            </div>

                            <h3 className="text-2xl font-bold mb-3 pr-12 group-hover:text-[var(--accent-primary)] transition-colors">
                                {project.title}
                            </h3>

                            <p className="text-gray-300 mb-6 flex-grow text-sm">
                                {project.description[language]}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {project.tags.map((tag, i) => (
                                    <span key={i} className="text-xs font-mono bg-white/10 text-[var(--accent-secondary)] px-2 py-1 rounded">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-[var(--accent-primary)] font-semibold hover:underline mt-auto"
                            >
                                {t.projects.viewProject} <Github size={16} />
                            </a>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <a
                        href="https://linktr.ee/IvanSevill"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary inline-flex items-center gap-2"
                    >
                        {t.projects.openLinktree} <ExternalLink size={18} />
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default Projects;
