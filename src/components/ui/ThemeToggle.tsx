import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme, effectiveTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themes = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ];

  const currentIcon = effectiveTheme === 'dark' ? Moon : Sun;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
        aria-label="Toggle theme"
      >
        {React.createElement(currentIcon, {
          className: "w-4 h-4 text-muted-foreground",
        })}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-card rounded border border-border py-1 z-50">
          {themes.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => {
                setTheme(value);
                setIsOpen(false);
              }}
              className={`
                w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-stone-50 dark:hover:bg-zinc-700 transition-colors
                ${theme === value ? 'text-foreground' : 'text-muted-foreground'}
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{label}</span>
              {theme === value && (
                <span className="ml-auto text-foreground">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};