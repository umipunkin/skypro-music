export const cleanTrackTitle = (title) => {
  if (!title) return 'Без названия'

  let cleanedTitle = title
  cleanedTitle = cleanedTitle.replace(/https?:\/\/[^\s]+/g, '')
  cleanedTitle = cleanedTitle.replace(
    /\.(mp3|wav|flac|aac|ogg|m4a|wav)/gi,
    ''
  )
  cleanedTitle = cleanedTitle.replace(/\s+/g, ' ').trim()

  return cleanedTitle || 'Без названия'
}

export const getErrorMessage = (error) => {
  if (error.name === 'AbortError' || error.message?.includes('timeout')) {
    return 'Превышено время ожидания сервера. Проверьте подключение к интернету.'
  } else if (error.message?.includes('Failed to fetch')) {
    return 'Не удалось подключиться к серверу. Проверьте подключение к интернету.'
  } else if (error.response?.status === 404) {
    return 'Сервер временно недоступен. Попробуйте позже.'
  } else if (error.response?.status >= 500) {
    return 'Ошибка на сервере. Попробуйте позже.'
  } else {
    return (
      error.message ||
      'Не удалось загрузить треки. Попробуйте обновить страницу.'
    )
  }
}

export const validateEmail = (email) => {
  if (!email) return 'Поле email обязательно для заполнения'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Введите корректный email'
  }
  return ''
}

export const validatePassword = (password) => {
  if (!password) return 'Поле пароль обязательно для заполнения'
  if (password.length < 6) return 'Пароль должен содержать минимум 6 символов'
  return ''
}

export const validateUsername = (username) => {
  if (!username) return 'Поле имя пользователя обязательно для заполнения'
  if (username.length < 3) return 'Имя пользователя должно содержать минимум 3 символа'
  return ''
}