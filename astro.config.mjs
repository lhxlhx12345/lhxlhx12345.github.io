import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  // Enable static site generation for GitHub Pages
  output: 'static',
  // Integrations for Tailwind CSS and React (for Shadcn UI components)
  integrations: [tailwind(), react()],
  // Base path – will be set later when custom domain is configured
  // base: '/',
  vite: {
    server: {
      // configure server if needed
    },
    resolve: {
      alias: {
        // alias for components if desired
        '@components': './src/components',
      },
    },
  },
});
