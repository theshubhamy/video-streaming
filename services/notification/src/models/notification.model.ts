export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'EMAIL' | 'SMS' | 'PUSH';
  sent: boolean;
}
