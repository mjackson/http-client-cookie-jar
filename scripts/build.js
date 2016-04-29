const execSync = require('child_process').execSync

const exec = (command) =>
  execSync(command, { stdio: 'inherit' })

exec('npm run build-cjs')
