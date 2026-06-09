<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="w-full max-w-md">
      <!-- Card Container -->
      <UCard class="rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
        <template #header>
          <div class="text-center py-2">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Панель керування</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Увійдіть у систему для керування магазином</p>
          </div>
        </template>

        <UForm :state="formState" class="space-y-4" @submit="onLogin">
          <UFormField label="Ім’я користувача" name="username" required>
            <UInput v-model="formState.username" placeholder="admin" icon="i-lucide-user" class="w-full" size="md" />
          </UFormField>

          <UFormField label="Пароль" name="password" required>
            <UInput v-model="formState.password" type="password" placeholder="••••••••" icon="i-lucide-lock" class="w-full" size="md" />
          </UFormField>

          <div class="pt-2">
            <UButton type="submit" color="primary" block size="md" :loading="loading" class="rounded-xl shadow-sm hover:scale-[1.01] transition-transform duration-200">
              Увійти
            </UButton>
          </div>
        </UForm>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

definePageMeta({
  layout: false
});

const { login } = useAuth();
const router = useRouter();
const toast = useToast();
const loading = ref(false);

const formState = reactive({
  username: '',
  password: ''
});

const onLogin = async () => {
  if (!formState.username || !formState.password) return;
  loading.value = true;

  try {
    await login(formState.username, formState.password);
    toast.add({
      title: 'Успішно',
      description: 'Ви увійшли в систему',
      color: 'success'
    });
    router.push('/admin/categories');
  } catch (error: any) {
    console.error(error);
    const msg = error.data?.message || 'Неправильне ім’я користувача або пароль';
    toast.add({
      title: 'Помилка входу',
      description: msg,
      color: 'error'
    });
  } finally {
    loading.value = false;
  }
};
</script>
