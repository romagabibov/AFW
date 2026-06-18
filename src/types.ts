export interface Designer {
  id: string;
  name: string;
  brand: string;
  bio: string;
  imageUrl: string;
  imageUrls?: string[];
  instagramUrl?: string;
}

export interface EventSchedule {
  id: string;
  date: string;
  time: string;
  designerId: string;
  designerName: string;
  location: string;
  type: string;
  ticketAvailable: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  message: string;
  date: string;
  read: boolean;
}
