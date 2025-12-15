import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SignIn from './signin.vue'

vi.mock('#app', () => ({
  definePageMeta: vi.fn(),
  useHead: vi.fn(),
  useSeoMeta: vi.fn(),
  navigateTo: vi.fn(),
  useRouter: () => ({ push: vi.fn() })
}))

const mockLogin = vi.fn()
vi.mock('~/composables/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
    loading: { value: false }
  })
}))

describe('signin.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLogin.mockReset()
  })

  it('рендерит форму входа с корректными элементами', () => {
    const wrapper = mount(SignIn)

    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('input[name="login"]').exists()).toBe(true)
    expect(wrapper.find('input[name="password"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
    expect(wrapper.find('button[type="button"]').exists()).toBe(true)
  })

  it('отображает логотип со ссылкой на главную страницу', () => {
    const wrapper = mount(SignIn)

    const logoLink = wrapper.find('.modal__logo')
    expect(logoLink.exists()).toBe(true)
    
    const nuxtLink = wrapper.findComponent({ name: 'NuxtLink' })
    expect(nuxtLink.exists()).toBe(true)
    expect(nuxtLink.attributes('to')).toBe('/')
  })

  it('валидирует email поле', async () => {
    const wrapper = mount(SignIn)

    const emailInput = wrapper.find('input[name="login"]')
    
    await emailInput.setValue('')
    await emailInput.trigger('blur')
    
    expect(wrapper.find('.error-message').text()).toContain('Поле email обязательно для заполнения')

    await emailInput.setValue('invalid-email')
    await emailInput.trigger('blur')
    
    expect(wrapper.find('.error-message').text()).toContain('Введите корректный email')

    await emailInput.setValue('test@example.com')
    await emailInput.trigger('blur')
    
    expect(wrapper.find('.error-message').exists()).toBe(false)
  })

  it('валидирует password поле', async () => {
    const wrapper = mount(SignIn)

    const passwordInput = wrapper.find('input[name="password"]')
    
    await passwordInput.setValue('')
    await passwordInput.trigger('blur')
    
    expect(wrapper.find('.error-message').text()).toContain('Поле пароль обязательно для заполнения')

    await passwordInput.setValue('password123')
    await passwordInput.trigger('blur')
    
    expect(wrapper.find('.error-message').exists()).toBe(false)
  })

  it('отправляет форму с корректными данными', async () => {
    mockLogin.mockResolvedValue({})

    const wrapper = mount(SignIn)

    const emailInput = wrapper.find('input[name="login"]')
    const passwordInput = wrapper.find('input[name="password"]')
    
    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('password123')
    
    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
  })

  it('не отправляет форму при невалидных данных', async () => {
    const wrapper = mount(SignIn)

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    
    expect(mockLogin).not.toHaveBeenCalled()
    expect(wrapper.find('.error-message').exists()).toBe(true)
  })
})