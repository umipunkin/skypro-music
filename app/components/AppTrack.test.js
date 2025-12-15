import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import AppTrack from "./AppTrack.vue";

const mockSetPlaylist = vi.fn();
vi.mock("~/stores/player", () => ({
  usePlayerStore: () => ({
    setPlaylist: mockSetPlaylist,
    playlist: [],
  }),
}));

const mockPlayTrack = vi.fn();
vi.mock("~/composables/useAudioPlayer", () => ({
  useAudioPlayer: () => ({
    playTrack: mockPlayTrack,
  }),
}));

describe("AppTrack.vue", () => {
  const mockTrack = {
    id: "1",
    title: "Test Track",
    subtitle: "Test Subtitle",
    author: "Test Author",
    album: "Test Album",
    duration: "3:45",
  };

  const mockPlaylist = [
    mockTrack,
    {
      id: "2",
      title: "Another Track",
      subtitle: "Another Subtitle",
      author: "Another Author",
      album: "Another Album",
      duration: "4:20",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockSetPlaylist.mockReset();
    mockPlayTrack.mockReset();

    vi.spyOn(Storage.prototype, "getItem");
    vi.spyOn(Storage.prototype, "setItem");
    localStorage.clear();
  });

  it("рендерит компонент с корректными данными", () => {
    const wrapper = mount(AppTrack, {
      props: {
        track: mockTrack,
        playlist: mockPlaylist,
      },
    });

    expect(wrapper.text()).toContain(mockTrack.title);
    expect(wrapper.text()).toContain(mockTrack.author);
    expect(wrapper.text()).toContain(mockTrack.album);
    expect(wrapper.text()).toContain(mockTrack.duration);
    expect(wrapper.text()).toContain(mockTrack.subtitle);
  });

  it("загружает избранные треки из localStorage при монтировании", () => {
    const favoriteTracks = [{ id: "1" }, { id: "3" }];
    localStorage.setItem("favoriteTracks", JSON.stringify(favoriteTracks));

    mount(AppTrack, {
      props: {
        track: mockTrack,
        playlist: mockPlaylist,
      },
    });

    expect(localStorage.getItem).toHaveBeenCalledWith("favoriteTracks");
  });

  it("переключает избранное при клике на сердечко", async () => {
    const wrapper = mount(AppTrack, {
      props: {
        track: mockTrack,
        playlist: mockPlaylist,
      },
    });

    const favoriteButton = wrapper.find(".favorite-btn");
    await favoriteButton.trigger("click");

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "favoriteTracks",
      JSON.stringify([mockTrack])
    );
  });

  it("удаляет трек из избранного если он уже там есть", async () => {
    const favoriteTracks = [mockTrack, { id: "2" }];
    localStorage.setItem("favoriteTracks", JSON.stringify(favoriteTracks));

    const wrapper = mount(AppTrack, {
      props: {
        track: mockTrack,
        playlist: mockPlaylist,
      },
    });

    const favoriteButton = wrapper.find(".favorite-btn");
    await favoriteButton.trigger("click");

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "favoriteTracks",
      JSON.stringify([{ id: "2" }])
    );
  });

  it("при клике на трек вызывает playTrack", async () => {
    const wrapper = mount(AppTrack, {
      props: {
        track: mockTrack,
        playlist: mockPlaylist,
      },
    });

    const trackElement = wrapper.find(".playlist__item");
    await trackElement.trigger("click");

    expect(mockPlayTrack).toHaveBeenCalledWith(mockTrack);
  });

  it("добавляет класс favorite-active для избранных треков", async () => {
    const favoriteTracks = [mockTrack];
    localStorage.setItem("favoriteTracks", JSON.stringify(favoriteTracks));

    const wrapper = mount(AppTrack, {
      props: {
        track: mockTrack,
        playlist: mockPlaylist,
      },
    });

    const svgElement = wrapper.find(".track__time-svg");
    expect(svgElement.classes()).toContain("favorite-active");
  });

  it("не добавляет класс favorite-active для не избранных треков", () => {
    localStorage.setItem("favoriteTracks", JSON.stringify([]));

    const wrapper = mount(AppTrack, {
      props: {
        track: mockTrack,
        playlist: mockPlaylist,
      },
    });

    const svgElement = wrapper.find(".track__time-svg");
    expect(svgElement.classes()).not.toContain("favorite-active");
  });

  it("останавливает всплытие события при клике на сердечко", async () => {
    const wrapper = mount(AppTrack, {
      props: {
        track: mockTrack,
        playlist: mockPlaylist,
      },
    });

    const favoriteButton = wrapper.find(".favorite-btn");

    const stopPropagation = vi.fn();
    const clickEvent = { stopPropagation };

    await favoriteButton.trigger("click", clickEvent);

    expect(stopPropagation).toHaveBeenCalled();
  });

  it("отображает изображение ноты по умолчанию", () => {
    const wrapper = mount(AppTrack, {
      props: {
        track: mockTrack,
        playlist: mockPlaylist,
      },
    });

    const noteSvg = wrapper.find(".track__title-svg");
    expect(noteSvg.exists()).toBe(true);
    expect(noteSvg.attributes("xlink:href")).toBe(
      "/img/icon/sprite.svg#icon-note"
    );
  });

  it("корректно обрабатывает трек без плейлиста", async () => {
    const wrapper = mount(AppTrack, {
      props: {
        track: mockTrack,
      },
    });

    const trackElement = wrapper.find(".playlist__item");
    await trackElement.trigger("click");

    expect(mockPlayTrack).toHaveBeenCalledWith(mockTrack);
  });

  it("проверяет, что избранное сохраняется в localStorage", async () => {
    const wrapper = mount(AppTrack, {
      props: {
        track: mockTrack,
        playlist: mockPlaylist,
      },
    });

    const favoriteButton = wrapper.find(".favorite-btn");
    await favoriteButton.trigger("click");

    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "favoriteTracks",
      JSON.stringify([mockTrack])
    );
  });
});
