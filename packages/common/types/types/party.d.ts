import { uuid } from './core';
import { PartyStatus } from '../enums/PartyStatus';
export interface PartyData {
    id: uuid;
    name: string;
    public_name: string;
    status: PartyStatus;
    created_at: string | Date;
}
export interface PartyDataProfile extends PartyData {
}
export interface PartyProfile extends PartyData {
    private_name: string;
}
export interface PartyProfileUpdate {
    public_name: string;
    private_name: string;
}
