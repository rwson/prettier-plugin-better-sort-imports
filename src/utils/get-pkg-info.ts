import fs from 'fs';

console.log(process.cwd())

export function getPkgInfo() {
  const content: string = fs.readFileSync(process.cwd() + '/package.json').toString('utf8')

  try {
    return JSON.parse(content)
  } catch (e) {
    return {}
  }
}
