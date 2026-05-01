const fs = require('fs');
const ui = require('./ui');

function checkResp(res) {
  if (res.status >= 200 && res.status < 300) return;
  const msg = (res.body && (res.body.messages || res.body.message)) || res.raw || '';
  const err = new Error(`API ${res.status} — ${msg}`);
  err.status = res.status;
  err.body = res.body;
  throw err;
}

function readData(value) {
  if (!value) return undefined;
  if (value.startsWith('@')) {
    const content = fs.readFileSync(value.slice(1), 'utf8');
    return JSON.parse(content);
  }
  return JSON.parse(value);
}

function maybeJson(flags, body, fallback) {
  if (flags.json) {
    ui.jsonOut(body);
    return true;
  }
  if (typeof fallback === 'function') {
    fallback();
    return true;
  }
  return false;
}

module.exports = { checkResp, readData, maybeJson };
