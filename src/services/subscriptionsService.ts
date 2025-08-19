import { subscriptions } from './mockData';
import type { ListResult, Subscription } from '../types/domain';
import { eventBus, EVENTS } from './eventBus';

const delay = (ms=220) => new Promise(r=>setTimeout(r,ms));

export const subscriptionsService = {
  async list(): Promise<ListResult<Subscription>> { await delay(); return { data: [...subscriptions], total: subscriptions.length }; },
  onChange(handler: () => void){ return eventBus.on(EVENTS.SUBSCRIPTIONS_CHANGED, handler); }
};
