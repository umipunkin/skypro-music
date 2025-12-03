<template>
  <nav class="main__nav nav">
    <div class="nav__logo logo">
      <img class="logo__image" src="/img/logo.png" alt="Skypro Music" >
    </div>

    <div class="nav__burger burger" @click="toggleMenu">
      <span class="burger__line" />
      <span class="burger__line" />
      <span class="burger__line" />
    </div>

    <div class="nav__menu menu">
      <ul v-show="isMenuVisible" class="menu__list">
        <li class="menu__item">
          <NuxtLink to="/" class="menu__link">Главное</NuxtLink>
        </li>
        <li class="menu__item">
          <NuxtLink to="/favorites" class="menu__link">Мой плейлист</NuxtLink>
        </li>
        <li class="menu__item">
          <NuxtLink to="/category/electronic" class="menu__link"
            >Категории</NuxtLink
          >
        </li>
        <li class="menu__item">
          <NuxtLink to="/signin" class="menu__link">Войти</NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
const isMenuVisible = ref(true);

const toggleMenu = () => {
  isMenuVisible.value = !isMenuVisible.value;
};
</script>

<style scoped>
.main__nav {
  width: 244px;
  background-color: #181818;
  padding: 20px 0 20px 36px;
}

.nav__logo {
  width: 113.33px;
  height: 43px;
  padding: 13px 0 13px 0;
  background-color: transparent;
  margin-bottom: 20px;
}

.nav__burger {
  width: 20px;
  height: 36px;
  padding: 13px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  margin-bottom: 20px;
}

.burger__line {
  display: inline-block;
  width: 100%;
  height: 1px;
  background-color: #d3d3d3;
}

.nav__burger:hover .burger__line {
  background-color: #b672ff;
}

.nav__menu {
  display: block;
  visibility: visible;
}

.menu__list {
  padding: 18px 0 10px 0;
}

.menu__item {
  padding: 5px 0;
  margin-bottom: 16px;
}

.menu__link {
  color: #ffffff;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-decoration: none;
}

.menu__link:hover {
  color: #b672ff;
}

.logo__image {
  width: 113.33px;
  height: 17px;
  color: #181818;
}
</style>
