import { auditLogs } from './mockData';
import type { AuditLogEntry, ListResult } from '../types/domain';
import { eventBus, EVENTS } from './eventBus';

const delay = (ms=120)=>new Promise(r=>setTimeout(r,ms));

export const auditLogService = {
  async list(filter?: { entityId?: string; entity?: string }): Promise<ListResult<AuditLogEntry>> { await delay(); let data = [...auditLogs]; if(filter?.entity){ data = data.filter(l=>l.entity===filter.entity); } if(filter?.entityId){ data = data.filter(l=>l.entityId===filter.entityId); } return { data, total: data.length }; },
  onChange(handler: ()=>void){ return eventBus.on(EVENTS.INVOICES_CHANGED, handler); }
};
