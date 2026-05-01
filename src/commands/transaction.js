const api = require('../api');
const ui = require('../ui');
const { checkResp } = require('../util');

const USAGE = 'Usage: mayar tx <list|unpaid>';

function renderTx(body) {
  const data = (body && body.data) || [];
  const rows = data.map((t) => ({
    id: t.id,
    customer: (t.customer && (t.customer.name || t.customer.email)) || t.customerName || '',
    amount: t.amount,
    status: t.status,
    createdAt: t.createdAt,
  }));
  ui.table(rows, ['id', 'customer', 'amount', 'status', 'createdAt']);
}

async function run({ apiKey, flags, positional }) {
  const [sub] = positional;
  switch (sub) {
    case undefined:
    case 'list':
    case 'paid': {
      const res = await api.request('GET', '/hl/v1/transactions', {
        apiKey, query: { page: flags.page, pageSize: flags.pageSize },
      });
      checkResp(res);
      if (flags.json) return ui.jsonOut(res.body);
      renderTx(res.body); return;
    }
    case 'unpaid': {
      const res = await api.request('GET', '/hl/v1/transactions/unpaid', {
        apiKey, query: { page: flags.page, pageSize: flags.pageSize },
      });
      checkResp(res);
      if (flags.json) return ui.jsonOut(res.body);
      renderTx(res.body); return;
    }
    default:
      throw new Error(USAGE);
  }
}

module.exports = { run };
