import { vi } from 'vitest'
import { config } from '@vue/test-utils'

vi.stubGlobal('localStorage', {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
})

vi.stubGlobal('console', {
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
  debug: vi.fn()
})

const NuxtLinkStub = {
  name: 'NuxtLink',
  props: ['to', 'href'],
  template: '<a :href="to || href"><slot /></a>',
  setup(props, { slots }) {
    return () => slots.default?.()
  }
}

const NuxtImgStub = {
  name: 'NuxtImg',
  props: ['src', 'alt', 'width', 'height', 'loading'],
  template: '<img :src="src" :alt="alt" :width="width" :height="height" :loading="loading" />'
}

config.global.stubs = {
  NuxtLink: NuxtLinkStub,
  NuxtImg: NuxtImgStub,
  ClientOnly: {
    template: '<div><slot /></div>'
  }
}

vi.mock('#app', () => ({
  useNuxtApp: () => ({
    $router: { push: vi.fn() },
    runWithContext: vi.fn()
  }),
  defineNuxtComponent: (comp) => comp,
  useRouter: () => ({ 
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn()
  }),
  useRoute: () => ({ 
    path: '/',
    params: {},
    query: {}
  }),
  navigateTo: vi.fn(),
  useHead: vi.fn(),
  useSeoMeta: vi.fn(),
  useRuntimeConfig: () => ({
    public: {
      apiBase: 'https://webdev-music-003b5b991590.herokuapp.com'
    }
  }),
  definePageMeta: vi.fn()
}))

vi.mock('#imports', () => ({
  // Композиции Vue
  ref: (val) => ({ value: val }),
  computed: (fn) => ({ value: fn() }),
  reactive: (obj) => obj,
  watch: vi.fn(),
  watchEffect: vi.fn(),
  
  onMounted: vi.fn(),
  onUnmounted: vi.fn(),
  onBeforeMount: vi.fn(),
  onBeforeUnmount: vi.fn(),
  onUpdated: vi.fn(),
  
  useAsyncData: vi.fn(() => ({ data: null, pending: false, error: null })),
  useLazyAsyncData: vi.fn(() => ({ data: null, pending: false, error: null })),
  useFetch: vi.fn(() => ({ data: null, pending: false, error: null })),
  useLazyFetch: vi.fn(() => ({ data: null, pending: false, error: null })),
  useState: vi.fn((key, init) => {
    const state = typeof init === 'function' ? init() : init
    return { value: state }
  }),
  
  abortNavigation: vi.fn(),
  setPageLayout: vi.fn(),
  
  useServerSeoMeta: vi.fn()
}))

vi.mock('pinia', async () => {
  const actual = await vi.importActual('pinia')
  return {
    ...actual,
    defineStore: vi.fn((id, options) => {
      const store = options()
      return () => store
    })
  }
})

global.ref = (val) => ({ value: val })
global.computed = (fn) => ({ value: fn() })
global.reactive = (obj) => obj
global.watch = vi.fn()
global.watchEffect = vi.fn()

global.onMounted = vi.fn()
global.onUnmounted = vi.fn()
global.onBeforeMount = vi.fn()
global.onBeforeUnmount = vi.fn()
global.onUpdated = vi.fn()

global.useAsyncData = vi.fn(() => ({ data: null, pending: false, error: null }))
global.useFetch = vi.fn(() => ({ data: null, pending: false, error: null }))
global.useState = vi.fn((key, init) => {
  const state = typeof init === 'function' ? init() : init
  return { value: state }
})

global.definePageMeta = vi.fn()

global.navigateTo = vi.fn()
global.abortNavigation = vi.fn()
global.setPageLayout = vi.fn()

global.useHead = vi.fn()
global.useSeoMeta = vi.fn()

vi.mock('~/composables/useAuth', () => ({
  useAuth: () => ({
    user: { value: null },
    isAuthenticated: { value: false },
    loading: { value: false },
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    refreshToken: vi.fn(),
    checkAuth: vi.fn(),
    getAccessToken: vi.fn()
  })
}))

vi.mock('~/composables/useTracks', () => ({
  useTracks: () => ({
    tracks: { value: [] },
    filteredTracks: { value: [] },
    loading: { value: false },
    error: { value: null },
    fetchTracks: vi.fn(),
    searchTracks: vi.fn(),
    clearAllFilters: vi.fn(),
    hasActiveFilters: { value: false },
    getActiveFiltersCount: { value: 0 },
    applyFilters: vi.fn()
  }),
  formatDuration: (seconds) => {
    if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
      return ''
    }
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }
}))

vi.mock('~/composables/useAudioPlayer', () => ({
  useAudioPlayer: () => ({
    initPlayer: vi.fn(),
    playTrack: vi.fn(),
    togglePlayPause: vi.fn(),
    handleTimeUpdate: vi.fn(),
    handleTrackEnd: vi.fn(),
    seekTo: vi.fn(),
    updateVolume: vi.fn(),
    prevTrack: vi.fn(),
    nextTrack: vi.fn()
  })
}))

vi.mock('~/stores/player', () => ({
  usePlayerStore: vi.fn(() => ({
    currentTrack: null,
    playlist: [],
    isPlaying: false,
    progress: 0,
    volume: 50,
    isShuffle: false,
    loopMode: 'off',
    setCurrentTrack: vi.fn(),
    setPlaylist: vi.fn(),
    setProgress: vi.fn(),
    setPlaying: vi.fn(),
    toggleShuffle: vi.fn(),
    toggleLoop: vi.fn(),
    goToNextTrack: vi.fn(),
    goToPrevTrack: vi.fn(),
    getRandomTrack: vi.fn(),
    getNextTrack: vi.fn(),
    getPrevTrack: vi.fn(),
    handleTrackEnd: vi.fn(),
    addToPlaylist: vi.fn(),
    removeFromPlaylist: vi.fn(),
    clearPlaylist: vi.fn()
  }))
}))

vi.mock('~/stores/user', () => ({
  useUserStore: vi.fn(() => ({
    user: null,
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    setUser: vi.fn(),
    clearUser: vi.fn(),
    restoreUser: vi.fn(),
    updateAccessToken: vi.fn(),
    updateUser: vi.fn(),
    isAdmin: vi.fn(() => false),
    hasPermission: vi.fn(() => false),
    getUserName: 'Гость',
    getFavoriteTracks: vi.fn(() => []),
    updateFavoriteTracks: vi.fn(),
    saveUserSettings: vi.fn(),
    getUserSettings: vi.fn(() => ({})),
    isTokenValid: vi.fn(() => false)
  }))
}))

vi.mock('~/stores/filters', () => ({
  useFiltersStore: vi.fn(() => ({
    activeFilters: {
      authors: [],
      years: [],
      genres: []
    },
    searchQuery: '',
    isFiltersApplied: false,
    hasActiveFilters: false,
    getActiveFiltersCount: 0,
    setFilters: vi.fn(),
    setSearchQuery: vi.fn(),
    clearAllFilters: vi.fn(),
    clearFilterType: vi.fn(),
    loadFromLocalStorage: vi.fn(),
    saveToLocalStorage: vi.fn()
  }))
}))