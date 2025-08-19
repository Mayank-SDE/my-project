import { accounts } from './mockData';
import type { Account, ListResult } from '../types/domain';
import { AccountStatusUI } from '../types/domain';
import { eventBus, EVENTS } from './eventBus';

const delay = (ms=250) => new Promise(r=>setTimeout(r,ms));

export const accountsService = {
  async list(): Promise<ListResult<Account>> { await delay(); return { data: [...accounts], total: accounts.length }; },
  async get(id: string): Promise<Account | undefined> { await delay(80); return accounts.find(a=>a.id===id); },
  async toggleSuspend(id: string) { const acc = accounts.find(a=>a.id===id); if(acc){
    if(acc.status === AccountStatusUI.SUSPENDED){ acc.status = AccountStatusUI.ACTIVE; acc.subscriptionStatus = 'Active'; }
    else { acc.status = AccountStatusUI.SUSPENDED; acc.subscriptionStatus = 'Suspended'; }
    eventBus.emit(EVENTS.ACCOUNTS_CHANGED);
  } },
  onChange(handler: () => void){ return eventBus.on(EVENTS.ACCOUNTS_CHANGED, handler); }
};
