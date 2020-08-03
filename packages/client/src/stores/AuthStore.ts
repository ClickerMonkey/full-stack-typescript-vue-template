import { Module } from 'vuex-typescript-interface';
import { Auth, RegisterRequest, LoginRequest } from 'common';
import { server } from '@/plugins/server';
import { ResultFor } from 'valid8or';
import { IRootStore } from './RootStore';


export interface IAuthStore
{
  auth: Auth | null;
  loadLoading: boolean;
  registerLoading: boolean;
  registerFailures: ResultFor<RegisterRequest>;
  loginLoading: boolean;
  loginFailures: ResultFor<LoginRequest>;
  logoutLoading: boolean;

  readonly hasAuth: boolean;

  clearAuth (): void;
  clearFailures (): void;
  setAuth (auth: Auth | null): void;
  setLoadLoading (loading: boolean): void;
  setRegisterLoading (loading: boolean): void;
  setRegisterFailures (registerFailures: ResultFor<RegisterRequest>): void;
  setLoginLoading (loading: boolean): void;
  setLoginFailures (loginFailures: ResultFor<LoginRequest>): void;
  setLogoutLoading (loading: boolean): void;

  load (): Promise<Auth | null>;
  register (data: RegisterRequest): Promise<Auth | null>;
  login (data: LoginRequest): Promise<Auth | null>;
  logout (): Promise<void>;
}

export const auth: Module<IAuthStore, IRootStore> = {
  namespaced: true,
  state: {
    auth: null,
    loadLoading: false,
    registerLoading: false,
    registerFailures: {},
    loginLoading: false,
    loginFailures: {},
    logoutLoading: false
  },
  getters: {
    hasAuth (state) {
      return !!state.auth;
    }
  },
  mutations: {
    clearAuth (state) {
      state.auth = null;
    },
    clearFailures (state) {
      state.registerFailures = {};
      state.loginFailures = {};
    },
    setAuth (state, auth) {
      state.auth = auth;
    },
    setLoadLoading (state, loading) {
      state.loadLoading = loading;
    },
    setRegisterLoading (state, loading) {
      state.registerLoading = loading;
    },
    setRegisterFailures (state, registerFailures) {
      state.registerFailures = registerFailures;
    },
    setLoginLoading (state, loading) {
      state.loginLoading = loading;
    },
    setLoginFailures (state, loginFailures) {
      state.loginFailures = loginFailures;
    },
    setLogoutLoading (state, loading) {
      state.logoutLoading = loading;
    }
  },
  actions: {
    async load ({ commit }) {
      let auth = await server.auth.get();
      commit('setLoadLoading', true);
      commit('setAuth', auth);
      commit('setLoadLoading', false);
      return auth;
    },
    async register ({ commit }, data: RegisterRequest) {
      let auth = null
      commit('setRegisterLoading', true);
      try {
        commit('clearFailures');
        commit('setAuth', auth = await server.auth.register(data));
      } catch (e) {
        commit('setRegisterFailures', e.failures);
      }
      commit('setRegisterLoading', false);
      return auth;
    },
    async login ({ commit }, data: LoginRequest) {
      let auth = null
      commit('setLoginLoading', true);
      try {
        commit('clearFailures');
        commit('setAuth', auth = await server.auth.login(data));
      } catch (e) {
        commit('setLoginFailures', e.failures);
      }
      commit('setLoginLoading', false);
      return auth;
    },
    async logout ({ commit }) {
      commit('setLogoutLoading', true);
      try {
        await server.auth.logout();
      } catch { }
      commit('setAuth', null);
      commit('setLogoutLoading', false);
    }
  }
};