import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        crimson: {
          50: '#fcf4f4',
          100: '#f8e6e6',
          200: '#f0cece',
          300: '#e5abab',
          400: '#d57b7b',
          500: '#c24a4a',
          600: '#ab3232',
          700: '#902626',
          800: '#8B0000',
          900: '#5C0000',
          950: '#3a0f0f',
        },
        gold: {
          50: '#fbf9f4',
          100: '#f5f0e3',
          200: '#ebdcc5',
          300: '#dfc29e',
          400: '#d2a472',
          500: '#C9A84C',
          600: '#a8862d',
          700: '#8e6b24',
          800: '#755823',
          900: '#5f4820',
          950: '#34260f',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        display: ['var(--font-montserrat)'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #5C0000 0%, #8B0000 30%, #1a0a00 60%, #0d1117 100%)',
        'crimson-gradient': 'linear-gradient(to right, #8B0000, #5C0000)',
        'gold-gradient': 'linear-gradient(to right, #C9A84C, #a8862d)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        gold: '0 4px 14px 0 rgba(201, 168, 76, 0.39)',
        'gold-lg': '0 6px 20px rgba(201, 168, 76, 0.23)',
        crimson: '0 4px 14px 0 rgba(139, 0, 0, 0.39)',
        'crimson-lg': '0 6px 20px rgba(139, 0, 0, 0.23)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'pulse-gold': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '.8', transform: 'scale(1.05)', boxShadow: '0 0 15px rgba(201, 168, 76, 0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.5s ease-out',
        'slide-in-left': 'slide-in-left 0.5s ease-out',
        'pulse-gold': 'pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 3s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite',
        'gradient-shift': 'gradient-shift 3s ease infinite',
      },
    },
  },
  plugins: [],
}

export default config
