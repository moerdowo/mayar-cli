const api = require('../api');
const ui = require('../ui');
const { checkResp } = require('../util');

async function run({ apiKey, flags, positional }) {
  const [amountArg] = positional;
  if (!amountArg) throw new Error('Usage: mayar qrcode <amount>');
  const amount = Number(amountArg);
  if (!Number.isFinite(amount) || amount <= 0) throw new Error('Amount must be a positive number.');
  const res = await api.request('POST', '/hl/v1/qrcode/create', { apiKey, body: { amount } });
  checkResp(res);
  if (flags.json) return ui.jsonOut(res.body);
  const d = (res.body && res.body.data) || {};
  process.stdout.write(`${ui.bold('QR amount:')} ${d.amount ?? amount}\n`);
  if (d.url) process.stdout.write(`${ui.bold('QR image:')}  ${ui.cyan(d.url)}\n`);
  else ui.jsonOut(res.body);
}

module.exports = { run };
