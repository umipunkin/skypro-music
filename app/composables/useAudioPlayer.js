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

    if (!track) {
      console.error("Трек не передан");
      return;
    }

    try {
      playerStore.setCurrentTrack(track);
      playerStore.audioRef.src = track.url || "#";
      playerStore.audioRef.load();
      playerStore.setProgress(0);

      await playerStore.audioRef.play();
      playerStore.setPlaying(true);

      console.log("Трек начал играть:", track.title);
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

  const prevTrack = async () => {
    const prev = playerStore.goToPrevTrack();

    if (prev) {
      await playTrack(prev);
    } else {
      console.log("Предыдущий трек не найден");
    }
  };

  const nextTrack = async () => {
    console.log("nextTrack вызван");
    const next = playerStore.goToNextTrack();
    console.log("Получен следующий трек:", next?.title);

    if (next) {
      await playTrack(next);
    } else {
      console.log("Следующий трек не найден");
    }
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
