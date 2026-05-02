const api = require('../api');
const ui = require('../ui');

function decodeJwt(token) {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const padded = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
    const json = Buffer.from(padded + pad, 'base64').toString('utf8');
    return JSON.parse(json);
  } catch (_) {
    return null;
  }
}

function fmtTs(s) {
  if (!s) return '';
  if (typeof s === 'number') return new Date(s * 1000).toISOString();
  return String(s);
}

async function run({ apiKey, flags }) {
  const masked = apiKey.slice(0, 6) + '…' + apiKey.slice(-4);
  const decoded = decodeJwt(apiKey);
  const res = await api.request('GET', '/hl/v1/balance', { apiKey });
  const valid = res.status >= 200 && res.status < 300;

  if (flags.json) {
    ui.jsonOut({
      apiKey: masked,
      valid,
      status: res.status,
      decoded,
      balance: valid ? (res.body && res.body.data) : null,
      error: valid ? null : (res.body && (res.body.messages || res.body.message)) || null,
    });
    return;
  }

  process.stdout.write(`${ui.bold('API key:')}    ${masked}\n`);
  process.stdout.write(`${ui.bold('Endpoint:')}   ${api.BASE_URL}\n`);
  if (decoded) {
    const name = decoded.name || decoded.merchantName || decoded.fullName;
    const id = decoded.accountId || decoded.userId || decoded.sub || decoded.id;
    const email = decoded.email || decoded.merchantEmail;
    const role = decoded.role || decoded.type;
    if (name)  process.stdout.write(`${ui.bold('Name:')}       ${name}\n`);
    if (email) process.stdout.write(`${ui.bold('Email:')}      ${email}\n`);
    if (id)    process.stdout.write(`${ui.bold('Account ID:')} ${id}\n`);
    if (role)  process.stdout.write(`${ui.bold('Role:')}       ${role}\n`);
    if (decoded.iat) process.stdout.write(`${ui.bold('Issued:')}     ${fmtTs(decoded.iat)}\n`);
    if (decoded.exp) process.stdout.write(`${ui.bold('Expires:')}    ${fmtTs(decoded.exp)}\n`);
  } else {
    process.stdout.write(ui.dim('(API key is not a decodable JWT — skipping local profile)') + '\n');
  }

  if (valid) {
    process.stdout.write(ui.green('✓ Key is valid (verified via /hl/v1/balance)') + '\n');
  } else {
    const msg = (res.body && (res.body.messages || res.body.message)) || res.raw || '';
    process.stdout.write(ui.red(`✗ Key rejected (HTTP ${res.status}) — ${msg}`) + '\n');
    process.exitCode = 1;
  }
}

module.exports = { run };
