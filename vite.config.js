import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Adjust the base path to match your GitHub Pages URL
export default defineConfig({
  plugins: [react()],
  base: '/YoloTravelerAsia', 
});
