<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <aside
      class="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col"
    >
      <div class="p-6 border-b border-gray-200 dark:border-gray-800">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Store Admin</h2>
      </div>

      <nav class="flex-1 p-4">
        <UNavigationMenu
          orientation="vertical"
          :items="navItems"
          highlight
          class="w-full"
        />
      </nav>

      <div class="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
        <UButton
          to="/"
          variant="soft"
          color="neutral"
          block
          icon="i-lucide-arrow-left"
        >
          На сайт
        </UButton>
        <UButton
          variant="subtle"
          color="error"
          block
          icon="i-lucide-log-out"
          @click="onLogout"
        >
          Выйти
        </UButton>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 p-8 overflow-y-auto">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { logout } = useAuth();
const router = useRouter();

const navItems = [
  [
    {
      label: 'Категории',
      icon: 'i-lucide-folder',
      to: '/admin/categories',
    },
    {
      label: 'Товары',
      icon: 'i-lucide-shopping-bag',
      to: '/admin/products',
    }
  ]
];

const onLogout = () => {
  logout();
  router.push('/admin/login');
};
</script>
