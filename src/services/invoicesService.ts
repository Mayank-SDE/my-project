import { invoices, subscriptionRequests, auditLogs } from './mockData';
import type { Invoice, ListResult, InvoiceStatusUI } from '../types/domain';
import { eventBus, EVENTS } from './eventBus';
import { RequestStatusUI } from '../types/domain';

const delay = (ms=160)=>new Promise(r=>setTimeout(r,ms));

const genId = () => 'inv_' + Math.random().toString(36).slice(2,10);

export const invoicesService = {
  async list(): Promise<ListResult<Invoice>> { await delay(); return { data: [...invoices], total: invoices.length }; },
  async createDraftQuotation(opts: { requestId: string; accountId: string; amount: number; currency: string; lineItems: { description: string; quantity: number; unitAmount: number; }[]; dueAt?: string | null; }): Promise<Invoice>{
    await delay();
    const number = `QTN-2025-${(Math.floor(Math.random()*1000)).toString().padStart(3,'0')}`;
    const inv: Invoice = { id: genId(), number, accountId: opts.accountId, requestId: opts.requestId, amount: opts.amount, currency: opts.currency, status: 'DRAFT' as InvoiceStatusUI, issuedAt: new Date().toISOString(), dueAt: opts.dueAt || undefined, lineItems: opts.lineItems.map(li=>({ id: genId()+li.description.slice(0,4), ...li })), kind: 'QUOTATION' };
    invoices.push(inv);
    const req = subscriptionRequests.find(r=>r.id===opts.requestId);
    if(req){ req.status = RequestStatusUI.QUOTED; req.quoteAmount = opts.amount; }
    auditLogs.push({ id: 'log_'+Date.now(), entity: 'INVOICE', entityId: inv.id, action: 'QUOTATION_DRAFT_CREATED', timestamp: new Date().toISOString(), meta: { requestId: opts.requestId, amount: opts.amount } });
    auditLogs.push({ id: 'log_'+(Date.now()+1), entity: 'REQUEST', entityId: opts.requestId, action: 'REQUEST_STATUS_CHANGED', timestamp: new Date().toISOString(), meta: { to: 'QUOTED' } });
    eventBus.emit(EVENTS.REQUESTS_CHANGED); eventBus.emit(EVENTS.INVOICES_CHANGED);
    return inv;
  },
  async markSent(id: string){ const inv = invoices.find(i=>i.id===id); if(inv && inv.status==='DRAFT'){ inv.status='SENT' as InvoiceStatusUI; auditLogs.push({ id: 'log_'+Date.now(), entity: 'INVOICE', entityId: inv.id, action: 'QUOTATION_SENT', timestamp: new Date().toISOString(), meta: {} }); const req = subscriptionRequests.find(r=>r.id===inv.requestId); if(req && req.status==='QUOTED'){ req.status = RequestStatusUI.SENT; auditLogs.push({ id: 'log_'+(Date.now()+1), entity: 'REQUEST', entityId: req.id, action: 'REQUEST_STATUS_CHANGED', timestamp: new Date().toISOString(), meta: { to: 'SENT' } }); } eventBus.emit(EVENTS.REQUESTS_CHANGED); eventBus.emit(EVENTS.INVOICES_CHANGED);} },
  async markPaid(id: string){ const inv = invoices.find(i=>i.id===id); if(inv && (inv.status==='SENT' || inv.status==='OVERDUE')){ inv.status='PAID' as InvoiceStatusUI; inv.paidAt = new Date().toISOString(); auditLogs.push({ id: 'log_'+Date.now(), entity: 'INVOICE', entityId: inv.id, action: 'INVOICE_PAID', timestamp: new Date().toISOString(), meta: { amount: inv.amount, currency: inv.currency } }); eventBus.emit(EVENTS.INVOICES_CHANGED);} },
  simulateOverdue(){ const now = Date.now(); let changed=false; invoices.forEach(inv=>{ if(inv.status==='SENT' && inv.dueAt){ if(new Date(inv.dueAt).getTime() < now){ inv.status='OVERDUE' as InvoiceStatusUI; changed=true; auditLogs.push({ id: 'log_'+Date.now(), entity: 'INVOICE', entityId: inv.id, action: 'INVOICE_MARKED_OVERDUE', timestamp: new Date().toISOString(), meta: {} }); } } }); if(changed) eventBus.emit(EVENTS.INVOICES_CHANGED); },
  onChange(handler: ()=>void){ return eventBus.on(EVENTS.INVOICES_CHANGED, handler); }
};
