import { uuid } from './core';
export interface Auth {
    id: uuid;
    email: string;
    private_name: string;
    public_name: string;
    user_name: string;
}
export interface RegisterRequest {
    email: string;
    password: string;
    user_name: string;
    public_name: string;
    private_name: string;
    interests?: string[];
    search_location?: Coordinates;
}
export interface LoginRequest {
    id: string;
    password: string;
}
