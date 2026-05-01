const config = require('../config');
const ui = require('../ui');

async function run({ flags }) {
  ui.printBanner();
  const existing = config.load();
  if (existing && existing.apiKey && !flags.force) {
    const masked = existing.apiKey.slice(0, 6) + '…' + existing.apiKey.slice(-4);
    process.stdout.write(ui.dim(`A key is already configured (${masked}).`) + '\n');
    const ans = await ui.ask('Overwrite? [y/N] ');
    if (!/^y/i.test(ans.trim())) { process.stdout.write('Cancelled.\n'); return; }
  }
  process.stdout.write(`${ui.bold('Welcome to Mayar CLI.')}\n`);
  process.stdout.write(`Get your key from ${ui.cyan('https://web.mayar.id')} → Integration → API Key.\n\n`);
  const key = await ui.askSecret(ui.bold('Paste your production API key: '));
  if (!key.trim()) { process.stderr.write(ui.red('No key provided.\n')); process.exit(1); }
  config.save({ apiKey: key.trim(), endpoint: 'production', savedAt: new Date().toISOString() });
  process.stdout.write(ui.green(`✓ Saved to ${config.file}`) + '\n\n');
  process.stdout.write('Try:\n');
  process.stdout.write('  mayar balance\n');
  process.stdout.write('  mayar invoice list\n');
  process.stdout.write('  mayar product list\n');
}

module.exports = { run };
