/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'space': ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        cyber: {
          cyan: "hsl(var(--cyber-cyan))",
          'cyan-light': "hsl(var(--cyber-cyan-light))",
          'cyan-dark': "hsl(var(--accent-cyan-dark))",
          purple: "hsl(var(--cyber-purple))",
          'purple-dark': "hsl(var(--accent-purple-dark))",
          green: "hsl(var(--cyber-green))",
          'green-bright': "hsl(var(--success-bright))",
          red: "hsl(var(--cyber-red))",
          'red-bright': "hsl(var(--danger-bright))",
          orange: "hsl(var(--warning-orange))",
        },
        glass: {
          bg: "hsl(var(--glass-bg))",
        },
      },
      boxShadow: {
        'glow-cyan': '0 0 20px hsl(var(--accent-cyan) / 0.5), 0 0 40px hsl(var(--accent-cyan) / 0.2)',
        'glow-purple': '0 0 30px hsl(var(--accent-purple) / 0.4), 0 0 50px hsl(var(--accent-purple) / 0.2)',
        'glow-green': '0 0 20px hsl(var(--success-green) / 0.5), 0 0 40px hsl(var(--success-green) / 0.2)',
        'glow-red': '0 0 20px hsl(var(--danger-red) / 0.5), 0 0 40px hsl(var(--danger-red) / 0.2)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
}
