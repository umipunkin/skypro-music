import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { usePlayerStore } from "./player";

describe("Player Store - чистые функции и логика", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe("getNextTrack", () => {
    it("возвращает первый трек если текущего нет", () => {
      const store = usePlayerStore();
      const tracks = [
        { id: "1", title: "Track 1" },
        { id: "2", title: "Track 2" },
      ];
      store.playlist = tracks;

      const nextTrack = store.getNextTrack();
      expect(nextTrack).toEqual(tracks[0]);
    });

    it("возвращает следующий трек в обычном режиме", () => {
      const store = usePlayerStore();
      const tracks = [
        { id: "1", title: "Track 1" },
        { id: "2", title: "Track 2" },
        { id: "3", title: "Track 3" },
      ];
      store.playlist = tracks;
      store.currentTrack = tracks[0];

      const nextTrack = store.getNextTrack();
      expect(nextTrack).toEqual(tracks[1]);
    });

    it("возвращает текущий трек в режиме повтора одного", () => {
      const store = usePlayerStore();
      const tracks = [
        { id: "1", title: "Track 1" },
        { id: "2", title: "Track 2" },
      ];
      store.playlist = tracks;
      store.currentTrack = tracks[0];
      store.loopMode = "one";

      const nextTrack = store.getNextTrack();
      expect(nextTrack).toEqual(tracks[0]);
    });

    it("возвращает первый трек при достижении конца в режиме повтора всех", () => {
      const store = usePlayerStore();
      const tracks = [
        { id: "1", title: "Track 1" },
        { id: "2", title: "Track 2" },
      ];
      store.playlist = tracks;
      store.currentTrack = tracks[1];
      store.loopMode = "all";

      const nextTrack = store.getNextTrack();
      expect(nextTrack).toEqual(tracks[0]);
    });

    it("возвращает null при достижении конца без повтора", () => {
      const store = usePlayerStore();
      const tracks = [
        { id: "1", title: "Track 1" },
        { id: "2", title: "Track 2" },
      ];
      store.playlist = tracks;
      store.currentTrack = tracks[1];
      store.loopMode = "off";

      const nextTrack = store.getNextTrack();
      expect(nextTrack).toBeNull();
    });

    it("возвращает случайный трек в режиме перемешивания", () => {
      const store = usePlayerStore();
      const tracks = [
        { id: "1", title: "Track 1" },
        { id: "2", title: "Track 2" },
        { id: "3", title: "Track 3" },
      ];
      store.playlist = tracks;
      store.currentTrack = tracks[0];
      store.isShuffle = true;

      const nextTrack = store.getNextTrack();
      expect(nextTrack).not.toBeNull();
      expect(tracks).toContain(nextTrack);
      expect(nextTrack.id).not.toBe("1");
    });
  });

  describe("getPrevTrack", () => {
    it("возвращает последний трек если текущего нет", () => {
      const store = usePlayerStore();
      const tracks = [
        { id: "1", title: "Track 1" },
        { id: "2", title: "Track 2" },
      ];
      store.playlist = tracks;

      const prevTrack = store.getPrevTrack();
      expect(prevTrack).toEqual(tracks[1]);
    });

    it("возвращает предыдущий трек в обычном режиме", () => {
      const store = usePlayerStore();
      const tracks = [
        { id: "1", title: "Track 1" },
        { id: "2", title: "Track 2" },
        { id: "3", title: "Track 3" },
      ];
      store.playlist = tracks;
      store.currentTrack = tracks[1];

      const prevTrack = store.getPrevTrack();
      expect(prevTrack).toEqual(tracks[0]);
    });

    it("возвращает последний трек при достижении начала в режиме повтора всех", () => {
      const store = usePlayerStore();
      const tracks = [
        { id: "1", title: "Track 1" },
        { id: "2", title: "Track 2" },
      ];
      store.playlist = tracks;
      store.currentTrack = tracks[0];
      store.loopMode = "all";

      const prevTrack = store.getPrevTrack();
      expect(prevTrack).toEqual(tracks[1]);
    });
  });

  describe("getRandomTrack", () => {
    it("возвращает null для пустого плейлиста", () => {
      const store = usePlayerStore();
      store.playlist = [];

      const randomTrack = store.getRandomTrack();
      expect(randomTrack).toBeNull();
    });

    it("возвращает единственный трек", () => {
      const store = usePlayerStore();
      const tracks = [{ id: "1", title: "Track 1" }];
      store.playlist = tracks;

      const randomTrack = store.getRandomTrack();
      expect(randomTrack).toEqual(tracks[0]);
    });

    it("возвращает случайный трек, отличный от текущего", () => {
      const store = usePlayerStore();
      const tracks = [
        { id: "1", title: "Track 1" },
        { id: "2", title: "Track 2" },
        { id: "3", title: "Track 3" },
      ];
      store.playlist = tracks;
      store.currentTrack = tracks[0];

      const randomTrack = store.getRandomTrack();
      expect(tracks).toContain(randomTrack);
      expect(randomTrack.id).not.toBe("1");
    });

    it("возвращает любой трек если все треки одинаковые", () => {
      const store = usePlayerStore();
      const tracks = [
        { id: "1", title: "Track" },
        { id: "2", title: "Track" },
      ];
      store.playlist = tracks;
      store.currentTrack = tracks[0];

      const randomTrack = store.getRandomTrack();
      expect(tracks).toContain(randomTrack);
    });
  });

  describe("toggleLoop", () => {
    it("переключает режим повтора по циклу", () => {
      const store = usePlayerStore();

      expect(store.loopMode).toBe("off");

      store.toggleLoop();
      expect(store.loopMode).toBe("one");

      store.toggleLoop();
      expect(store.loopMode).toBe("all");

      store.toggleLoop();
      expect(store.loopMode).toBe("off");
    });

    it("возвращает новый режим повтора", () => {
      const store = usePlayerStore();

      let result = store.toggleLoop();
      expect(result).toBe("one");

      result = store.toggleLoop();
      expect(result).toBe("all");

      result = store.toggleLoop();
      expect(result).toBe("off");
    });
  });

  describe("handleTrackEnd", () => {
    it("возвращает текущий трек в режиме повтора одного", () => {
      const store = usePlayerStore();
      const track = { id: "1", title: "Track 1" };
      store.currentTrack = track;
      store.loopMode = "one";

      const nextTrack = store.handleTrackEnd();
      expect(nextTrack).toEqual(track);
    });

    it("возвращает следующий трек и обновляет currentTrack", () => {
      const store = usePlayerStore();
      const tracks = [
        { id: "1", title: "Track 1" },
        { id: "2", title: "Track 2" },
      ];
      store.playlist = tracks;
      store.currentTrack = tracks[0];

      const nextTrack = store.handleTrackEnd();
      expect(nextTrack).toEqual(tracks[1]);
      expect(store.currentTrack).toEqual(tracks[1]);
    });

    it("останавливает воспроизведение при достижении конца без повтора", () => {
      const store = usePlayerStore();
      const tracks = [
        { id: "1", title: "Track 1" },
        { id: "2", title: "Track 2" },
      ];
      store.playlist = tracks;
      store.currentTrack = tracks[1];
      store.loopMode = "off";
      store.isPlaying = true;

      const nextTrack = store.handleTrackEnd();
      expect(nextTrack).toBeNull();
      expect(store.isPlaying).toBe(false);
      expect(store.progress).toBe(100);
    });
  });

  describe("addToPlaylist и removeFromPlaylist", () => {
    it("добавляет трек в плейлист", () => {
      const store = usePlayerStore();
      const track = { id: "1", title: "Track 1" };

      store.addToPlaylist(track);
      expect(store.playlist).toContainEqual(track);
      expect(store.originalPlaylist).toContainEqual(track);
    });

    it("не добавляет дубликаты", () => {
      const store = usePlayerStore();
      const track = { id: "1", title: "Track 1" };

      store.addToPlaylist(track);
      store.addToPlaylist(track);

      expect(store.playlist).toHaveLength(1);
      expect(store.originalPlaylist).toHaveLength(1);
    });

    it("удаляет трек из плейлиста", () => {
      const store = usePlayerStore();
      const tracks = [
        { id: "1", title: "Track 1" },
        { id: "2", title: "Track 2" },
      ];
      store.playlist = tracks;
      store.originalPlaylist = [...tracks];

      store.removeFromPlaylist("1");

      expect(store.playlist).toHaveLength(1);
      expect(store.playlist[0].id).toBe("2");
      expect(store.originalPlaylist).toHaveLength(1);
      expect(store.originalPlaylist[0].id).toBe("2");
    });

    it("обновляет currentTrack при удалении текущего трека", () => {
      const store = usePlayerStore();
      const tracks = [
        { id: "1", title: "Track 1" },
        { id: "2", title: "Track 2" },
      ];
      store.playlist = tracks;
      store.originalPlaylist = [...tracks];
      store.currentTrack = tracks[0];

      store.removeFromPlaylist("1");

      expect(store.currentTrack).toEqual(tracks[1]);
    });

    it("сбрасывает currentTrack если плейлист пустой", () => {
      const store = usePlayerStore();
      const track = { id: "1", title: "Track 1" };
      store.playlist = [track];
      store.originalPlaylist = [track];
      store.currentTrack = track;

      store.removeFromPlaylist("1");

      expect(store.currentTrack).toBeNull();
    });
  });

  describe("clearPlaylist", () => {
    it("очищает весь плейлист", () => {
      const store = usePlayerStore();
      const tracks = [
        { id: "1", title: "Track 1" },
        { id: "2", title: "Track 2" },
      ];
      store.playlist = tracks;
      store.originalPlaylist = tracks;
      store.currentTrack = tracks[0];
      store.isPlaying = true;

      store.clearPlaylist();

      expect(store.playlist).toHaveLength(0);
      expect(store.originalPlaylist).toHaveLength(0);
      expect(store.currentTrack).toBeNull();
      expect(store.isPlaying).toBe(false);
    });
  });
});
