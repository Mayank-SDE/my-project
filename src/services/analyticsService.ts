import { accounts, subscriptions, subscriptionRequests, invoices } from './mockData';

export interface DerivedMetrics {
  totals: { accounts: number; activeSubscriptions: number; pendingRequests: number; invoices: number; revenueInr: number; paidInvoices: number; draftQuotations: number; };
  planDistribution: { plan: string; count: number }[];
  requestStatusCounts: Record<string, number>;
  invoiceStatusCounts: Record<string, number>;
}

export function getDerivedMetrics(): DerivedMetrics {
  const activeSubscriptions = subscriptions.filter(s=> (s.status||'').toLowerCase()==='active').length;
  const pendingRequests = subscriptionRequests.filter(r=> r.status==='PENDING').length;
  const revenueInr = invoices.filter(i=> i.status==='PAID' && i.currency==='INR').reduce((a,b)=>a+b.amount,0);
  const paidInvoices = invoices.filter(i=> i.status==='PAID').length;
  const draftQuotations = invoices.filter(i=> i.kind==='QUOTATION' && i.status==='DRAFT').length;
  const planDistributionMap: Record<string, number> = {};
  subscriptions.forEach(s=> { planDistributionMap[s.plan]=(planDistributionMap[s.plan]||0)+1; });
  const planDistribution = Object.entries(planDistributionMap).map(([plan,count])=>({ plan, count }));
  const requestStatusCounts: Record<string, number> = {};
  subscriptionRequests.forEach(r=>{ requestStatusCounts[r.status]=(requestStatusCounts[r.status]||0)+1; });
  const invoiceStatusCounts: Record<string, number> = {};
  invoices.forEach(i=>{ invoiceStatusCounts[i.status]=(invoiceStatusCounts[i.status]||0)+1; });
  return { totals: { accounts: accounts.length, activeSubscriptions, pendingRequests, invoices: invoices.length, revenueInr, paidInvoices, draftQuotations }, planDistribution, requestStatusCounts, invoiceStatusCounts };
}
