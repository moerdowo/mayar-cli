const api = require('../api');
const ui = require('../ui');
const { checkResp } = require('../util');

const USAGE = 'Usage: mayar webhook <register|test|history>';

async function run({ apiKey, flags, positional }) {
  const [sub, ...rest] = positional;
  switch (sub) {
    case 'register': {
      if (!rest[0]) throw new Error('Usage: mayar webhook register <url>');
      const res = await api.request('GET', '/hl/v1/webhook/register', { apiKey, body: { urlHook: rest[0] } });
      checkResp(res); ui.jsonOut(res.body); return;
    }
    case 'test': {
      if (!rest[0]) throw new Error('Usage: mayar webhook test <url>');
      const res = await api.request('POST', '/hl/v1/webhook/test', { apiKey, body: { urlHook: rest[0] } });
      checkResp(res); ui.jsonOut(res.body); return;
    }
    case 'history': {
      const res = await api.request('GET', '/hl/v1/webhook/history', {
        apiKey, query: { page: flags.page, pageSize: flags.pageSize },
      });
      checkResp(res);
      if (flags.json) return ui.jsonOut(res.body);
      const data = (res.body && res.body.data) || [];
      const rows = data.map((w) => ({
        id: w.id, type: w.type, status: w.status, urlDestination: w.urlDestination, createdAt: w.createdAt,
      }));
      ui.table(rows, ['id', 'type', 'status', 'urlDestination', 'createdAt']);
      return;
    }
    case 'retry': {
      if (!rest[0]) throw new Error('Usage: mayar webhook retry <historyId>');
      const res = await api.request('GET', `/hl/v1/webhook/history/retry/${encodeURIComponent(rest[0])}`, { apiKey });
      checkResp(res); ui.jsonOut(res.body); return;
    }
    default:
      throw new Error(USAGE);
  }
}

module.exports = { run };
