export const useAuth = () => {
  const user = ref(null);
  const isAuthenticated = ref(false);
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

      if (import.meta.client) {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("accessToken", tokenResponse.access);
        localStorage.setItem("refreshToken", tokenResponse.refresh);
      }

      user.value = userData;
      isAuthenticated.value = true;

      return userData;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    if (import.meta.client) {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
    user.value = null;
    isAuthenticated.value = false;
  };

  const refreshToken = async () => {
    if (import.meta.client) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        logout();
        return null;
      }

      try {
        const response = await $fetch(`${API_URL}/user/token/refresh/`, {
          method: "POST",
          body: JSON.stringify({
            refresh: refreshToken,
          }),
          headers: {
            "content-type": "application/json",
          },
        });

        localStorage.setItem("accessToken", response.access);
        return response.access;
      } catch (error) {
        console.error("Token refresh error:", error);
        logout();
        return null;
      }
    }
  };

  const checkAuth = () => {
    if (import.meta.client) {
      const savedUser = localStorage.getItem("user");
      const accessToken = localStorage.getItem("accessToken");

      if (savedUser && accessToken) {
        user.value = JSON.parse(savedUser);
        isAuthenticated.value = true;
      }
    }
  };

  const getAccessToken = () => {
    if (import.meta.client) {
      return localStorage.getItem("accessToken");
    }
    return null;
  };

  if (import.meta.client) {
    checkAuth();
  }

  return {
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    loading: readonly(loading),
    register,
    login,
    logout,
    refreshToken,
    checkAuth,
    getAccessToken,
  };
};
