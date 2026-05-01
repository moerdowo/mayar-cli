const api = require('../api');
const ui = require('../ui');
const { checkResp, readData } = require('../util');

const USAGE = 'Usage: mayar invoice <list|get|close|reopen|create>';

async function run({ apiKey, flags, positional }) {
  const [sub, ...rest] = positional;
  switch (sub) {
    case 'list': {
      const res = await api.request('GET', '/hl/v1/invoice', {
        apiKey, query: { page: flags.page, pageSize: flags.pageSize },
      });
      checkResp(res);
      if (flags.json) return ui.jsonOut(res.body);
      const data = (res.body && res.body.data) || [];
      const rows = data.map((i) => ({
        id: i.id,
        customer: (i.customer && (i.customer.name || i.customer.email)) || '',
        amount: i.amount,
        status: i.status,
        createdAt: i.createdAt,
      }));
      ui.table(rows, ['id', 'customer', 'amount', 'status', 'createdAt']);
      const m = res.body || {};
      process.stdout.write(ui.dim(`page ${m.page ?? '?'} / ${m.pageCount ?? '?'} · total ${m.total ?? data.length}`) + '\n');
      return;
    }
    case 'get': {
      if (!rest[0]) throw new Error('Usage: mayar invoice get <id>');
      const res = await api.request('GET', `/hl/v1/invoice/${encodeURIComponent(rest[0])}`, { apiKey });
      checkResp(res); ui.jsonOut(res.body); return;
    }
    case 'close': {
      if (!rest[0]) throw new Error('Usage: mayar invoice close <id>');
      const res = await api.request('GET', `/hl/v1/invoice/close/${encodeURIComponent(rest[0])}`, { apiKey });
      checkResp(res); ui.jsonOut(res.body); return;
    }
    case 'reopen': {
      if (!rest[0]) throw new Error('Usage: mayar invoice reopen <id>');
      const res = await api.request('GET', `/hl/v1/invoice/open/${encodeURIComponent(rest[0])}`, { apiKey });
      checkResp(res); ui.jsonOut(res.body); return;
    }
    case 'create': {
      const body = readData(flags.data);
      if (!body) throw new Error('mayar invoice create requires --data <json|@file.json>');
      const res = await api.request('POST', '/hl/v1/invoice/create', { apiKey, body });
      checkResp(res); ui.jsonOut(res.body); return;
    }
    default:
      throw new Error(USAGE);
  }
}

module.exports = { run };
