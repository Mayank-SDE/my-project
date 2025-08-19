import { users } from './mockData';
import type { ListResult, User, UserStatusUI } from '../types/domain';
import { eventBus, EVENTS } from './eventBus';

const delay = (ms=200) => new Promise(res => setTimeout(res, ms));

export const usersService = {
  async list(): Promise<ListResult<User>> { await delay(); return { data: [...users], total: users.length }; },
  async setStatus(id: string, status: UserStatusUI) { const u = users.find(x=>x.id===id); if(u){ u.status = status; eventBus.emit(EVENTS.USERS_CHANGED);} },
  onChange(handler: () => void) { return eventBus.on(EVENTS.USERS_CHANGED, handler); }
};
