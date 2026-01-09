import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useFiltersStore } from "./filters";

describe("Filters Store - чистые функции и логика", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe("getters", () => {
    it("hasActiveFilters возвращает false при отсутствии фильтров", () => {
      const store = useFiltersStore();
      expect(store.hasActiveFilters).toBe(false);
    });

    it("hasActiveFilters возвращает true при наличии фильтров", () => {
      const store = useFiltersStore();
      store.activeFilters = {
        authors: ["Artist 1"],
        years: [],
        genres: [],
      };
      expect(store.hasActiveFilters).toBe(true);
    });

    it("getActiveFiltersCount считает активные фильтры", () => {
      const store = useFiltersStore();
      store.activeFilters = {
        authors: ["Artist 1", "Artist 2"],
        years: [2020],
        genres: ["Rock", "Pop"],
      };
      expect(store.getActiveFiltersCount).toBe(5);
    });
  });

  describe("setFilters", () => {
    it("устанавливает новые фильтры", () => {
      const store = useFiltersStore();
      const newFilters = {
        authors: ["Artist 1"],
        years: [2020, 2021],
      };

      store.setFilters(newFilters);

      expect(store.activeFilters.authors).toEqual(["Artist 1"]);
      expect(store.activeFilters.years).toEqual([2020, 2021]);
      expect(store.activeFilters.genres).toEqual([]);
    });

    it("объединяет с существующими фильтрами", () => {
      const store = useFiltersStore();
      store.activeFilters = {
        authors: ["Existing Artist"],
        years: [2019],
        genres: ["Rock"],
      };

      store.setFilters({ years: [2020] });

      expect(store.activeFilters.authors).toEqual(["Existing Artist"]);
      expect(store.activeFilters.years).toEqual([2020]);
      expect(store.activeFilters.genres).toEqual(["Rock"]);
    });

    it("устанавливает isFiltersApplied", () => {
      const store = useFiltersStore();

      store.setFilters({ authors: ["Artist 1"] });
      expect(store.isFiltersApplied).toBe(true);

      store.setFilters({ authors: [] });
      expect(store.isFiltersApplied).toBe(false);
    });
  });

  describe("clearFilterType", () => {
    it("очищает конкретный тип фильтров", () => {
      const store = useFiltersStore();
      store.activeFilters = {
        authors: ["Artist 1", "Artist 2"],
        years: [2020],
        genres: ["Rock"],
      };

      store.clearFilterType("authors");

      expect(store.activeFilters.authors).toEqual([]);
      expect(store.activeFilters.years).toEqual([2020]);
      expect(store.activeFilters.genres).toEqual(["Rock"]);
    });

    it("обновляет isFiltersApplied после очистки", () => {
      const store = useFiltersStore();
      store.activeFilters = {
        authors: ["Artist 1"],
        years: [],
        genres: [],
      };
      store.isFiltersApplied = true;

      store.clearFilterType("authors");

      expect(store.isFiltersApplied).toBe(false);
    });
  });

  describe("clearAllFilters", () => {
    it("очищает все фильтры и поисковый запрос", () => {
      const store = useFiltersStore();
      store.activeFilters = {
        authors: ["Artist 1"],
        years: [2020],
        genres: ["Rock"],
      };
      store.searchQuery = "test query";
      store.isFiltersApplied = true;

      store.clearAllFilters();

      expect(store.activeFilters.authors).toEqual([]);
      expect(store.activeFilters.years).toEqual([]);
      expect(store.activeFilters.genres).toEqual([]);
      expect(store.searchQuery).toBe("");
      expect(store.isFiltersApplied).toBe(false);
    });
  });
});
