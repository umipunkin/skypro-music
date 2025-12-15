<template>
  <div class="wrapper">
    <div class="container-auth">
      <div class="modal__block">
        <form class="modal__form-login" @submit.prevent="handleSubmit">
          <NuxtLink to="/">
            <div class="modal__logo">
              <NuxtImg 
                src="/img/logo_modal.png" 
                alt="logo" 
                width="140" 
                height="21"
              />
            </div>
          </NuxtLink>

          <div class="form-group">
            <input
              v-model="form.email"
              class="modal__input login"
              :class="{ 'modal__input--error': errors.email }"
              type="text"
              name="login"
              placeholder="Почта"
              @blur="validateField('email')"
            >
            <span v-if="errors.email" class="error-message">{{
              errors.email
            }}</span>
          </div>

          <div class="form-group">
            <input
              v-model="form.password"
              class="modal__input password"
              :class="{ 'modal__input--error': errors.password }"
              type="password"
              name="password"
              placeholder="Пароль"
              @blur="validateField('password')"
            >
            <span v-if="errors.password" class="error-message">{{
              errors.password
            }}</span>
          </div>

          <button class="modal__btn-primary" type="submit" :disabled="loading">
            <span v-if="loading" class="button-loading">
              <div class="loading-spinner" />
              Вход...
            </span>
            <span v-else>Войти</span>
          </button>

          <button
            class="modal__btn-secondary"
            type="button"
            @click="navigateToSignup"
          >
            Зарегистрироваться
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "auth",
});

useHead({
  title: "Вход | Skypro.Music",
  meta: [
    {
      name: "description",
      content: "Войдите в ваш аккаунт Skypro.Music",
    },
  ],
});

const { login } = useAuth();

const form = ref({
  email: "",
  password: "",
});

const errors = ref({
  email: "",
  password: "",
});

const loading = ref(false);

const validationRules = {
  email: [
    {
      test: (value) => !!value,
      message: "Поле email обязательно для заполнения",
    },
    {
      test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: "Введите корректный email",
    },
  ],
  password: [
    {
      test: (value) => !!value,
      message: "Поле пароль обязательно для заполнения",
    },
  ],
};

const validateField = (fieldName) => {
  const value = form.value[fieldName];
  const rules = validationRules[fieldName];

  for (const rule of rules) {
    if (!rule.test(value)) {
      errors.value[fieldName] = rule.message;
      return false;
    }
  }

  errors.value[fieldName] = "";
  return true;
};

const validateForm = () => {
  let isValid = true;

  Object.keys(validationRules).forEach((field) => {
    if (!validateField(field)) {
      isValid = false;
    }
  });

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  loading.value = true;

  try {
    await login(form.value.email, form.value.password);

    await navigateTo("/");
  } catch (error) {
    let errorMessage = "Ошибка входа";
    let statusCode = 400;

    if (error.message?.includes("не найден")) {
      errorMessage = "Неверный email или пароль";
      statusCode = 401;
    } else if (error.message) {
      errorMessage = error.message;
    }

    showError({
      statusCode,
      statusMessage: "Ошибка авторизации",
      message: errorMessage,
      fatal: false,
    });
  } finally {
    loading.value = false;
  }
};

const navigateToSignup = () => {
  navigateTo("/signup");
};
</script>

<style scoped>
@import url("~/assets/styles/auth.css");

.modal__form-login input:first-of-type {
  margin-bottom: 0;
}

.login {
  margin-bottom: 0;
}

.password {
  margin-bottom: 0;
}
</style>



