import { cp, readdir } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const distDir = path.join(root, 'dist')

const entries = await readdir(distDir, { withFileTypes: true })

for (const entry of entries) {
  const source = path.join(distDir, entry.name)
  const target = path.join(root, entry.name)

  await cp(source, target, {
    recursive: entry.isDirectory(),
    force: true,
  })
}

process.stdout.write('Published dist/ into repository root.\n')
