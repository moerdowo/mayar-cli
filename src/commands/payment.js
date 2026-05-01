const api = require('../api');
const ui = require('../ui');
const { checkResp, readData } = require('../util');

const USAGE = 'Usage: mayar payment <list|get|close|reopen|create>';

async function run({ apiKey, flags, positional }) {
  const [sub, ...rest] = positional;
  switch (sub) {
    case 'list': {
      const res = await api.request('GET', '/hl/v1/payment', {
        apiKey, query: { page: flags.page, pageSize: flags.pageSize },
      });
      checkResp(res);
      if (flags.json) return ui.jsonOut(res.body);
      const data = (res.body && res.body.data) || [];
      const rows = data.map((p) => ({
        id: p.id, name: p.name, amount: p.amount, status: p.status, createdAt: p.createdAt,
      }));
      ui.table(rows, ['id', 'name', 'amount', 'status', 'createdAt']);
      return;
    }
    case 'get': {
      if (!rest[0]) throw new Error('Usage: mayar payment get <id>');
      const res = await api.request('GET', `/hl/v1/payment/${encodeURIComponent(rest[0])}`, { apiKey });
      checkResp(res); ui.jsonOut(res.body); return;
    }
    case 'close': {
      if (!rest[0]) throw new Error('Usage: mayar payment close <id>');
      const res = await api.request('GET', `/hl/v1/payment/close/${encodeURIComponent(rest[0])}`, { apiKey });
      checkResp(res); ui.jsonOut(res.body); return;
    }
    case 'reopen': {
      if (!rest[0]) throw new Error('Usage: mayar payment reopen <id>');
      const res = await api.request('GET', `/hl/v1/payment/open/${encodeURIComponent(rest[0])}`, { apiKey });
      checkResp(res); ui.jsonOut(res.body); return;
    }
    case 'create': {
      const body = readData(flags.data);
      if (!body) throw new Error('mayar payment create requires --data <json|@file.json>');
      const res = await api.request('POST', '/hl/v1/payment/create', { apiKey, body });
      checkResp(res); ui.jsonOut(res.body); return;
    }
    default:
      throw new Error(USAGE);
  }
}

module.exports = { run };
