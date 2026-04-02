import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                emerald: {
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    200: '#a7f3d0',
                    300: '#6ee7b7',
                    400: '#34d399',
                    500: '#10b981',
                    600: '#059669',
                    700: '#047857',
                    800: '#065f46',
                    900: '#064e3b',
                },
                cream: '#FDFFF5',
                // Rome-inspired premium colors
                travertine: {
                    50: '#FAF8F3',
                    100: '#F5F1E8',
                    200: '#E8DCC4',
                    300: '#DBC7A0',
                    400: '#CEB27C',
                    500: '#C19D58',
                    600: '#9A7E46',
                    700: '#735E35',
                    800: '#4D3F23',
                    900: '#261F12',
                },
                vatican: {
                    50: '#FBF9F0',
                    100: '#F7F3E1',
                    200: '#EFE7C3',
                    300: '#E7DBA5',
                    400: '#DFCF87',
                    500: '#D4AF37',
                    600: '#B8962E',
                    700: '#8A7122',
                    800: '#5C4B17',
                    900: '#2E260B',
                },
                terracotta: {
                    50: '#FEF2EE',
                    100: '#FDE5DD',
                    200: '#FBCBBB',
                    300: '#F9B199',
                    400: '#E57347',
                    500: '#C1440E',
                    600: '#9A360B',
                    700: '#742908',
                    800: '#4D1B06',
                    900: '#270E03',
                },
                espresso: {
                    50: '#F5F3F2',
                    100: '#EBE7E5',
                    200: '#D7CFCB',
                    300: '#C3B7B1',
                    400: '#AF9F97',
                    500: '#3E2723',
                    600: '#32201D',
                    700: '#251816',
                    800: '#19100E',
                    900: '#0C0807',
                },
                sunset: {
                    orange: '#FF6B35',
                    pink: '#FF8C94',
                    gold: '#FFB347',
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)'],
            },
            backgroundImage: {
                'gradient-rome': 'linear-gradient(135deg, #FF6B35 0%, #FF8C94 50%, #FFB347 100%)',
                'gradient-vatican': 'linear-gradient(135deg, #D4AF37 0%, #C1440E 100%)',
            },
        },
    },
    plugins: [],
};
export default config;
