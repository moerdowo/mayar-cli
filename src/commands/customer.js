const api = require('../api');
const ui = require('../ui');
const { checkResp, readData } = require('../util');

const USAGE = 'Usage: mayar customer <list|create>';

async function run({ apiKey, flags, positional }) {
  const [sub] = positional;
  switch (sub) {
    case 'list': {
      const res = await api.request('GET', '/hl/v1/customer', {
        apiKey, query: { page: flags.page, pageSize: flags.pageSize },
      });
      checkResp(res);
      if (flags.json) return ui.jsonOut(res.body);
      const data = (res.body && res.body.data) || [];
      const rows = data.map((c) => ({
        id: c.id, name: c.name, email: c.email, mobile: c.mobile, status: c.status,
      }));
      ui.table(rows, ['id', 'name', 'email', 'mobile', 'status']);
      return;
    }
    case 'create': {
      const body = readData(flags.data);
      if (!body) throw new Error('mayar customer create requires --data \'{"name":"...","email":"...","mobile":"..."}\'');
      const res = await api.request('POST', '/hl/v1/customer/create', { apiKey, body });
      checkResp(res); ui.jsonOut(res.body); return;
    }
    default:
      throw new Error(USAGE);
  }
}

module.exports = { run };
