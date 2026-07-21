import React, { useEffect, useState, useCallback } from 'react';
import { getPeriod, MODES } from '../hooks/useTimeOfDay';
import { TimeModeContext } from './timeMode';

const STORAGE_KEY = 'timeMode';

export const TimeModeProvider = ({ children }) => {
    const [mode, setMode] = useState(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return MODES.includes(stored) ? stored : 'auto';
    });
    const [autoPeriod, setAutoPeriod] = useState(() => getPeriod(new Date().getHours()));

    useEffect(() => {
        const id = setInterval(() => setAutoPeriod(getPeriod(new Date().getHours())), 60000);
        return () => clearInterval(id);
    }, []);

    const resolvedPeriod = mode === 'auto' ? autoPeriod : mode;

    useEffect(() => {
        document.documentElement.setAttribute('data-time', resolvedPeriod);
    }, [resolvedPeriod]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, mode);
    }, [mode]);

    const cycleMode = useCallback(() => {
        setMode((current) => {
            const idx = MODES.indexOf(current);
            return MODES[(idx + 1) % MODES.length];
        });
    }, []);

    return (
        <TimeModeContext.Provider value={{ mode, resolvedPeriod, cycleMode }}>
            {children}
        </TimeModeContext.Provider>
    );
};
