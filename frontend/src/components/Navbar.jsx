import { motion } from 'framer-motion';
import { Menu, Moon, Sun } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed w-full z-50 top-6 px-4 md:px-8 flex justify-center pointer-events-none"
    >
      <div className="glass-panel w-full max-w-5xl px-6 py-3 flex justify-between items-center rounded-full pointer-events-auto shadow-2xl">
        <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-apple-text-primary flex items-center justify-center shadow-md">
            <span className="font-bold text-apple-bg text-[10px] tracking-tighter">AI</span>
          </div>
          <span className="text-lg font-medium tracking-wide text-apple-text-primary">Vision<span className="text-apple-text-secondary">X</span></span>
        </a>
        
        <div className="hidden md:flex items-center gap-1 text-sm font-medium text-apple-text-secondary">
          {['About', 'Features', 'Workflow', 'Team'].map((item) => (
            <a 
              key={item}
              href={`#${item.toLowerCase()}`} 
              className="px-5 py-2 rounded-full hover:bg-overlay-8 hover:text-apple-text-primary transition-all duration-300"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleDarkMode}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-overlay-8 text-apple-text-primary transition-colors focus:outline-none"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <div className="md:hidden">
            <Menu className="w-5 h-5 text-apple-text-primary cursor-pointer" />
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
