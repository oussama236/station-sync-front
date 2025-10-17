export type NotificationType = 'SHELL' | 'BANQUE';
export type NotificationStatus = 'OPEN' | 'READ' | 'RESOLVED';

export interface Notification {
  id: number;
  type: NotificationType;
  refId: number;
  status: NotificationStatus;
  message: string;
  createdAt: string;
}



