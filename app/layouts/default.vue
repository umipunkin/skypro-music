<template>
  <div class="wrapper">
    <div class="container">
      <main class="main">
        <AppNavbar />

        <div class="main__centerblock centerblock">
          <slot />
        </div>

        <div class="main__sidebar sidebar">
          <div class="sidebar__personal">
            <p class="sidebar__personal-name">Sergey.Ivanov</p>
            <div class="sidebar__icon">
              <svg>
                <use xlink:href="/img/icon/sprite.svg#logout" />
              </svg>
            </div>
          </div>
          <div class="sidebar__block">
            <div class="sidebar__list">
              <div class="sidebar__item">
                <a class="sidebar__link" href="#">
                  <img
                    class="sidebar__img"
                    src="/img/playlist01.png"
                    alt="day's playlist"
                  >
                </a>
              </div>
              <div class="sidebar__item">
                <a class="sidebar__link" href="#">
                  <img
                    class="sidebar__img"
                    src="/img/playlist02.png"
                    alt="day's playlist"
                  >
                </a>
              </div>
              <div class="sidebar__item">
                <a class="sidebar__link" href="#">
                  <img
                    class="sidebar__img"
                    src="/img/playlist03.png"
                    alt="day's playlist"
                  >
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PlayerBar />

      <footer class="footer" />
    </div>
  </div>
</template>

<script setup>
useHead({
  title: "Skypro.Music - Ваша музыкальная коллекция",
  meta: [
    {
      name: "description",
      content:
        "Слушайте лучшую музыку онлайн. Создавайте плейлисты и открывайте новые треки.",
    },
    {
      name: "keywords",
      content: "музыка, треки, плейлисты, онлайн радио, skypro",
    },
    {
      property: "og:title",
      content: "Skypro.Music - Ваша музыкальная коллекция",
    },
    { property: "og:description", content: "Слушайте лучшую музыку онлайн" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Skypro.Music" },
    { name: "twitter:description", content: "Слушайте лучшую музыку онлайн" },
  ],
  link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang: "ru",
  },
});
</script>

<style scoped>
.wrapper {
  width: 100%;
  min-height: 100%;
  overflow: hidden;
  background-color: #383838;
}

.container {
  max-width: 1920px;
  height: 100vh;
  margin: 0 auto;
  position: relative;
  background-color: #181818;
}

.main {
  flex: 1 1 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.main__centerblock {
  width: auto;
  max-width: 50vw;
  flex-grow: 3;
  padding: 20px 40px 20px 111px;
}

.main__sidebar {
  max-width: 418px;
  padding: 20px 90px 20px 78px;
}

.sidebar__personal {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 12px 0 15px 0;
}

.sidebar__personal-name {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  margin-right: 16px;
}

.sidebar__icon {
  width: 43px;
  height: 43px;
  background-color: #313131;
  border-radius: 50%;
  cursor: pointer;
}

.sidebar__block {
  height: 100%;
  padding: 240px 0 0 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.sidebar__list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sidebar__item {
  width: 250px;
  height: 150px;
}

.sidebar__item:not(:last-child) {
  margin-bottom: 30px;
}

.sidebar__link {
  width: 100%;
  height: 100%;
}

.sidebar__img {
  width: 100%;
  height: auto;
}
</style>
