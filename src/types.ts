export interface Alarm {
  id: string;
  title: string;
  datetime: string;
  notifications: {
    email: boolean;
    whatsapp: boolean;
    sms: boolean;
    call: boolean;
  };
  contactInfo: {
    email: string;
    phone: string;
  };
}