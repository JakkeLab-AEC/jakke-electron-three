import { defineConfig } from "vite";
import { resolve } from 'path';
import { builtinModules } from 'module';

export default defineConfig({
  base: './',
  build: {
    outDir: '.vite/',
    minify: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/main.ts'),  // main.ts 파일
        preload: resolve(__dirname, 'src/preload.ts'),
        index: resolve(__dirname, 'index.html'),  // index.html 파일
      },
      external: [
        'electron',
        'mock-aws-s3',
        'aws-sdk',
        'nock',
        '@mapbox',
        ...builtinModules,
      ],
      output: {
        entryFileNames: '[name].js',
        format: 'es',
      },
    },
  },
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  json: {
    stringify: true,
  },
  esbuild: {
    keepNames: true,  // Preserve original function and class names
    minifyIdentifiers: false,  // Don't minify variable names
    minifySyntax: false,  // Don't modify syntax for optimization
    minifyWhitespace: false,  // Preserve whitespace and formatting
  },
  optimizeDeps: {
    exclude: ["@mapbox"],
  }
});