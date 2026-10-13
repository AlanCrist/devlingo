/* global console, process */

import { spawnSync } from 'node:child_process'

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'

const runNpmScript = (script) => {
  console.log(`\n[quality-gate] npm run ${script}`)
  const result = spawnSync(npmCommand, ['run', script], {
    stdio: 'inherit',
    shell: false,
  })
  if (result.status !== 0) process.exit(result.status ?? 1)
}

runNpmScript('format:check')
runNpmScript('lint')
runNpmScript('typecheck')
runNpmScript('test:unit')
runNpmScript('test:integration')
runNpmScript('content:validate')
runNpmScript('build')

console.log('\n[quality-gate] npx playwright test (preview server)')
const playwrightCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx'
const e2eResult = spawnSync(playwrightCommand, ['playwright', 'test'], {
  stdio: 'inherit',
  shell: false,
  env: { ...process.env, DEVLINGO_E2E_PREVIEW: 'true' },
})
if (e2eResult.status !== 0) process.exit(e2eResult.status ?? 1)

console.log('\n[quality-gate] All checks passed.')
