import React, { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import { Menu, X, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import TimeIndicator from './TimeIndicator';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const links = [
        { name: t('navbar.home'), href: '#hero' },
        { name: t('navbar.about'), href: '#about' },
        { name: t('navbar.experience'), href: '#experience' },
        { name: t('navbar.education'), href: '#education' },
        { name: t('navbar.projects'), href: '#projects' },
        { name: t('navbar.contact'), href: '#contact' },
    ];

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en');
    };

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#05050a]/95 py-4 border-b border-[var(--accent-primary)]/20' : 'bg-transparent py-6'
                }`}
        >
            <div className="container flex justify-between items-center">
                <a href="#hero" className="text-xl font-bold">
                    <span className="text-[var(--accent-primary)]">~/</span>ivansevill
                </a>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    {links.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="relative hover:text-[var(--accent-primary)] transition-colors text-sm uppercase tracking-wide font-medium before:content-['>_'] before:absolute before:-left-4 before:text-[var(--accent-primary)] before:opacity-0 hover:before:opacity-100 before:transition-opacity"
                        >
                            {link.name}
                        </a>
                    ))}

                    <TimeIndicator />

                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-2 px-3 py-1 rounded-none border border-[var(--accent-primary)]/30 hover:bg-[var(--accent-primary)]/10 hover:border-[var(--accent-primary)] transition-colors text-sm"
                    >
                        <Globe size={16} />
                        <span className="uppercase">{i18n.language}</span>
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-4">
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-2 px-3 py-1 rounded-none border border-[var(--accent-primary)]/30 hover:bg-[var(--accent-primary)]/10 transition-colors text-sm"
                    >
                        <span className="uppercase">{i18n.language}</span>
                    </button>
                    <button
                        className="text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label={isOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isOpen}
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <Motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden absolute top-full left-0 w-full bg-[#05050a]/98 border-b border-[var(--accent-primary)]/20"
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
                </Motion.div>
            )}
        </nav>
    );
};

export default Navbar;
