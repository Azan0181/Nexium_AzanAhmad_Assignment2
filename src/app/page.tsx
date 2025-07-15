'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSummary('');
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        body: JSON.stringify({ url }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok) {
        setSummary(data.summary);
      } else {
        setError(data.error || 'Something went wrong.');
      }
    } catch (err) {
      setError('Failed to fetch summary.');
    }
    setLoading(false);
  };

  return (
    <main
      className={`min-h-screen ${darkMode
        ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white'
        : 'bg-gradient-to-br from-indigo-100 via-white to-indigo-200 text-gray-900'
        } flex flex-col items-center justify-center p-4 transition-colors`}
    >
      <div
        className={`shadow-lg rounded-2xl p-8 max-w-2xl w-full transition-colors ${darkMode ? 'bg-gray-900' : 'bg-white'
          }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h1
            className={`text-3xl font-bold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'
              }`}
          >
            📰 Blog Summarizer
          </h1>
          <button
            className={`text-sm px-3 py-1 rounded-full ${darkMode
              ? 'bg-gray-700 text-gray-300'
              : 'bg-indigo-100 text-indigo-600'
              }`}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        <input
          className={`w-full p-3 border rounded-xl mb-4 focus:outline-none focus:ring-2 ${darkMode
            ? 'bg-gray-800 border-gray-600 text-gray-200 focus:ring-indigo-500'
            : 'border-indigo-300 focus:ring-indigo-500'
            }`}
          type="url"
          placeholder="Paste Blog URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button
          className={`w-full py-3 rounded-xl font-semibold hover:scale-105 transition-transform ${loading
            ? 'opacity-50 cursor-not-allowed'
            : darkMode
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Summarizing...' : 'Summarize'}
        </button>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          {summary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-6"
            >
              <h2
                className={`text-xl font-semibold mb-2 ${darkMode ? 'text-indigo-300' : 'text-gray-700'
                  }`}
              >
                📋 Summary:
              </h2>
              <div
                className={`border rounded-lg p-4 text-base leading-relaxed shadow-inner whitespace-pre-wrap ${darkMode
                    ? 'bg-gray-800 border-gray-700 text-gray-200'
                    : 'bg-gray-50 border-gray-200 text-gray-800'
                  }`}
                style={{
                  maxHeight: '600px',
                  overflowY: 'auto',
                }}
              >
                {summary}
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer
        className={`mt-8 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'
          }`}
      >
        &copy; {new Date().getFullYear()} Blog Summarizer — Built by Azan Ahmad and Next.js
      </footer>
    </main>
  );
}
