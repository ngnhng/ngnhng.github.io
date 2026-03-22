import { rm } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()

await rm(path.join(root, 'public', 'presentations'), {
  recursive: true,
  force: true,
})

await rm(path.join(root, 'public', '.nojekyll'), {
  force: true,
})
