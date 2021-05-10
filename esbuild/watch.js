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
    watch: {
      onRebuild(error, result) {
        if (error) console.error('watch build failed:', error)
        else console.error('watch build succeeded:', result)
      },
    },
  })
  .then((result) => {
    // Call "stop" on the result when you're done
    console.log('============================')
    console.log('Compile start... ', new Date().toLocaleDateString())

    // result.stop()
  })
  .catch((error) => {
    console.log('error', error)
    console.error(JSON.stringify(error, null, 2))
  })
