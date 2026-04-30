import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

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

const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/;
const MIN_PASSWORD_LENGTH = 6;

function validateForm(name, email, password) {
  if (!name.trim()) {
    return "Name is required";
  }

  if (!email.trim()) {
    return "Email is required";
  }

  if (!password) {
    return "Password is required";
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }

  if (!SPECIAL_CHAR_REGEX.test(password)) {
    return "Password must contain at least one special character";
  }

  return null;
}

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signup } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const validationError = validateForm(name, email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      await signup(name, email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-surface-50 dark:bg-surface-900 transition-colors">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center relative">
          <button
            onClick={toggleTheme}
            className="absolute right-0 top-0 cursor-pointer p-2 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors text-surface-600 dark:text-surface-300"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <MoonIcon />
            ) : (
              <SunIcon />
            )}
          </button>
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Create an account</h1>
          <p className="mt-2 text-surface-600 dark:text-surface-400">
            Start tracking your habits today
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-8 shadow-xl shadow-surface-200/60 dark:shadow-black/20 transition-colors">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-danger-500/30 bg-danger-500/10 px-4 py-3 text-sm text-danger-500 dark:text-danger-400">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="signup-name"
                className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300"
              >
                Full name
              </label>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                autoComplete="name"
                className="w-full rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 px-4 py-2.5 text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 outline-none transition-colors focus:border-accent-400 dark:focus:border-accent-500 focus:ring-1 focus:ring-accent-200 dark:focus:ring-accent-900/30"
              />
            </div>

            <div>
              <label
                htmlFor="signup-email"
                className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300"
              >
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 px-4 py-2.5 text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 outline-none transition-colors focus:border-accent-400 dark:focus:border-accent-500 focus:ring-1 focus:ring-accent-200 dark:focus:ring-accent-900/30"
              />
            </div>

            <div>
              <label
                htmlFor="signup-password"
                className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300"
              >
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 chars, one special character"
                autoComplete="new-password"
                className="w-full rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 px-4 py-2.5 text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 outline-none transition-colors focus:border-accent-400 dark:focus:border-accent-500 focus:ring-1 focus:ring-accent-200 dark:focus:ring-accent-900/30"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full cursor-pointer rounded-lg bg-accent-500 px-4 py-2.5 font-medium text-white transition-colors hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 dark:focus:ring-offset-surface-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Creating account…" : "Sign up"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-surface-600 dark:text-surface-400">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-medium text-accent-500 dark:text-accent-400 hover:text-accent-600 dark:hover:text-accent-300 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
