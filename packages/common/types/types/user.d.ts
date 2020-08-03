import { UserStatus } from '../enums/UserStatus';
import { uuid } from './core';
export interface UserData {
    id: uuid;
    name: string;
    public_name: string;
    status: UserStatus;
    created_at: string | Date;
}
export interface UserProfile extends UserData {
    email: string;
    user_name: string;
    private_name: string;
}
export interface UserProfileUpdate {
    birthdate?: string | Date;
    email: string;
    user_name: string;
    public_name: string;
    private_name: string;
}
export interface UserProfileNotify {
    notify_device: boolean;
    notify_email: boolean;
}
