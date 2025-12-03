import { defineStore } from "pinia";

export const usePlayerStore = defineStore("player", {
  state: () => ({
    currentTrack: null,
    playlist: [],
    isPlaying: false,
    progress: 0,
    volume: 50,
    audioRef: null,
    isShuffle: false,
    isRepeat: false,
  }),

  getters: {
    hasTracks: (state) => state.playlist.length > 0,
  },

  actions: {
    setCurrentTrack(track) {
      this.currentTrack = track;
    },

    setPlaylist(tracks) {
      this.playlist = tracks;
      this.originalPlaylist = [...tracks];
    },

    setProgress(progress) {
      this.progress = progress;
    },

    setVolume(volume) {
      this.volume = volume;
    },

    setPlaying(isPlaying) {
      this.isPlaying = isPlaying;
    },

    setAudioRef(element) {
      this.audioRef = element;
      if (this.audioRef) {
        this.audioRef.volume = this.volume / 100;
      }
    },

    toggleShuffle() {
      this.isShuffle = !this.isShuffle;

      if (this.isShuffle) {
        if (this.originalPlaylist.length === 0) {
          this.originalPlaylist = [...this.playlist];
        }
      } else {
        if (this.originalPlaylist.length > 0) {
          this.playlist = [...this.originalPlaylist];
        }
      }
    },

    getRandomTrack() {
      if (this.playlist.length === 0) return null;
      if (this.playlist.length === 1) return this.playlist[0];

      const availableTracks = this.currentTrack
        ? this.playlist.filter((track) => track.id !== this.currentTrack.id)
        : [...this.playlist];

      if (availableTracks.length === 0) return null;

      const randomIndex = Math.floor(Math.random() * availableTracks.length);
      return availableTracks[randomIndex];
    },

    toggleRepeat() {
      this.isRepeat = !this.isRepeat;
    },

    getNextTrack() {
      if (this.playlist.length === 0) return null;

      if (this.isRepeat && this.currentTrack) {
        return this.currentTrack;
      }

      if (this.isShuffle) {
        const randomTrack = this.getRandomTrack();
        return randomTrack || this.playlist[0];
      }

      if (!this.currentTrack) {
        return this.playlist[0];
      }

      const currentIndex = this.playlist.findIndex(
        (track) => track.id === this.currentTrack.id
      );

      if (currentIndex === -1) {
        return this.playlist[0];
      }

      const nextIndex = (currentIndex + 1) % this.playlist.length;
      return this.playlist[nextIndex];
    },

    getPrevTrack() {
      if (this.playlist.length === 0) return null;

      if (this.isShuffle) {
        const randomTrack = this.getRandomTrack();
        return randomTrack || this.playlist[0];
      }

      if (!this.currentTrack) {
        return this.playlist[this.playlist.length - 1];
      }

      const currentIndex = this.playlist.findIndex(
        (track) => track.id === this.currentTrack.id
      );

      if (currentIndex === -1) {
        return this.playlist[this.playlist.length - 1];
      }

      const prevIndex =
        currentIndex === 0 ? this.playlist.length - 1 : currentIndex - 1;
      return this.playlist[prevIndex];
    },

    goToNextTrack() {
      const nextTrack = this.getNextTrack();
      if (nextTrack) {
        this.setCurrentTrack(nextTrack);
        return nextTrack;
      }
      return null;
    },

    goToPrevTrack() {
      const prevTrack = this.getPrevTrack();
      if (prevTrack) {
        this.setCurrentTrack(prevTrack);
        return prevTrack;
      }
      return null;
    },

    addToPlaylist(track) {
      if (!this.playlist.some((t) => t.id === track.id)) {
        this.playlist.push(track);
        this.originalPlaylist.push(track);
      }
    },

    removeFromPlaylist(trackId) {
      const index = this.playlist.findIndex((track) => track.id === trackId);
      if (index !== -1) {
        this.playlist.splice(index, 1);
        this.originalPlaylist = this.originalPlaylist.filter(
          (track) => track.id !== trackId
        );

        if (this.currentTrack && this.currentTrack.id === trackId) {
          if (this.playlist.length > 0) {
            this.setCurrentTrack(this.playlist[0]);
          } else {
            this.setCurrentTrack(null);
          }
        }
      }
    },

    clearPlaylist() {
      this.playlist = [];
      this.originalPlaylist = [];
      this.currentTrack = null;
      this.isPlaying = false;
    },
  },
});
