require('esbuild')
  .build({
    define: { 'process.env.NODE_ENV': `"${process.env.NODE_ENV}"` },
    target: 'esnext',
    platform: 'node',
    outdir: 'lib',
    entryPoints: ['src/index.ts'],
    color: true,
    bundle: true,
    minify: true,
    sourcemap: false,
    format: 'cjs',
  })
  .then((event) => {
    console.log('============================')
    console.log('Compile start... ', new Date().toLocaleDateString())
  })
  .catch((error) => {
    console.log('error', error)
    console.error(JSON.stringify(error, null, 2))
  })
