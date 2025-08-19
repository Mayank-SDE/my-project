// Central domain TypeScript interfaces mirroring (and slightly extending) the Prisma schema
// These are front-end facing shapes (camelCase, optional denormalised fields for convenience)

export type ID = string;

export const UserRoleUI = {
  SYSTEM_ADMIN: 'SYSTEM_ADMIN',
  SUPPORT: 'SUPPORT',
  CLIENT_ADMIN: 'CLIENT_ADMIN',
  CLIENT_USER: 'CLIENT_USER'
} as const;
export type UserRoleUI = typeof UserRoleUI[keyof typeof UserRoleUI];

export const UserStatusUI = { ACTIVE:'ACTIVE', INACTIVE:'INACTIVE', SUSPENDED:'SUSPENDED' } as const;
export type UserStatusUI = typeof UserStatusUI[keyof typeof UserStatusUI];

export interface User {
  id: ID;
  name: string;
  email: string;
  role: UserRoleUI;
  status: UserStatusUI;
  company?: string;
  accountsCount: number;
  createdAt: string; // ISO Date
  lastLogin: string; // ISO DateTime
}

// Basic current user placeholder (would come from auth context in real app)
export interface CurrentUserContext { user: User; permissions: string[]; }

export const AccountStatusUI = { ACTIVE:'ACTIVE', TRIAL:'TRIAL', PAST_DUE:'PAST_DUE', SUSPENDED:'SUSPENDED', CANCELLED:'CANCELLED', PENDING:'PENDING', EXPIRED:'EXPIRED' } as const;
export type AccountStatusUI = typeof AccountStatusUI[keyof typeof AccountStatusUI];

export interface Account {
  id: ID;
  name: string;
  ownerUserId: ID;
  ownerName: string;
  ownerEmail: string;
  planType: 'trial' | 'paid';
  billingCycle: 'Monthly' | 'Yearly';
  status: AccountStatusUI; // derived mapping from subscription/account status
  subscriptionStatus: string; // legacy field used by existing StatusBadge usage
  maxUsers: number;
  maxDataSizeGb: number;
  createdAt: string;
}

export const SubscriptionStatusUI = { ACTIVE:'ACTIVE', EXPIRED:'EXPIRED', CANCELLED:'CANCELLED', PENDING:'PENDING', SUSPENDED:'SUSPENDED' } as const;
export type SubscriptionStatusUI = typeof SubscriptionStatusUI[keyof typeof SubscriptionStatusUI];

export interface Subscription {
  id: ID;
  accountId: ID;
  customerName: string; // denormalised Account.name
  plan: string;
  status: SubscriptionStatusUI | string;
  amount: string; // formatted for now
  startDate: string;
  nextBilling: string;
  features: string[];
}

export const RequestTypeUI = { NEW_ACCOUNT:'NEW_ACCOUNT', UPGRADE:'UPGRADE', DOWNGRADE:'DOWNGRADE', CANCEL:'CANCEL', RENEWAL:'RENEWAL' } as const;
export type RequestTypeUI = typeof RequestTypeUI[keyof typeof RequestTypeUI];
export const RequestStatusUI = { PENDING:'PENDING', QUOTED:'QUOTED', SENT:'SENT', APPROVED:'APPROVED', REJECTED:'REJECTED', CANCELLED:'CANCELLED' } as const;
export type RequestStatusUI = typeof RequestStatusUI[keyof typeof RequestStatusUI];

export interface SubscriptionRequest {
  id: ID;
  userId?: ID;
  user: { name: string; email: string; company?: string };
  type: RequestTypeUI;
  quoteAmount: number;
  status: RequestStatusUI;
  createdAt: string;
  requestedBilling?: 'Monthly' | 'Yearly';
  requestedMaxUser?: number;
  requestedMaxDataSize?: number; // GB
  requestedModules?: string[];
}

export interface InvoiceLineItem {
  id: ID;
  description: string;
  quantity: number;
  unitAmount: number; // in major currency for UI simplicity
  module?: string;
}

export const InvoiceStatusUI = { DRAFT:'DRAFT', SENT:'SENT', PAID:'PAID', VOID:'VOID', OVERDUE:'OVERDUE' } as const;
export type InvoiceStatusUI = typeof InvoiceStatusUI[keyof typeof InvoiceStatusUI];

export interface Invoice {
  id: ID;
  number: string;
  accountId: ID;
  subscriptionId?: ID;
  requestId?: ID; // links quotation/invoice back to originating subscription request
  userId?: ID;
  amount: number; // total
  currency: string; // ISO code
  status: InvoiceStatusUI;
  issuedAt: string;
  dueAt?: string;
  paidAt?: string;
  lineItems: InvoiceLineItem[];
  kind: 'QUOTATION' | 'INVOICE';
}

// Simple audit log entry to track lifecycle actions (status changes, invoice events, suspensions etc.)
export interface AuditLogEntry {
  id: ID;
  entity: 'REQUEST' | 'ACCOUNT' | 'INVOICE' | 'USER';
  entityId: ID;
  action: string; // e.g. REQUEST_STATUS_CHANGED
  userId?: ID; // actor (if known)
  timestamp: string;
  meta?: Record<string, any>; // lightweight details (previous/new status, amounts etc.)
}

export interface AuditLogResult extends ListResult<AuditLogEntry> {}

// Generic list response (extensible for real API later)
export interface ListResult<T> { data: T[]; total: number; }
