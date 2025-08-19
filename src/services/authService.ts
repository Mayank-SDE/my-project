import { users } from './mockData';
import type { User, CurrentUserContext } from '../types/domain';
import { eventBus, EVENTS } from './eventBus';

let current: User = users[4]; // default to system admin seed

export const authService = {
  getCurrent(): CurrentUserContext { return { user: current, permissions: mapRoleToPermissions(current.role) }; },
  switchUser(id: string){ const u = users.find(x=>x.id===id); if(u){ current = u; eventBus.emit(EVENTS.AUTH_CHANGED); } },
  listUsers(){ return users; }
};

function mapRoleToPermissions(role: string): string[]{
  switch(role){
    case 'SYSTEM_ADMIN': return ['requests:approve','requests:reject','requests:quote','invoices:send','invoices:markPaid','accounts:suspend'];
    case 'SUPPORT': return ['requests:quote'];
    case 'CLIENT_ADMIN': return [];
    default: return [];
  }
}
