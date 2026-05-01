const api = require('../api');
const ui = require('../ui');
const { checkResp } = require('../util');

const USAGE = 'Usage: mayar tx <list|unpaid>';

function fmtDate(v) {
  if (v == null) return '';
  if (typeof v === 'number') return new Date(v).toISOString();
  return String(v);
}

function renderTx(body) {
  const data = (body && body.data) || [];
  const rows = data.map((t) => ({
    id: t.id,
    customer: (t.customer && (t.customer.name || t.customer.email))
      || (t.paymentLink && t.paymentLink.name)
      || t.customerName || '',
    amount: t.credit ?? t.amount ?? '',
    status: t.status || '',
    createdAt: fmtDate(t.createdAt),
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
