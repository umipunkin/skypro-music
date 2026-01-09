import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
  }),

  getters: {
    getUser: (state) => state.user,
    getIsAuthenticated: (state) => state.isAuthenticated,
    getAccessToken: (state) => state.accessToken,
    getRefreshToken: (state) => state.refreshToken,
    getUserName: (state) =>
      state.user?.username || state.user?.email || "Гость",
  },

  actions: {
    setUser(userData) {
      this.user = userData.user || userData;
      this.isAuthenticated = true;

      if (userData.tokens) {
        this.accessToken = userData.tokens.access;
        this.refreshToken = userData.tokens.refresh;
      } else if (userData.access && userData.refresh) {
        this.accessToken = userData.access;
        this.refreshToken = userData.refresh;
      }

      if (import.meta.client) {
        try {
          localStorage.setItem("user", JSON.stringify(this.user));
          if (this.accessToken) {
            localStorage.setItem("accessToken", this.accessToken);
          }
          if (this.refreshToken) {
            localStorage.setItem("refreshToken", this.refreshToken);
          }
          localStorage.setItem("isAuthenticated", "true");
        } catch (storageError) {
          console.error("Ошибка при сохранении в localStorage:", storageError);
        }
      }
    },

    clearUser() {
      this.user = null;
      this.isAuthenticated = false;
      this.accessToken = null;
      this.refreshToken = null;

      if (import.meta.client) {
        try {
          localStorage.removeItem("user");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("favoriteTracks");
        } catch (storageError) {
          console.error("Ошибка при очистке localStorage:", storageError);
        }
      }
    },

    restoreUser() {
      if (!import.meta.client) {
        return false;
      }

      try {
        const savedUser = localStorage.getItem("user");
        const savedAccessToken = localStorage.getItem("accessToken");
        const savedRefreshToken = localStorage.getItem("refreshToken");
        const savedIsAuthenticated = localStorage.getItem("isAuthenticated");

        if (savedUser && savedAccessToken && savedIsAuthenticated === "true") {
          this.user = JSON.parse(savedUser);
          this.accessToken = savedAccessToken;
          this.refreshToken = savedRefreshToken;
          this.isAuthenticated = true;
          console.log("Пользователь восстановлен из localStorage");
          return true;
        }
      } catch (parseError) {
        console.error("Ошибка при восстановлении пользователя:", parseError);
        this.clearUser();
      }

      return false;
    },

    updateAccessToken(newAccessToken) {
      this.accessToken = newAccessToken;
      if (import.meta.client && newAccessToken) {
        localStorage.setItem("accessToken", newAccessToken);
      }
    },

    updateUser(userData) {
      if (this.user) {
        this.user = { ...this.user, ...userData };
        if (import.meta.client) {
          localStorage.setItem("user", JSON.stringify(this.user));
        }
      }
    },

    isAdmin() {
      return this.user?.role === "admin" || this.user?.is_admin === true;
    },

    hasPermission(permission) {
      if (!this.user?.permissions) return false;
      return this.user.permissions.includes(permission);
    },

    updateFavoriteTracks(favoriteTracks) {
      if (this.user) {
        this.user.favoriteTracks = favoriteTracks;
        if (import.meta.client) {
          localStorage.setItem("user", JSON.stringify(this.user));
        }
      }
    },

    getFavoriteTracks() {
      if (import.meta.client) {
        try {
          const saved = localStorage.getItem("favoriteTracks");
          return saved ? JSON.parse(saved) : [];
        } catch (parseError) {
          console.error("Ошибка при получении избранных треков:", parseError);
          return [];
        }
      }
      return this.user?.favoriteTracks || [];
    },

    saveUserSettings(settings) {
      if (this.user) {
        this.user.settings = { ...(this.user.settings || {}), ...settings };
        if (import.meta.client) {
          localStorage.setItem("user", JSON.stringify(this.user));
        }
        return true;
      }
      return false;
    },

    getUserSettings() {
      return this.user?.settings || {};
    },

    isTokenValid() {
      if (!this.accessToken) return false;

      try {
        const parts = this.accessToken.split(".");
        return parts.length === 3;
      } catch {
        return false;
      }
    },
  },

  persist: {
    enabled: false,
  },
});

export const useUser = () => {
  const store = useUserStore();

  if (import.meta.client) {
    onMounted(() => {
      store.restoreUser();
    });
  }

  return store;
};
