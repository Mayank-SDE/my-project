// Tiny publish/subscribe utility to propagate in-memory changes
// Avoid external deps for now.

type Handler = (payload?: any) => void;

class EventBus {
  private handlers: Record<string, Handler[]> = {};
  on(event: string, handler: Handler) { (this.handlers[event] ||= []).push(handler); return () => this.off(event, handler); }
  off(event: string, handler: Handler) { this.handlers[event] = (this.handlers[event]||[]).filter(h => h!==handler); }
  emit(event: string, payload?: any) { (this.handlers[event]||[]).forEach(h => h(payload)); }
}

export const eventBus = new EventBus();
export const EVENTS = {
  USERS_CHANGED: 'users:changed',
  ACCOUNTS_CHANGED: 'accounts:changed',
  SUBSCRIPTIONS_CHANGED: 'subscriptions:changed',
  REQUESTS_CHANGED: 'requests:changed',
  INVOICES_CHANGED: 'invoices:changed',
  AUTH_CHANGED: 'auth:changed'
} as const;
