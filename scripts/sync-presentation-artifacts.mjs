import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const sourceDir = path.join(root, 'blog', 'rest-api-design-workflow')
const targetDir = path.join(root, 'public', 'presentations', 'rest-api-design-workflow')
const sourceBasePath = '/blog/rest-api-design-workflow/'
const targetBasePath = '/presentations/rest-api-design-workflow/'

async function rewriteTextAssets(dir) {
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      await rewriteTextAssets(entryPath)
      continue
    }

    if (!/\.(html|js|css|json|map)$/i.test(entry.name))
      continue

    const original = await readFile(entryPath, 'utf8')
    const rewritten = original.split(sourceBasePath).join(targetBasePath)

    if (rewritten !== original)
      await writeFile(entryPath, rewritten)
  }
}

await mkdir(path.dirname(targetDir), { recursive: true })
await rm(targetDir, { recursive: true, force: true })
await cp(sourceDir, targetDir, {
  recursive: true,
  filter: source => {
    const relative = path.relative(sourceDir, source)
    if (!relative)
      return true

    return ![
      'slides.md',
      'sample.md',
      'global-bottom.vue',
      'uno.config.ts',
      'styles.css',
      '_redirects',
    ].includes(relative)
  },
})

const sourceFallback = path.join(targetDir, '404.html')
const targetIndex = path.join(targetDir, 'index.html')

if (await stat(sourceFallback).catch(() => null)) {
  const slideShell = await readFile(sourceFallback, 'utf8')
  await writeFile(targetIndex, slideShell)
}

await rewriteTextAssets(targetDir)
await writeFile(path.join(root, 'public', '.nojekyll'), '')
