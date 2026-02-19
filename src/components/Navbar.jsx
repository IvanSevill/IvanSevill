import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { language, setLanguage, t } = useLanguage();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const links = [
        { name: t.navbar.home, href: '#hero' },
        { name: t.navbar.about, href: '#about' },
        { name: t.navbar.experience, href: '#experience' },
        { name: t.navbar.education, href: '#education' },
        { name: t.navbar.projects, href: '#projects' },
        { name: t.navbar.contact, href: '#contact' },
    ];

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'es' : 'en');
    };

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md py-4 shadow-lg' : 'bg-transparent py-6'
                }`}
        >
            <div className="container flex justify-between items-center">
                <a href="#hero" className="text-2xl font-bold gradient-text">IVÁN</a>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    {links.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="hover:text-[var(--accent-primary)] transition-colors text-sm uppercase tracking-wide font-medium"
                        >
                            {link.name}
                        </a>
                    ))}

                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-sm"
                    >
                        <Globe size={16} />
                        <span className="uppercase">{language}</span>
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-4">
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-sm"
                    >
                        <span className="uppercase">{language}</span>
                    </button>
                    <button
                        className="text-white"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10"
                >
                    <div className="flex flex-col items-center py-8 space-y-6">
                        {links.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-lg font-medium hover:text-[var(--accent-primary)]"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>
                </motion.div>
            )}
        </nav>
    );
};

export default Navbar;
