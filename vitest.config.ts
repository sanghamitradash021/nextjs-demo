// import { defineConfig } from 'vitest/config';

// export default defineConfig({
//     test: {
//         globals: true,
//         environment: 'jsdom',
//         setupFiles: './vitest.setup.ts',
//     },
// });

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/testing/setup.ts', // Create this file if it doesn't exist
        css: true,
    },
});