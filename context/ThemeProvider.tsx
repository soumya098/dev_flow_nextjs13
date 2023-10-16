'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContentType {
  mode: string;
  setMode: (mode: string) => void;
}

export const ThemeContext = createContext<ThemeContentType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	const [mode, setMode] = useState('');

	const handleThemeChange = () => {
		if (mode === 'dark') {
			setMode('light');
			document.documentElement.classList.add('light');
		} else {
			setMode('dark');
			document.documentElement.classList.add('dark');
		}
	};

	useEffect(() => {
		handleThemeChange();
	}, []);

	return <ThemeContext.Provider value={{ mode, setMode }}>{children}</ThemeContext.Provider>;
};

// export const useTheme = () => useContext(ThemeContext);

export const useTheme = () => {
	const context = useContext(ThemeContext);

	if (context === undefined) {
		throw new Error('UseTheme must be used within a ThemeProvider');
	}
};
