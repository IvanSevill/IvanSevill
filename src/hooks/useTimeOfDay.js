export const getPeriod = (hour) => {
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 19) return 'afternoon';
    if (hour >= 19 && hour < 23) return 'evening';
    return 'night';
};

export const MODES = ['auto', 'morning', 'afternoon', 'evening', 'night'];

// Representative hour used to position the console clock marker
// when a fixed (non-auto) mode is selected.
export const MODE_REFERENCE_HOUR = {
    morning: 9,
    afternoon: 14,
    evening: 20.5,
    night: 2,
};
