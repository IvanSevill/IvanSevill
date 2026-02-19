import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en'); // 'en' or 'es'

    const translations = {
        en: {
            navbar: {
                home: "Home",
                about: "About",
                experience: "Experience",
                education: "Education",
                projects: "Projects",
                contact: "Contact"
            },
            hero: {
                greeting: "HELLO, I'M",
                role: "Passionate Software Engineering Student & Aspiring Full-Stack Developer based in Seville, Spain.",
                viewWork: "View My Work",
                contactMe: "Contact Me"
            },
            about: {
                title: "About Me",
                desc1: "If I had to describe myself in two words it would be",
                desc1_highlight: "\"passive learner\"",
                desc1_cont: "—never stopping learning—and in one word it would be",
                desc2_highlight: "\"hard-worker\"",
                desc2: "I am a sociable person who thrives in team environments. As a lover of nature, I enjoy spending my free time with friends and going for long walks in the countryside.",
                growth: "Continuous Growth",
                growthDesc: "Always exploring new technologies and improving my skills.",
                team: "Team Player",
                teamDesc: "Collaborative mindset, valuing communication and shared success.",
                passions: "Passions",
                passionsDesc: "Nature lover, hiking enthusiast, and technology advocate."
            },
            experience: {
                title: "Experience",
                erasmus: {
                    role: "Erasmus Student",
                    company: "University of Pannonia",
                    period: "2024 - Current", // Assuming current year for Erasmus
                    location: "Veszprém, Hungary",
                    desc: "Studying abroad as part of the Erasmus+ program, focusing on advanced software engineering topics and adapting to an international academic environment."
                },
                student: {
                    role: "Software Engineering Student",
                    company: "University of Seville",
                    period: "2023 - Current",
                    location: "Seville, Spain",
                    desc: "Developing a strong foundation in software engineering principles, algorithms, and system design."
                },
                freelance: {
                    role: "Math and Programming Extracurricular Teacher",
                    company: "Freelance",
                    period: "01/06/2023 – 01/08/2023",
                    location: "Seville, Spain",
                    desc: [
                        "Teaching Python to two 14-year-old students.",
                        "Math tutoring for a 16-year-old student."
                    ]
                }
            },
            education: {
                title: "Education & Certifications",
                degree: "Degree in Software Engineering",
                bachelor: "Bachelor (Pre-university exams preparation)",
                education: "Education",
                certifications: "Certifications"
            },
            projects: {
                title: "Featured Projects",
                subtitle: "A selection of my recent work from GitHub.",
                viewProject: "View Project",
                openLinktree: "Open Linktree"
            },
            contact: {
                title: "Get In Touch",
                subtitle: "I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!",
                connect: "Connect on Socials",
                sayHello: "Say Hello"
            }
        },
        es: {
            navbar: {
                home: "Inicio",
                about: "Sobre Mí",
                experience: "Experiencia",
                education: "Educación",
                projects: "Proyectos",
                contact: "Contacto"
            },
            hero: {
                greeting: "HOLA, SOY",
                role: "Estudiante apasionado de Ingeniería de Software y aspirante a desarrollador Full-Stack con sede en Sevilla, España.",
                viewWork: "Ver Mi Trabajo",
                contactMe: "Contáctame"
            },
            about: {
                title: "Sobre Mí",
                desc1: "Si tuviera que describirme con dos palabras sería",
                desc1_highlight: "\"aprendiz pasivo\"",
                desc1_cont: "—nunca dejar de aprender—y en una palabra sería",
                desc2_highlight: "\"trabajador\"",
                desc2: "Soy una persona sociable que prospera en entornos de equipo. Como amante de la naturaleza, disfruto pasar mi tiempo libre con amigos y dando largos paseos por el campo.",
                growth: "Crecimiento Continuo",
                growthDesc: "Siempre explorando nuevas tecnologías y mejorando mis habilidades.",
                team: "Trabajo en Equipo",
                teamDesc: "Mentalidad colaborativa, valorando la comunicación y el éxito compartido.",
                passions: "Pasiones",
                passionsDesc: "Amante de la naturaleza, entusiasta del senderismo y defensor de la tecnología."
            },
            experience: {
                title: "Experiencia",
                erasmus: {
                    role: "Estudiante Erasmus",
                    company: "Universidad de Pannonia",
                    period: "2024 - Actualidad",
                    location: "Veszprém, Hungría",
                    desc: "Estudiando en el extranjero como parte del programa Erasmus+, centrándome en temas avanzados de ingeniería de software y adaptándome a un entorno académico internacional."
                },
                student: {
                    role: "Estudiante de Ingeniería del Software",
                    company: "Universidad de Sevilla",
                    period: "2023 - Actualidad",
                    location: "Sevilla, España",
                    desc: "Desarrollando una base sólida en principios de ingeniería de software, algoritmos y diseño de sistemas."
                },
                freelance: {
                    role: "Profesor particular de Matemáticas y Programación",
                    company: "Freelance",
                    period: "01/06/2023 – 01/08/2023",
                    location: "Sevilla, España",
                    desc: [
                        "Enseñanza de Python a dos alumnos de 14 años.",
                        "Clases de matemáticas para un estudiante de 16 años."
                    ]
                }
            },
            education: {
                title: "Educación y Certificaciones",
                degree: "Grado en Ingeniería del Software",
                bachelor: "Bachillerato (Preparación EBAU)",
                education: "Educación",
                certifications: "Certificaciones"
            },
            projects: {
                title: "Proyectos Destacados",
                subtitle: "Una selección de mi trabajo reciente en GitHub.",
                viewProject: "Ver Proyecto",
                openLinktree: "Abrir Linktree"
            },
            contact: {
                title: "Contacto",
                subtitle: "Actualmente estoy buscando nuevas oportunidades. Si tienes alguna pregunta o simplemente quieres saludar, ¡haré todo lo posible por responderte!",
                connect: "Conecta en Redes",
                sayHello: "Saludar"
            }
        }
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
            {children}
        </LanguageContext.Provider>
    );
};
