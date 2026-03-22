import { cp, mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const sourceDir = path.join(root, 'blog', 'rest-api-design-workflow')
const targetDir = path.join(root, 'public', 'presentations', 'rest-api-design-workflow')

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

await writeFile(path.join(root, 'public', '.nojekyll'), '')
