import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    colors: {
      green: '#105415',
      greenopac: '#1054154f',
      blue: '#08085e',
      yellow: '#b3ae14',
      orange: '#b36b14',
      black: '#000000',
      blacklight: '#2d2d2d',
      blacknotopac: '#151515',
      blackopac: '#151515ee',
      blackopac2: '#15151560',
      blackopac3: '#131313',
      pureblack: '#000000',
      white: '#ffffff',
      whiteBG: '#f9f9fa',
      whiteBGDarker: '#e7e7e7e7',
      whiteopac: '#ffffff2f',
      whiteopac2: '#ffffff10',
      whiteopac3: '#ffffff05',
      titan: '#cecdcd',
      titanopac: '#cecdcdaa',
      cream: '#ede7d1',
      red: '#371211',
      vividred: '#B31414ee',
      gold: '#d4af37',
      rolexgold: '#a37e2c',
      rolexgoldopac: '#a37e2caa',
      whatsapp: '#25d366',
      whiteopacred: '#B3141425',
      novablue: '#344aec'
    },
    screens: {
      sm: '390px', // For small mobile screens
      md: '768px', // Tablets
      lg: '1024px', // Desktops
      xl: '1289px' // Large screens
    },
    extend: {
      screens: {
        xs: { max: '352px' },
        mdm: { max: '768px' },
        xxl: { min: '1600px' }
      },
      fontFamily: {
        sans: ['var(--font-open-sans)', 'sans-serif'] // Reference the CSS variable
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}

export default config
