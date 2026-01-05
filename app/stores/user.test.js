import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useUserStore } from "./user";

describe("User Store - чистые функции и логика", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe("getters", () => {
    it('getUserName возвращает "Гость" если пользователь не авторизован', () => {
      const store = useUserStore();
      expect(store.getUserName).toBe("Гость");
    });

    it("getUserName возвращает username если есть", () => {
      const store = useUserStore();
      store.user = { username: "JohnDoe" };
      expect(store.getUserName).toBe("JohnDoe");
    });

    it("getUserName возвращает email если нет username", () => {
      const store = useUserStore();
      store.user = { email: "john@example.com" };
      expect(store.getUserName).toBe("john@example.com");
    });

    it("getUserName возвращает email если username пустой", () => {
      const store = useUserStore();
      store.user = { username: "", email: "john@example.com" };
      expect(store.getUserName).toBe("john@example.com");
    });
  });

  describe("isAdmin", () => {
    it("возвращает false если пользователь не авторизован", () => {
      const store = useUserStore();
      expect(store.isAdmin()).toBe(false);
    });

    it("возвращает true если роль admin", () => {
      const store = useUserStore();
      store.user = { role: "admin" };
      expect(store.isAdmin()).toBe(true);
    });

    it("возвращает true если is_admin true", () => {
      const store = useUserStore();
      store.user = { is_admin: true };
      expect(store.isAdmin()).toBe(true);
    });
  });

  describe("hasPermission", () => {
    it("возвращает false если пользователь не авторизован", () => {
      const store = useUserStore();
      expect(store.hasPermission("read")).toBe(false);
    });

    it("возвращает false если нет permissions", () => {
      const store = useUserStore();
      store.user = { username: "test" };
      expect(store.hasPermission("read")).toBe(false);
    });

    it("возвращает true если есть permission", () => {
      const store = useUserStore();
      store.user = { permissions: ["read", "write"] };
      expect(store.hasPermission("read")).toBe(true);
      expect(store.hasPermission("write")).toBe(true);
    });
  });

  describe("updateUser", () => {
    it("обновляет данные пользователя", () => {
      const store = useUserStore();
      store.user = { username: "old", email: "old@example.com" };

      store.updateUser({ username: "new", extra: "data" });

      expect(store.user).toEqual({
        username: "new",
        email: "old@example.com",
        extra: "data",
      });
    });
  });

  describe("updateAccessToken", () => {
    it("обновляет access token", () => {
      const store = useUserStore();

      store.updateAccessToken("new-token");

      expect(store.accessToken).toBe("new-token");
    });
  });
});
