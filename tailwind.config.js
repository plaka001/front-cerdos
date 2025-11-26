/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'bg-slate-700',
    'bg-slate-800',
    'bg-slate-900',
    'text-white',
    'text-slate-300',
    'text-slate-400',
    'border-slate-600',
    'border-slate-700',
    'placeholder-slate-400'
  ]
}

