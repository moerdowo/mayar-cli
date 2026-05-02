const config = require('../config');
const ui = require('../ui');

async function run({ positional }) {
  const [key] = positional;
  if (!key || !key.trim()) {
    throw new Error('Usage: mayar api-key <your-api-key>');
  }
  const trimmed = key.trim();
  const existing = config.load() || {};
  config.save({
    ...existing,
    apiKey: trimmed,
    endpoint: 'production',
    savedAt: new Date().toISOString(),
  });
  const masked = trimmed.slice(0, 6) + '…' + trimmed.slice(-4);
  process.stdout.write(ui.green(`✓ API key saved (${masked})`) + '\n');
  process.stdout.write(ui.dim(config.file) + '\n');
}

module.exports = { run };
