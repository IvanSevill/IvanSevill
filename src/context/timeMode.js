import { createContext, useContext } from 'react';

export const TimeModeContext = createContext(null);

export const useTimeMode = () => useContext(TimeModeContext);
