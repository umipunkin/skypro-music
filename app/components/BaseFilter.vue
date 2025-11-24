<template>
  <div v-if="isOpen" class="filter__dropdown dropdown">
    <div class="dropdown__content">
      <div class="dropdown__list">
        <div
          v-for="item in items"
          :key="item"
          class="dropdown__item"
          :class="{ 'dropdown__item--active': selectedItems.includes(item) }"
          @click="toggleItem(item)"
        >
          <span class="dropdown__text">{{ item }}</span>
          <span class="dropdown__checkbox" />
        </div>
      </div>
      <div class="dropdown__actions">
        <button class="dropdown__clear" @click="clearSelection">
          Очистить
        </button>
        <button class="dropdown__apply" @click="applyFilters">Применить</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  items: {
    type: Array,
    default: () => [],
  },
  selectedItems: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:selectedItems", "apply"]);

const toggleItem = (item) => {
  const updated = props.selectedItems.includes(item)
    ? props.selectedItems.filter((i) => i !== item)
    : [...props.selectedItems, item];
  emit("update:selectedItems", updated);
};

const clearSelection = () => {
  emit("update:selectedItems", []);
};

const applyFilters = () => {
  emit("apply");
};
</script>

<style scoped>
.filter__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background: #313131;
  border-radius: 12px;
  padding: 34px;
  min-width: 248px;
  max-height: 305px;
  overflow-y: auto;
  z-index: 1000;
  margin-top: 10px;
}

.dropdown__list {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.dropdown__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  color: #ffffff;
  font-size: 20px;
  line-height: 24px;
  transition: color 0.3s ease;
}

.dropdown__item:hover {
  color: #b672ff;
  text-decoration: underline;
}

.dropdown__item--active {
  color: #b672ff;
}

.dropdown__checkbox {
  width: 18px;
  height: 18px;
  border: 1px solid #ffffff;
  border-radius: 2px;
  position: relative;
}

.dropdown__item--active .dropdown__checkbox {
  background: #b672ff;
  border-color: #b672ff;
}

.dropdown__item--active .dropdown__checkbox::after {
  content: "✓";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ffffff;
  font-size: 12px;
}

.dropdown__actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: flex-end;
}

.dropdown__clear,
.dropdown__apply {
  padding: 8px 16px;
  border: none;
  border-radius: 60px;
  cursor: pointer;
  font-size: 16px;
}

.dropdown__clear {
  background: transparent;
  color: #ffffff;
  border: 1px solid #ffffff;
}

.dropdown__apply {
  background: #b672ff;
  color: #ffffff;
}
</style>
