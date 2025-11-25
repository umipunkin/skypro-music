<template>
  <div class="error-page">
    <div class="error-container">
      <div class="error-content">
        <h1 class="error-code">{{ error.statusCode }}</h1>
        <h2 class="error-title">{{ error.statusMessage }}</h2>
        <p class="error-message">{{ error.message }}</p>

        <div class="error-actions">
          <button class="error-btn-primary" @click="handleGoHome">
            На главную
          </button>
          <button class="error-btn-secondary" @click="handleGoBack">
            Назад
          </button>
        </div>

        <div class="error-links">
          <NuxtLink to="/signin" class="error-link">Войти</NuxtLink>
          <NuxtLink to="/signup" class="error-link"
            >Зарегистрироваться</NuxtLink
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const error = useError();

const handleGoHome = () => {
  clearError({ redirect: "/" });
};

const handleGoBack = () => {
  clearError({ redirect: "/signin" });
};
</script>

<style scoped>
.error-page {
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Montserrat", sans-serif;
}

.error-container {
  max-width: 500px;
  text-align: center;
  color: white;
}

.error-content {
  background: #ffffff;
  border-radius: 12px;
  padding: 40px;
  color: #333;
}

.error-code {
  font-size: 72px;
  font-weight: bold;
  color: #580ea2;
  margin-bottom: 20px;
}

.error-title {
  font-size: 24px;
  margin-bottom: 16px;
  color: #333;
}

.error-message {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
  line-height: 1.5;
}

.error-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 30px;
}

.error-btn-primary {
  padding: 12px 24px;
  background-color: #580ea2;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.error-btn-primary:hover {
  background-color: #3f007d;
}

.error-btn-secondary {
  padding: 12px 24px;
  background-color: transparent;
  color: #580ea2;
  border: 1px solid #580ea2;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.error-btn-secondary:hover {
  background-color: #f0f0f0;
}

.error-links {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.error-link {
  color: #580ea2;
  text-decoration: none;
  font-size: 14px;
}

.error-link:hover {
  text-decoration: underline;
}
</style>
