import { subscriptionRequests } from './mockData';
import type { ListResult, SubscriptionRequest, RequestStatusUI } from '../types/domain';
import { eventBus, EVENTS } from './eventBus';

const delay = (ms=180) => new Promise(r=>setTimeout(r,ms));

export const requestsService = {
  async list(): Promise<ListResult<SubscriptionRequest>> { await delay(); return { data: [...subscriptionRequests], total: subscriptionRequests.length }; },
  async get(id: string): Promise<SubscriptionRequest | undefined> { await delay(80); return subscriptionRequests.find(r=>r.id===id); },
  async setStatus(id: string, status: RequestStatusUI){ const r = subscriptionRequests.find(x=>x.id===id); if(r){ r.status = status; eventBus.emit(EVENTS.REQUESTS_CHANGED);} },
  async setQuote(id: string, amount: number){ const r = subscriptionRequests.find(x=>x.id===id); if(r){ r.quoteAmount = amount; eventBus.emit(EVENTS.REQUESTS_CHANGED);} },
  onChange(handler: () => void){ return eventBus.on(EVENTS.REQUESTS_CHANGED, handler); }
};
