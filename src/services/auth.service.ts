import { mockApi } from "@/services/mock/api";

/** Auth service. Replace mockApi.auth with a real REST client later. */
export const authService = {
  login: mockApi.auth.login,
  demoLogin: mockApi.auth.demoLogin,
  register: mockApi.auth.register,
  logout: mockApi.auth.logout,
  getCurrentUser: mockApi.auth.getCurrentUser,
};
