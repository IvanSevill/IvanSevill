import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Briefcase, GitCommit, GitBranch, Cloud, Languages, Pencil, Plane } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GitTimeline } from './GitTimeline';

// Site theme: main lane uses the time-of-day accent; branches get fixed hues.
const LANE_COLORS = ['var(--accent-primary)', '#a78bfa', '#38bdf8', '#fb923c', '#4ade80'];

const Experience = () => {
    const { t } = useTranslation();

    // Order is irrelevant — GitTimeline sorts by date and lays out lanes itself.
    const items = [
        {
            id: 'master',
            title: t('experience.master.role'),
            subtitle: t('experience.master.company'),
            meta: t('experience.master.period'),
            location: t('experience.master.location'),
            description: t('experience.master.desc'),
            icon: <Cloud size={22} className="text-[var(--accent-primary)]" />,
            badges: [t('experience.master.badge')],
            start: '2027-09-01',
            end: '2029-06-30',
        },
        {
            id: 'ielts',
            title: t('experience.ielts.role'),
            subtitle: t('experience.ielts.company'),
            meta: t('experience.ielts.period'),
            description: t('experience.ielts.desc'),
            icon: <Languages size={20} className="text-sky-400" />,
            badges: [t('experience.ielts.badge')],
            mergedLabel: t('experience.git.merged'),
            start: '2026-06-01',
            end: '2026-08-01',
        },
        {
            id: 'seville',
            title: t('experience.student.role'),
            subtitle: t('experience.student.company'),
            meta: t('experience.student.period'),
            location: t('experience.student.location'),
            description: t('experience.student.desc', { returnObjects: true }),
            image: '/images/SoftwEng.jpeg',
            icon: <GitCommit size={24} className="text-[var(--accent-primary)]" />,
            badges: [t('experience.git.main')],
            current: true,
            start: '2023-09-01',
            end: '2027-06-30',
        },
        {
            id: 'erasmus',
            title: t('experience.erasmus.role'),
            subtitle: t('experience.erasmus.company'),
            meta: t('experience.erasmus.period'),
            location: t('experience.erasmus.location'),
            description: t('experience.erasmus.desc'),
            icon: <Plane size={20} className="text-purple-400" />,
            badges: [t('experience.git.branch')],
            mergedLabel: t('experience.git.merged'),
            start: '2024-09-01',
            end: '2025-06-30',
        },
        {
            id: 'freelance',
            title: t('experience.freelance.role'),
            subtitle: t('experience.freelance.company'),
            meta: t('experience.freelance.period'),
            location: t('experience.freelance.location'),
            description: t('experience.freelance.desc', { returnObjects: true }),
            icon: <Pencil size={24} className="text-green-400" />,
            start: '2023-06-01',
            end: '2023-08-01',
        },
        {
            id: 'indra',
            title: t('experience.indra.role'),
            subtitle: t('experience.indra.company'),
            meta: t('experience.indra.period'),
            location: t('experience.indra.location'),
            description: t('experience.indra.desc', { returnObjects: true }),
            icon: <Briefcase size={24} className="text-purple-400" />,
            start: '2027-01-01',
            end: '2027-06-01',
        },
    ];

    return (
        <section id="experience" className="section">
            <div className="container">
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('experience.title')}</h2>
                    <div className="w-20 h-1 bg-[var(--accent-secondary)] mx-auto rounded-full"></div>
                </Motion.div>

                <GitTimeline items={items} laneColors={LANE_COLORS} surfaceColor="#05050a" />
            </div>
        </section>
    );
};

export default Experience;
