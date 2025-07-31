import { themeSwitch } from '../dom/elements.js'

export const setupDarkMode = () => {
    const darkModeClass = 'darkmode';
    const localStorageKey = 'theme';

    const enableDarkMode = () => {
        document.body.classList.add(darkModeClass);
        localStorage.setItem(localStorageKey, 'dark');
    };

    const disableDarkMode = () => {
        document.body.classList.remove(darkModeClass);
        localStorage.setItem(localStorageKey, 'light');
    };

    const savedTheme = localStorage.getItem(localStorageKey);
    
    if (savedTheme === 'dark') {
        enableDarkMode();
    } else if (savedTheme === 'light') {
        disableDarkMode();
    }

    themeSwitch.addEventListener('click', () => {
        const isCurrentlyActive = document.body.classList.contains(darkModeClass);
        if (isCurrentlyActive) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });
};