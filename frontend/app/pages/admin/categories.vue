<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center bg-white dark:bg-gray-950 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Управление категориями</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Создавайте категории и подкатегории для товаров</p>
      </div>
      <UButton
        icon="i-lucide-plus"
        color="primary"
        size="md"
        class="rounded-xl shadow-sm hover:scale-[1.02] transition-transform duration-200"
        @click="openCreateModal"
      >
        Создать категорию
      </UButton>
    </div>

    <!-- Table Card -->
    <UCard class="rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden" :ui="{ body: 'p-0' }">
      <UTable :columns="columns" :data="categories || []">
        <!-- Parent Category Custom Render -->
        <template #parent_id-cell="{ row }">
          <span class="text-sm font-medium text-gray-600 dark:text-gray-300">
            {{ getCategoryName(row.original.parent_id) }}
          </span>
        </template>

        <!-- Actions Custom Render -->
        <template #actions-cell="{ row }">
          <div class="flex items-center gap-2">
            <UButton
              icon="i-lucide-pencil"
              color="primary"
              variant="ghost"
              size="sm"
              class="hover:bg-primary-50 dark:hover:bg-primary-950/30 rounded-lg"
              @click="openEditModal(row.original)"
            />
            <UButton
              icon="i-lucide-trash-2"
              color="error"
              variant="ghost"
              size="sm"
              class="hover:bg-error-50 dark:hover:bg-error-950/30 rounded-lg"
              :loading="deletingId === row.original.id"
              @click="deleteCategory(row.original.id)"
            />
          </div>
        </template>
      </UTable>

      <!-- Empty State -->
      <div v-if="!categories?.length && status !== 'pending'" class="flex flex-col items-center justify-center py-12 px-4 text-center">
        <UIcon name="i-lucide-folder-open" class="w-12 h-12 text-gray-300 dark:text-gray-700 mb-3" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Нет категорий</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm mt-1">
          Вы еще не создали ни одной категории. Нажмите кнопку выше, чтобы добавить первую.
        </p>
      </div>
    </UCard>

    <!-- Create / Edit Modal -->
    <UModal v-model:open="isOpen" :title="editId ? 'Редактировать категорию' : 'Создать категорию'" :description="editId ? 'Измените информацию о категории товара' : 'Заполните информацию о новой категории товара'">
      <template #body>
        <UForm :state="formState" class="space-y-4" @submit="onSubmit">
          <UFormField label="Название (UA)" name="name_uk" required>
            <UInput v-model="formState.name_uk" placeholder="Например: Кросівки" class="w-full" size="md" />
          </UFormField>

          <UFormField label="Название (EN)" name="name_en">
            <UInput v-model="formState.name_en" placeholder="Например: Sneakers" class="w-full" size="md" />
          </UFormField>

          <UFormField label="Родительская категория" name="parent_id">
            <USelect
              v-model="formState.parent_id"
              :items="parentCategoryItems"
              placeholder="Выберите категорию (если это подкатегория)"
              class="w-full"
              size="md"
            />
          </UFormField>

          <div class="flex justify-end gap-3 pt-4">
            <UButton variant="ghost" color="neutral" @click="isOpen = false">
              Отмена
            </UButton>
            <UButton type="submit" color="primary" :loading="submitting">
              {{ editId ? 'Сохранить' : 'Создать' }}
            </UButton>
          </div>
        </UForm>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';

definePageMeta({
  layout: 'admin',
});

const config = useRuntimeConfig();
const apiBase = config.public.apiBase;
const toast = useToast();

// Fetch categories from Backend
const { data: categories, refresh, status } = await useFetch<any[]>(`${apiBase}/categories`);

// Columns Definition
const columns = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name_uk', header: 'Название (UA)' },
  { accessorKey: 'name_en', header: 'Название (EN)' },
  { accessorKey: 'parent_id', header: 'Родительская категория' },
  { id: 'actions', header: 'Действия' },
];

// Modal & Form State
const isOpen = ref(false);
const submitting = ref(false);
const deletingId = ref<number | null>(null);
const editId = ref<number | null>(null);

const formState = reactive({
  name_uk: '',
  name_en: '',
  parent_id: 'null',
});

// Helper: Get Category Name by ID
const getCategoryName = (parentId: number | null) => {
  if (!parentId) return '— (Главная)';
  const cat = categories.value?.find((c) => c.id === parentId);
  return cat ? `${cat.name_uk} (${cat.name_en || 'EN'})` : '—';
};

// Computed parent items for select dropdown
const parentCategoryItems = computed(() => {
  const items = [
    { label: '— Нет (Сделать главной)', value: 'null' }
  ];
  if (categories.value) {
    categories.value.forEach((cat) => {
      items.push({
        label: `${cat.name_uk} (${cat.name_en || 'EN'})`,
        value: String(cat.id),
      });
    });
  }
  return items;
});

const openCreateModal = () => {
  editId.value = null;
  formState.name_uk = '';
  formState.name_en = '';
  formState.parent_id = 'null';
  isOpen.value = true;
};

const openEditModal = (category: any) => {
  editId.value = category.id;
  formState.name_uk = category.name_uk;
  formState.name_en = category.name_en || '';
  formState.parent_id = category.parent_id ? String(category.parent_id) : 'null';
  isOpen.value = true;
};

// Submit Category (Create or Edit)
const onSubmit = async () => {
  if (!formState.name_uk) return;
  submitting.value = true;

  try {
    const payload = {
      name_uk: formState.name_uk,
      name_en: formState.name_en || undefined,
      parent_id: (formState.parent_id && formState.parent_id !== 'null') ? Number(formState.parent_id) : null,
    };

    const { token } = useAuth();
    if (editId.value) {
      await $fetch(`${apiBase}/categories/${editId.value}`, {
        method: 'PATCH',
        body: payload,
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      toast.add({
        title: 'Успешно',
        description: 'Категория обновлена',
        color: 'success',
      });
    } else {
      await $fetch(`${apiBase}/categories`, {
        method: 'POST',
        body: payload,
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      toast.add({
        title: 'Успешно',
        description: 'Категория добавлена',
        color: 'success',
      });
    }

    isOpen.value = false;
    await refresh();
  } catch (error: any) {
    console.error(error);
    const msg = error.data?.message || 'Не удалось сохранить категорию';
    toast.add({
      title: 'Ошибка',
      description: Array.isArray(msg) ? msg.join(', ') : msg,
      color: 'error',
    });
  } finally {
    submitting.value = false;
  }
};

// Delete Category
const deleteCategory = async (id: number) => {
  if (!confirm('Вы уверены, что хотите удалить эту категорию?')) return;
  deletingId.value = id;

  try {
    const { token } = useAuth();
    await $fetch(`${apiBase}/categories/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    toast.add({
      title: 'Успешно',
      description: 'Категория удалена',
      color: 'success',
    });

    await refresh();
  } catch (error: any) {
    console.error(error);
    const msg = error.data?.message || 'Не удалось удалить категорию';
    toast.add({
      title: 'Ошибка удаления',
      description: Array.isArray(msg) ? msg.join(', ') : msg,
      color: 'error',
    });
  } finally {
    deletingId.value = null;
  }
};
</script>
