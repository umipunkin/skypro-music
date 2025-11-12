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
      console.log("Плеер инициализирован, громкость:", playerStore.volume);
    }
  };

  const togglePlayPause = async () => {
    console.log("togglePlayPause вызван, isPlaying:", playerStore.isPlaying);
    console.log("audioRef:", playerStore.audioRef);
    console.log("currentTrack:", playerStore.currentTrack);

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
        console.log("Ставим на паузу");
        await playerStore.audioRef.pause();
        playerStore.setPlaying(false);
      } else {
        console.log("Начинаем воспроизведение");

        if (!playerStore.audioRef.src && playerStore.currentTrack.track_file) {
          playerStore.audioRef.src = playerStore.currentTrack.track_file;
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
    console.log("playTrack вызван с треком:", track);

    if (!playerStore.audioRef) {
      console.error("Плеер не инициализирован");
      return;
    }

    try {
      if (
        !playerStore.currentTrack ||
        playerStore.currentTrack.id !== track.id
      ) {
        console.log("Загружаем новый трек:", track.title);
        playerStore.setCurrentTrack(track);
        playerStore.audioRef.src = track.track_file || track.url;

        playerStore.setProgress(0);

        playerStore.audioRef.load();
      }

      console.log("Запускаем воспроизведение");
      await playerStore.audioRef.play();
      playerStore.setPlaying(true);
      console.log("Воспроизведение запущено успешно");
    } catch (error) {
      console.error("Ошибка воспроизведения трека:", error);
      playerStore.setPlaying(false);
    }
  };

  const updateVolume = () => {
    console.log("updateVolume вызван, volume:", playerStore.volume);

    if (!playerStore.audioRef) {
      console.error("Плеер не инициализирован");
      return;
    }

    const volumeValue = playerStore.volume / 100;
    playerStore.audioRef.volume = volumeValue;
    console.log("Громкость установлена на:", volumeValue);
  };

  const seekTo = (percentage) => {
    console.log("seekTo вызван, процент:", percentage);

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
      console.log("Перемотка на время:", newTime, "сек");
    } else {
      console.log("Длительность трека еще не загружена");
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
    console.log("Трек завершен");
    playerStore.setPlaying(false);
    playerStore.setProgress(100);
  };

  return {
    initPlayer,
    playTrack,
    togglePlayPause,
    handleTimeUpdate,
    handleTrackEnd,
    seekTo,
    updateVolume,
  };
}
