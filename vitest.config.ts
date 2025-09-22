import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    include: ['src/**/*.test.{ts,tsx}', 'src/**/*.spec.{ts,tsx}', 'tests/unit/**/*.spec.{ts,tsx}'],
  },
});
