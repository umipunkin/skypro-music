import { usePlayerStore } from "~/stores/player";

export function useAudioPlayer() {
  const playerStore = usePlayerStore();

  const initPlayer = (element) => {
    if (!element) {
      console.error("Аудио элемент не найден");
      return;
    }

    playerStore.setAudioRef(element);

    if (playerStore.audioRef) {
      playerStore.audioRef.volume = playerStore.volume / 100;
    }
  };

  const togglePlayPause = async () => {
    if (!playerStore.audioRef) {
      console.error("Плеер не инициализирован");
      return;
    }

    if (!playerStore.currentTrack) {
      console.error("Трек не выбран");
      return;
    }

    try {
      if (playerStore.isPlaying) {
        await playerStore.audioRef.pause();
        playerStore.setPlaying(false);
      } else {
        if (!playerStore.audioRef.src && playerStore.currentTrack.url) {
          playerStore.audioRef.src = playerStore.currentTrack.url;
        }

        await playerStore.audioRef.play();
        playerStore.setPlaying(true);
      }
    } catch (error) {
      console.error("Ошибка управления воспроизведением:", error);
      playerStore.setPlaying(false);
    }
  };

  const playTrack = async (track) => {
    if (!playerStore.audioRef) {
      console.error("Плеер не инициализирован");
      return;
    }

    try {
      if (
        !playerStore.currentTrack ||
        playerStore.currentTrack.id !== track.id
      ) {
        playerStore.setCurrentTrack(track);
        playerStore.audioRef.src = track.url || "";

        playerStore.setProgress(0);
        playerStore.audioRef.load();
      }

      await playerStore.audioRef.play();
      playerStore.setPlaying(true);
    } catch (error) {
      console.error("Ошибка воспроизведения трека:", error);
      playerStore.setPlaying(false);
    }
  };

  const updateVolume = () => {
    if (!playerStore.audioRef) {
      console.error("Плеер не инициализирован");
      return;
    }

    const volumeValue = playerStore.volume / 100;
    playerStore.audioRef.volume = volumeValue;
  };

  const seekTo = (percentage) => {
    if (!playerStore.audioRef || !playerStore.currentTrack) {
      console.error("Плеер или трек не готов");
      return;
    }

    const safePercentage = Math.max(0, Math.min(100, percentage));

    if (
      playerStore.audioRef.duration &&
      !isNaN(playerStore.audioRef.duration)
    ) {
      const newTime = (safePercentage / 100) * playerStore.audioRef.duration;
      playerStore.audioRef.currentTime = newTime;
      playerStore.setProgress(safePercentage);
    }
  };

  const handleTimeUpdate = () => {
    if (!playerStore.audioRef) return;

    const currentTime = playerStore.audioRef.currentTime;
    const duration = playerStore.audioRef.duration;

    if (duration && !isNaN(duration)) {
      const progress = (currentTime / duration) * 100;
      playerStore.setProgress(progress);
    }
  };

  const handleTrackEnd = () => {
    playerStore.setPlaying(false);
    playerStore.setProgress(100);
  };

  const prevTrack = () => {
    if (!playerStore.currentTrack || playerStore.playlist.length === 0) {
      return;
    }

    const currentIndex = playerStore.playlist.findIndex(
      (track) => track.id === playerStore.currentTrack.id
    );

    if (currentIndex === -1) {
      return;
    }

    let prevIndex;
    if (currentIndex === 0) {
      prevIndex = playerStore.playlist.length - 1;
    } else {
      prevIndex = currentIndex - 1;
    }

    const prevTrack = playerStore.playlist[prevIndex];
    playTrack(prevTrack);
  };

  const nextTrack = () => {
    if (!playerStore.currentTrack || playerStore.playlist.length === 0) {
      return;
    }

    const currentIndex = playerStore.playlist.findIndex(
      (track) => track.id === playerStore.currentTrack.id
    );

    if (currentIndex === -1) {
      return;
    }

    let nextIndex;
    if (currentIndex === playerStore.playlist.length - 1) {
      nextIndex = 0;
    } else {
      nextIndex = currentIndex + 1;
    }

    const nextTrack = playerStore.playlist[nextIndex];
    playTrack(nextTrack);
  };

  return {
    initPlayer,
    playTrack,
    togglePlayPause,
    handleTimeUpdate,
    handleTrackEnd,
    seekTo,
    updateVolume,
    prevTrack,
    nextTrack,
  };
}
