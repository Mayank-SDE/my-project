import type { Account, Subscription, SubscriptionRequest, User, Invoice, AuditLogEntry } from "../types/domain";
import { AccountStatusUI, RequestStatusUI, RequestTypeUI, UserRoleUI, UserStatusUI } from "../types/domain";

export const users: User[] = [
  { id: 'usr_001', name: 'Priya Shah', email: 'priya@acme.com', role: UserRoleUI.CLIENT_ADMIN, status: UserStatusUI.ACTIVE, company: 'Acme Infra', accountsCount: 2, createdAt: '2025-01-15', lastLogin: '2025-01-15T14:30:00Z' },
  { id: 'usr_002', name: 'Arjun Rao', email: 'arjun@nimbus.io', role: UserRoleUI.CLIENT_USER, status: UserStatusUI.ACTIVE, company: 'Nimbus Rail', accountsCount: 1, createdAt: '2025-01-14', lastLogin: '2025-01-14T16:45:00Z' },
  { id: 'usr_003', name: 'Meera Iyer', email: 'meera@vertex.aec', role: UserRoleUI.CLIENT_ADMIN, status: UserStatusUI.INACTIVE, company: 'Vertex AEC', accountsCount: 1, createdAt: '2025-01-13', lastLogin: '2025-01-10T09:15:00Z' },
  { id: 'usr_004', name: 'Raj Kumar', email: 'raj@techflow.in', role: UserRoleUI.CLIENT_USER, status: UserStatusUI.ACTIVE, company: 'TechFlow Solutions', accountsCount: 3, createdAt: '2025-01-12', lastLogin: '2025-01-15T11:20:00Z' },
  { id: 'usr_005', name: 'Admin User', email: 'admin@s2m.com', role: UserRoleUI.SYSTEM_ADMIN, status: UserStatusUI.ACTIVE, company: 'S2M Technologies', accountsCount: 0, createdAt: '2024-12-01', lastLogin: '2025-01-15T18:45:00Z' },
  { id: 'usr_006', name: 'Support Agent', email: 'support@s2m.com', role: UserRoleUI.SUPPORT, status: UserStatusUI.ACTIVE, company: 'S2M Technologies', accountsCount: 0, createdAt: '2024-12-15', lastLogin: '2025-01-15T12:30:00Z' }
];

export const accounts: Account[] = [
  { id: '1', name: 'Acme Infra', ownerUserId: 'usr_001', ownerName: 'Priya Shah', ownerEmail: 'priya@acme.com', planType: 'paid', billingCycle: 'Yearly', status: AccountStatusUI.ACTIVE, subscriptionStatus: 'Active', maxUsers: 25, maxDataSizeGb: 250, createdAt: '2025-07-18' },
  { id: '2', name: 'Nimbus Rail', ownerUserId: 'usr_002', ownerName: 'Arjun Rao', ownerEmail: 'arjun@nimbus.io', planType: 'trial', billingCycle: 'Monthly', status: AccountStatusUI.TRIAL, subscriptionStatus: 'Active', maxUsers: 5, maxDataSizeGb: 50, createdAt: '2025-08-02' },
  { id: '3', name: 'Vertex AEC', ownerUserId: 'usr_003', ownerName: 'Meera Iyer', ownerEmail: 'meera@vertex.aec', planType: 'paid', billingCycle: 'Monthly', status: AccountStatusUI.SUSPENDED, subscriptionStatus: 'Suspended', maxUsers: 10, maxDataSizeGb: 120, createdAt: '2025-07-05' },
  { id: '4', name: 'TechFlow Solutions', ownerUserId: 'usr_004', ownerName: 'Raj Kumar', ownerEmail: 'raj@techflow.in', planType: 'paid', billingCycle: 'Yearly', status: AccountStatusUI.PAST_DUE, subscriptionStatus: 'Expired', maxUsers: 15, maxDataSizeGb: 180, createdAt: '2025-06-15' },
  { id: '5', name: 'Urban Dynamics', ownerUserId: 'usr_006', ownerName: 'Lakshmi Nair', ownerEmail: 'lakshmi@urbandyn.com', planType: 'trial', billingCycle: 'Monthly', status: AccountStatusUI.PENDING, subscriptionStatus: 'Pending', maxUsers: 5, maxDataSizeGb: 50, createdAt: '2025-08-10' }
];

export const subscriptions: Subscription[] = [
  { id: 'sub-001', accountId: '1', customerName: 'Acme Corporation', plan: 'Enterprise', status: 'Active', amount: '$299/month', startDate: '2024-01-15', nextBilling: '2025-01-15', features: ['Advanced Analytics', '24/7 Support', 'Custom Integrations'] },
  { id: 'sub-002', accountId: '2', customerName: 'TechStart Inc.', plan: 'Professional', status: 'Active', amount: '$99/month', startDate: '2024-03-10', nextBilling: '2025-03-10', features: ['Analytics Dashboard', 'Email Support', 'API Access'] },
  { id: 'sub-003', accountId: '3', customerName: 'Global Solutions', plan: 'Enterprise', status: 'Expired', amount: '$299/month', startDate: '2023-06-01', nextBilling: '2024-12-01', features: ['Advanced Analytics', '24/7 Support', 'Custom Integrations'] },
  { id: 'sub-004', accountId: '4', customerName: 'Digital Dynamics', plan: 'Basic', status: 'Suspended', amount: '$29/month', startDate: '2024-08-15', nextBilling: '2025-08-15', features: ['Basic Analytics', 'Community Support'] }
];

export const subscriptionRequests: SubscriptionRequest[] = [
  { id: 'REQ-2025-001', userId: 'usr_001', user: { name: 'Priya Shah', email: 'priya@acme.com', company: 'Acme Infra' }, type: RequestTypeUI.NEW_ACCOUNT, quoteAmount: 11800, status: RequestStatusUI.PENDING, createdAt: '2025-01-15', requestedBilling: 'Yearly', requestedMaxUser: 25, requestedMaxDataSize: 250, requestedModules: ['Maps', 'Reporting'] },
  { id: 'REQ-2025-002', userId: 'usr_002', user: { name: 'Arjun Rao', email: 'arjun@nimbus.io', company: 'Nimbus Rail' }, type: RequestTypeUI.UPGRADE, quoteAmount: 8500, status: RequestStatusUI.APPROVED, createdAt: '2025-01-14', requestedBilling: 'Monthly', requestedMaxUser: 50, requestedMaxDataSize: 500, requestedModules: ['Maps', 'AerialMapper'] },
  { id: 'REQ-2025-003', userId: 'usr_003', user: { name: 'Meera Iyer', email: 'meera@vertex.aec', company: 'Vertex AEC' }, type: RequestTypeUI.CANCEL, quoteAmount: 0, status: RequestStatusUI.REJECTED, createdAt: '2025-01-13' },
  { id: 'REQ-2025-004', userId: 'usr_004', user: { name: 'Raj Kumar', email: 'raj@techflow.in', company: 'TechFlow Solutions' }, type: RequestTypeUI.UPGRADE, quoteAmount: 15200, status: RequestStatusUI.PENDING, createdAt: '2025-01-12', requestedBilling: 'Yearly', requestedMaxUser: 30, requestedMaxDataSize: 300, requestedModules: ['Maps', 'AEC BIM', 'Fiber Planner'] },
  { id: 'REQ-2025-005', userId: 'usr_006', user: { name: 'Lakshmi Nair', email: 'lakshmi@urbandyn.com', company: 'Urban Dynamics' }, type: RequestTypeUI.NEW_ACCOUNT, quoteAmount: 6200, status: RequestStatusUI.CANCELLED, createdAt: '2025-01-11', requestedBilling: 'Monthly', requestedMaxUser: 10, requestedMaxDataSize: 100, requestedModules: ['Maps'] }
];

export const invoices: Invoice[] = [
  // Seed one historical invoice (approved upgrade) for analytics & UI examples
  { id: 'inv_001', number: 'INV-2025-100', accountId: '1', requestId: 'REQ-2025-002', userId: 'usr_002', amount: 8500, currency: 'INR', status: 'PAID' as any, issuedAt: '2025-01-14T10:00:00Z', dueAt: '2025-01-29T10:00:00Z', paidAt: '2025-01-16T09:00:00Z', lineItems: [{ id: 'li_1', description: 'Upgrade to Professional Plan', quantity: 1, unitAmount: 8500 }], kind: 'INVOICE' }
];

export const auditLogs: AuditLogEntry[] = [
  { id: 'log_001', entity: 'REQUEST', entityId: 'REQ-2025-002', action: 'REQUEST_STATUS_CHANGED', timestamp: '2025-01-14T09:55:00Z', userId: 'usr_005', meta: { from: 'PENDING', to: 'APPROVED' } },
  { id: 'log_002', entity: 'INVOICE', entityId: 'inv_001', action: 'INVOICE_PAID', timestamp: '2025-01-16T09:00:00Z', userId: 'usr_005', meta: { amount: 8500, currency: 'INR' } }
];
