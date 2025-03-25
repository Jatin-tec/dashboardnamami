export interface UserResponse {
  user: {
    name: string;
    email: string;
    role: string;
    phone_number: string;
  };
  tokens: {
    access: string;
    refresh: string;
  };
}

export interface User {
  name: string;
  email: string;
  role: string;
  phone_number: string;
}

export interface Service {
  city: string;
  service_code: string;
  name: string;
  description: string;
  icon: string;
  is_active: boolean;
}

export interface SubscriptionType {
  id: number;
  service: Service;
  name: string;
  frequency: string;
  price: number;
  is_active: boolean;
}

export interface Subscription {
  id: number;
  user: User;
  captain: User;
  subscription_type: SubscriptionType;
  start_date: string;
  end_date: string;
  status: string;
}

export type BookingStatus = "scheduled" | "ongoing" | "completed" | "expired";

export interface Booking {
  booking_id: number;
  user: User;
  captain: User | null;
  subscription_type: SubscriptionType;
  status: BookingStatus;
  start_date: string;
  end_date: string;
}

export interface State {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface City {
  id: number;
  name: string;
  state: State | number;
  created_at: string;
  updated_at: string;
}

export interface UserCityAccess {
  id: number;
  user: User | string;
  city: City | number;
  created_at: string;
  updated_at: string;
}
