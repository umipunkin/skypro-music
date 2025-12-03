<template>
  <div>
    <slot />
  </div>
</template>

<script setup>
useHead({
  bodyAttrs: {
    class: "auth-layout",
  },
});
</script>

<style>
.auth-layout {
  background-color: rgba(0, 0, 0, 0.85);
  margin: 0;
  padding: 0;
}
</style>
