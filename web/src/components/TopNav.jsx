import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function TopNav() {
  const { user, signout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header className="fixed top-0 left-[220px] right-0 h-14 bg-white/80 dark:bg-surface-800/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-700 flex items-center justify-between px-6 z-10 transition-colors">
      <div />
      <div className="flex items-center gap-3">
        {user?.email && (
          <span className="text-[12px] text-surface-400 dark:text-surface-500 hidden sm:block">{user.email}</span>
        )}
        <button
          onClick={toggleTheme}
          className="cursor-pointer p-2 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors text-surface-600 dark:text-surface-300"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <MoonIcon />
          ) : (
            <SunIcon />
          )}
        </button>
        <div className="w-8 h-8 rounded-full bg-accent-100 dark:bg-accent-900 text-accent-600 dark:text-accent-300 flex items-center justify-center text-[12px] font-bold">
          {initials}
        </div>
        <button
          onClick={signout}
          className="cursor-pointer text-[12px] text-surface-400 dark:text-surface-500 hover:text-surface-600 dark:hover:text-surface-300 transition-colors px-2 py-1.5 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700"
          aria-label="Sign out"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}

function SunIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75l-1.591-1.591M9.75 14.25l-1.591 1.591m7.5-7.5l1.591 1.591M14.25 14.25l1.591 1.591m-7.5 0l1.591-1.591" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
  );
}
