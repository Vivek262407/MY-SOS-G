export interface UserData {
  email: string;
  pin: string;
  name: string;
  dateOfBirth: string;
  fatherName: string;
  fatherMobile: string;
  address: string;
  friendName: string;
  friendMobile: string;
  bloodGroup: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export type AlertType = 'ALERT' | 'DANGER' | 'EMERGENCY';

export interface LoginData {
  email: string;
  pin: string;
}