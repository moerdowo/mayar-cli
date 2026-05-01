const fs = require('fs');
const path = require('path');
const os = require('os');

const dir = path.join(os.homedir(), '.mayar');
const file = path.join(dir, 'config.json');

function load() {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (_) {
    return null;
  }
}

function save(data) {
  fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  try { fs.chmodSync(file, 0o600); } catch (_) {}
}

function clear() {
  try { fs.unlinkSync(file); return true; } catch (_) { return false; }
}

module.exports = { load, save, clear, file, dir };
