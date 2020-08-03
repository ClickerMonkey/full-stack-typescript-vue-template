import { api } from '@/plugins/api';
import { UserProfile, UserProfileUpdate, Auth, RegisterRequest, LoginRequest } from 'common';

export const server = 
{
  auth: {
    async get (): Promise<Auth> {
      return api.get('/auth');
    },
    async register (data: RegisterRequest): Promise<Auth> {
      return api.post('/auth', data);
    },
    async login (data: LoginRequest): Promise<Auth> {
      return api.put('/auth', data);
    },
    async logout (): Promise<void> {
      return api.delete('/auth');
    }
  },
  user: {
    profile: {
      async get (): Promise<UserProfile> {
        return api.get('/user/profile');
      },
      async update (data: UserProfileUpdate): Promise<void> {
        return api.put('/user/profile', data);
      },
      async destroy (): Promise<void> {
        return api.delete('/user/profile');
      }
    }
  }
};