import { defineStore } from "pinia";

export const useFiltersStore = defineStore("filters", {
  state: () => ({
    activeFilters: {
      authors: [],
      years: [],
      genres: [],
    },
    searchQuery: "",
    isFiltersApplied: false,
  }),

  getters: {
    hasActiveFilters: (state) => {
      return (
        state.activeFilters.authors.length > 0 ||
        state.activeFilters.years.length > 0 ||
        state.activeFilters.genres.length > 0
      );
    },

    getActiveFiltersCount: (state) => {
      return (
        state.activeFilters.authors.length +
        state.activeFilters.years.length +
        state.activeFilters.genres.length
      );
    },
  },

  actions: {
    setFilters(filters) {
      this.activeFilters = { ...this.activeFilters, ...filters };
      this.isFiltersApplied = this.hasActiveFilters;
      this.saveToLocalStorage();
    },

    setSearchQuery(query) {
      this.searchQuery = query;
      this.saveToLocalStorage();
    },

    clearAllFilters() {
      this.activeFilters = {
        authors: [],
        years: [],
        genres: [],
      };
      this.searchQuery = "";
      this.isFiltersApplied = false;
      this.saveToLocalStorage();
    },

    clearFilterType(filterType) {
      if (this.activeFilters[filterType]) {
        this.activeFilters[filterType] = [];
        this.isFiltersApplied = this.hasActiveFilters;
        this.saveToLocalStorage();
      }
    },

    loadFromLocalStorage() {
      if (import.meta.client) {
        const saved = localStorage.getItem("filtersState");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            this.activeFilters = parsed.activeFilters || this.activeFilters;
            this.searchQuery = parsed.searchQuery || "";
            this.isFiltersApplied = parsed.isFiltersApplied || false;
          } catch (error) {
            console.error("Error loading filters from localStorage:", error);
          }
        }
      }
    },

    saveToLocalStorage() {
      if (import.meta.client) {
        try {
          localStorage.setItem(
            "filtersState",
            JSON.stringify({
              activeFilters: this.activeFilters,
              searchQuery: this.searchQuery,
              isFiltersApplied: this.isFiltersApplied,
            })
          );
        } catch (error) {
          console.error("Error saving filters to localStorage:", error);
        }
      }
    },
  },
});
