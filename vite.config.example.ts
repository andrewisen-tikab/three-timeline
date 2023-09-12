import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    build: {
        outDir: './dist/examples',
        minify: false,
        sourcemap: true,
        rollupOptions: {
            input: {
                example: resolve(__dirname, 'example/index.html'),
            },
        },
    },
});
