import { useEffect } from 'react';

const DarkModeButton = () => {
  const toggleDarkMode = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      onClick={toggleDarkMode}
      className="bg-neutral-700 dark:bg-neutral-900 text-white p-3 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-800 transition-all duration-300"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eclipse-icon lucide-eclipse w-4 h-4"><circle cx="12" cy="12" r="10"/><path d="M12 2a7 7 0 1 0 10 10"/></svg>
    </button>
  );
};

export default DarkModeButton;
