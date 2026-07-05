import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTimeMode } from '../context/TimeModeContext';
import { MODE_REFERENCE_HOUR } from '../hooks/useTimeOfDay';

const TRACK_LENGTH = 10;
// One character per slot across the 24h day — a small sun/moon arc:
// deep night -> dawn -> high sun -> dusk -> night again.
const SLOT_CHARS = ['C', 'C', 'o', 'o', 'O', 'O', 'O', 'o', 'o', 'C'];

const buildTrack = (hour) => {
    const fraction = ((hour % 24) + 24) % 24 / 24;
    const pos = Math.min(TRACK_LENGTH - 1, Math.floor(fraction * TRACK_LENGTH));
    const marker = SLOT_CHARS[pos];
    return Array.from({ length: TRACK_LENGTH }, (_, i) => (i === pos ? marker : '-')).join('');
};

const TimeIndicator = () => {
    const { t } = useTranslation();
    const { mode, cycleMode } = useTimeMode();
    const [now, setNow] = useState(() => new Date());
    const [showCard, setShowCard] = useState(false);

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 30000);
        return () => clearInterval(id);
    }, []);

    const hour = mode === 'auto'
        ? now.getHours() + now.getMinutes() / 60
        : MODE_REFERENCE_HOUR[mode];

    const track = buildTrack(hour);

    const handleClick = () => {
        cycleMode();
        setShowCard(true);
    };

    useEffect(() => {
        if (!showCard) return undefined;
        const id = setTimeout(() => setShowCard(false), 1800);
        return () => clearTimeout(id);
    }, [showCard, mode]);

    return (
        <div className="relative">
            <button
                onClick={handleClick}
                title={mode === 'auto' ? now.toLocaleTimeString() : t(`timeMode.${mode}`)}
                className="flex items-center gap-2 px-2.5 py-1 border border-[var(--accent-primary)]/30 hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 transition-colors"
            >
                <span className="font-mono text-xs tracking-widest text-[var(--accent-primary)] select-none">
                    {track}
                </span>
            </button>

            <AnimatePresence>
                {showCard && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-2 z-50 whitespace-nowrap bg-[#08080c] border border-[var(--accent-primary)] px-3 py-2 shadow-[0_0_20px_-4px_var(--accent-glow)]"
                    >
                        <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent-primary)]/70 mb-1">
                            {mode === 'auto' ? '// mode: auto' : '// mode: manual'}
                        </p>
                        <p className="font-mono text-sm font-bold text-[var(--accent-primary)]">
                            {t(`timeMode.${mode}`)}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TimeIndicator;
