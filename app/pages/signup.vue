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
              v-model="form.username"
              class="modal__input"
              :class="{ 'modal__input--error': errors.username }"
              type="text"
              name="username"
              placeholder="Имя пользователя"
              @blur="validateField('username')"
            >
            <span v-if="errors.username" class="error-message">{{
              errors.username
            }}</span>
          </div>

          <div class="form-group">
            <input
              v-model="form.password"
              class="modal__input password-first"
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

          <div class="form-group">
            <input
              v-model="form.confirmPassword"
              class="modal__input password-double"
              :class="{ 'modal__input--error': errors.confirmPassword }"
              type="password"
              name="password"
              placeholder="Повторите пароль"
              @blur="validateField('confirmPassword')"
            >
            <span v-if="errors.confirmPassword" class="error-message">{{
              errors.confirmPassword
            }}</span>
          </div>

          <button class="modal__btn-primary" type="submit" :disabled="loading">
            <span v-if="loading" class="button-loading">
              <div class="loading-spinner" />
              Регистрация...
            </span>
            <span v-else>Зарегистрироваться</span>
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
  title: "Регистрация | Skypro.Music",
  meta: [
    {
      name: "description",
      content: "Зарегистрируйтесь в Skypro.Music",
    },
  ],
});

const { register } = useAuth();

const form = ref({
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
});

const errors = ref({
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
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
  username: [
    {
      test: (value) => !!value,
      message: "Поле имя пользователя обязательно для заполнения",
    },
    {
      test: (value) => value.length >= 3,
      message: "Имя пользователя должно содержать минимум 3 символа",
    },
  ],
  password: [
    {
      test: (value) => !!value,
      message: "Поле пароль обязательно для заполнения",
    },
    {
      test: (value) => value.length >= 6,
      message: "Пароль должен содержать минимум 6 символов",
    },
  ],
  confirmPassword: [
    {
      test: (value) => !!value,
      message: "Пожалуйста, подтвердите пароль",
    },
    {
      test: (value) => value === form.value.password,
      message: "Пароли не совпадают",
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
    await register(form.value.email, form.value.password, form.value.username);

    await navigateTo("/");
  } catch (error) {
    let errorMessage = "Ошибка регистрации";
    let statusCode = 400;

    if (error.message?.includes("Email уже занят")) {
      errorMessage = "Пользователь с таким email уже существует";
      statusCode = 403;
    } else if (error.message) {
      errorMessage = error.message;
    }

    showError({
      statusCode,
      statusMessage: "Ошибка регистрации",
      message: errorMessage,
      fatal: false,
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
@import url("~/assets/styles/auth.css");

.modal__form-login {
  padding: 43px 44px 47px 40px;
  height: auto;
  min-height: 500px;
}

.modal__form-login input:first-of-type {
  margin-bottom: 0;
}

.login {
  margin-bottom: 0;
}

.password-first {
  margin-bottom: 0;
}

.password-double {
  margin-bottom: 0;
}

.modal__btn-primary {
  margin-top: 30px;
  height: 62px;
}
</style>



