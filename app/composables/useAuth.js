import { useUserStore } from "~/stores/user";

export const useAuth = () => {
  const userStore = useUserStore();
  const loading = ref(false);

  const API_URL = "https://webdev-music-003b5b991590.herokuapp.com";

  const register = async (email, password, username) => {
    loading.value = true;
    try {
      const response = await $fetch(`${API_URL}/user/signup/`, {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          username,
        }),
        headers: {
          "content-type": "application/json",
        },
      });

      if (response.success) {
        await login(email, password);
        return response;
      } else {
        throw new Error(response.message || "Ошибка регистрации");
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const login = async (email, password) => {
    loading.value = true;
    try {
      const userResponse = await $fetch(`${API_URL}/user/login/`, {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
        headers: {
          "content-type": "application/json",
        },
      });

      const tokenResponse = await $fetch(`${API_URL}/user/token/`, {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
        headers: {
          "content-type": "application/json",
        },
      });

      const userData = {
        ...userResponse,
        tokens: tokenResponse,
      };

      userStore.setUser(userData);

      return userData;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    userStore.clearUser();
  };

  const refreshToken = async () => {
    if (!userStore.refreshToken) {
      userStore.clearUser();
      return null;
    }

    try {
      const response = await $fetch(`${API_URL}/user/token/refresh/`, {
        method: "POST",
        body: JSON.stringify({
          refresh: userStore.refreshToken,
        }),
        headers: {
          "content-type": "application/json",
        },
      });

      userStore.updateAccessToken(response.access);
      return response.access;
    } catch (error) {
      console.error("Token refresh error:", error);
      userStore.clearUser();
      return null;
    }
  };

  const checkAuth = () => {
    return userStore.restoreUser();
  };

  const getAccessToken = () => {
    return userStore.accessToken;
  };

  if (import.meta.client) {
    checkAuth();
  }

  return {
    user: computed(() => userStore.user),
    isAuthenticated: computed(() => userStore.isAuthenticated),
    loading: readonly(loading),
    register,
    login,
    logout,
    refreshToken,
    checkAuth,
    getAccessToken,
  };
};
