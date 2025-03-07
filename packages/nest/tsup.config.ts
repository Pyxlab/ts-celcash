import { defineConfig } from 'tsup'

export default defineConfig(({ watch }) => ({
    entryPoints: ['src/**'],
    splitting: true,
    format: ['cjs'],
    dts: true,
    bundle: true,
    clean: true,
    sourcemap: true,
    minify: false,
    external: ['zod'],
    onSuccess: watch
        ? 'node --enable-source-maps dist/index ys.js --inspect'
        : undefined,
}))
