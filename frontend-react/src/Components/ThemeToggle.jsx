import React from 'react';
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';
import { useTheme } from '../Providers/ThemeProvider';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle transition-all duration-300 hover:bg-base-200"
            aria-label="Toggle Theme"
        >
            {theme === 'light' ? (
                <HiOutlineMoon className="text-xl text-slate-700" title="Switch to Dark Mode" />
            ) : (
                <HiOutlineSun className="text-xl text-yellow-400" title="Switch to Light Mode" />
            )}
        </button>
    );
};

export default ThemeToggle;
