import fs from 'fs';

const cwd = process.cwd()

export function getPkgInfo(base) {
  try {
    const projectBase = cwd === '' || cwd === '/' ? base : cwd
    const content: string = fs.readFileSync(`${projectBase}/package.json`).toString('utf8')
    return JSON.parse(content)
  } catch (e) {
    return {}
  }
}
