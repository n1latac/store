<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center bg-white dark:bg-gray-950 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Управление товарами</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Добавляйте товары, управляйте характеристиками и загружайте изображения</p>
      </div>
      <UButton
        icon="i-lucide-plus"
        color="primary"
        size="md"
        class="rounded-xl shadow-sm hover:scale-[1.02] transition-transform duration-200"
        @click="openCreateModal"
      >
        Создать товар
      </UButton>
    </div>

    <!-- Table Card -->
    <UCard class="rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden" :ui="{ body: 'p-0' }">
      <UTable :columns="columns" :data="products || []">
        <!-- Image Preview Render -->
        <template #image-cell="{ row }">
          <div class="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden flex items-center justify-center border border-gray-200 dark:border-gray-700">
            <img
              v-if="getProductImage(row.original)"
              :src="getProductImage(row.original)"
              class="object-cover w-full h-full"
              alt="Product thumbnail"
            />
            <UIcon v-else name="i-lucide-image" class="w-6 h-6 text-gray-400" />
          </div>
        </template>

        <!-- Category Render -->
        <template #category-cell="{ row }">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ row.original.category?.name_uk || '—' }}
          </span>
        </template>

        <!-- Price Render -->
        <template #price-cell="{ row }">
          <span class="font-semibold text-gray-900 dark:text-white">
            {{ formatPrice(row.original.price) }} грн
          </span>
        </template>

        <!-- Attributes Render -->
        <template #attributes-cell="{ row }">
          <div class="flex flex-wrap gap-1 max-w-[250px]">
            <span
              v-for="(val, key) in row.original.attributes"
              :key="key"
              class="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-md border border-gray-200 dark:border-gray-700"
            >
              {{ key }}: {{ val }}
            </span>
            <span v-if="!Object.keys(row.original.attributes || {}).length" class="text-gray-400 text-xs">
              —
            </span>
          </div>
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
              @click="deleteProduct(row.original.id)"
            />
          </div>
        </template>
      </UTable>

      <!-- Empty State -->
      <div v-if="!products?.length && status !== 'pending'" class="flex flex-col items-center justify-center py-12 px-4 text-center">
        <UIcon name="i-lucide-shopping-bag" class="w-12 h-12 text-gray-300 dark:text-gray-700 mb-3" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Нет товаров</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm mt-1">
          База данных товаров пуста. Нажмите кнопку выше, чтобы добавить первый товар.
        </p>
      </div>
    </UCard>

    <!-- Create / Edit Product Modal -->
    <UModal v-model:open="isOpen" :title="editId ? 'Редактировать товар' : 'Создать товар'" :description="editId ? 'Измените параметры товара и отредактируйте галерею' : 'Укажите параметры товара и загрузите фотографии'">
      <template #body>
        <UForm :state="formState" class="space-y-4" @submit="onSubmit">
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Название (UA)" name="name_uk" required>
              <UInput v-model="formState.name_uk" placeholder="Например: Кросівки Nike" class="w-full" size="md" />
            </UFormField>

            <UFormField label="Название (EN)" name="name_en" required>
              <UInput v-model="formState.name_en" placeholder="Например: Nike Sneakers" class="w-full" size="md" />
            </UFormField>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Цена (грн)" name="price" required>
              <UInput v-model.number="formState.price" type="number" placeholder="2500" class="w-full" size="md" />
            </UFormField>

            <UFormField label="Категория" name="category_id" required>
              <USelect
                v-model="formState.category_id"
                :items="categoryItems"
                placeholder="Выберите категорию"
                class="w-full"
                size="md"
              />
            </UFormField>
          </div>

          <!-- Dynamic Attributes (Характеристики) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Характеристики (Спецификации)
            </label>
            <div class="space-y-2">
              <div v-for="(attr, index) in dynamicAttrs" :key="index" class="flex items-center gap-2">
                <UInput v-model="attr.key" placeholder="Название (напр. Цвет)" class="flex-1" size="sm" />
                <UInput v-model="attr.value" placeholder="Значение (напр. Черный)" class="flex-1" size="sm" />
                <UButton icon="i-lucide-x" color="error" variant="ghost" size="sm" @click="removeAttributeRow(index)" />
              </div>
              <UButton
                icon="i-lucide-plus"
                variant="outline"
                size="sm"
                color="neutral"
                class="mt-1"
                @click="addAttributeRow"
              >
                Добавить характеристику
              </UButton>
            </div>
          </div>

          <!-- Existing Images Gallery (Only shown in Edit mode) -->
          <div v-if="editId && currentImages.length" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Текущие изображения товара
            </label>
            <div class="grid grid-cols-5 gap-3">
              <div
                v-for="img in currentImages"
                :key="img.id"
                class="relative aspect-square rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden group"
              >
                <img :src="img.image_url" class="object-cover w-full h-full" />
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-150">
                  <UButton
                    icon="i-lucide-trash-2"
                    color="error"
                    size="sm"
                    variant="solid"
                    type="button"
                    :loading="deletingImageId === img.id"
                    @click.stop="deleteExistingImage(img.id)"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Drag & Drop Upload Zone -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Изображения товара (Drag & Drop)
            </label>
            
            <!-- Upload Box -->
            <div
              class="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors duration-200"
              :class="isDragging ? 'border-primary-500 bg-primary-50/20 dark:bg-primary-950/10' : 'border-gray-300 dark:border-gray-700 hover:border-primary-500'"
              @dragover.prevent="isDragging = true"
              @dragleave="isDragging = false"
              @drop.prevent="onDrop"
              @click="fileInput?.click()"
            >
              <input
                ref="fileInput"
                type="file"
                multiple
                accept="image/*"
                class="hidden"
                @change="onFileChange"
              />
              <UIcon name="i-lucide-upload-cloud" class="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Перетащите сюда файлы картинок или кликните для выбора
              </p>
              <p class="text-xs text-gray-400 mt-1">Допускаются файлы JPG, PNG, WEBP (до 10 штук)</p>
            </div>

            <!-- Preview Images Grid -->
            <div v-if="uploadFiles.length" class="grid grid-cols-5 gap-3 mt-4">
              <div
                v-for="(fileObj, index) in uploadFiles"
                :key="index"
                class="relative aspect-square rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden group"
              >
                <img :src="fileObj.previewUrl" class="object-cover w-full h-full" />
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-150">
                  <UButton
                    icon="i-lucide-trash-2"
                    color="error"
                    size="sm"
                    variant="solid"
                    @click.stop="removeSelectedFile(index)"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <UButton variant="ghost" color="neutral" @click="isOpen = false">
              Отмена
            </UButton>
            <UButton type="submit" color="primary" :loading="submitting">
              {{ editId ? 'Сохранить изменения' : 'Создать и загрузить фото' }}
            </UButton>
          </div>
        </UForm>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';

definePageMeta({
  layout: 'admin',
});

const config = useRuntimeConfig();
const apiBase = config.public.apiBase;
const toast = useToast();

// Fetch products & categories
const { data: products, refresh, status } = await useFetch<any[]>(`${apiBase}/products`);
const { data: categories } = await useFetch<any[]>(`${apiBase}/categories`);

const columns = [
  { accessorKey: 'id', header: 'ID' },
  { id: 'image', header: 'Фото' },
  { accessorKey: 'name_uk', header: 'Название (UA)' },
  { accessorKey: 'name_en', header: 'Название (EN)' },
  { accessorKey: 'category', header: 'Категория' },
  { accessorKey: 'price', header: 'Цена' },
  { accessorKey: 'attributes', header: 'Характеристики' },
  { id: 'actions', header: 'Действия' },
];

// Modal / Form state
const isOpen = ref(false);
const submitting = ref(false);
const deletingId = ref<number | null>(null);
const editId = ref<number | null>(null);
const currentImages = ref<Array<{ id: number, image_url: string }>>([]);
const deletingImageId = ref<number | null>(null);

const formState = reactive({
  name_uk: '',
  name_en: '',
  price: undefined as number | undefined,
  category_id: '',
});

// Dynamic Specifications
const dynamicAttrs = ref<Array<{ key: string; value: string }>>([]);

// File uploads
const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const uploadFiles = ref<Array<{ file: File; previewUrl: string }>>([]);

// Computed list of categories for drop-down
const categoryItems = computed(() => {
  if (!categories.value) return [];
  return categories.value.map((cat) => ({
    label: cat.name_uk,
    value: String(cat.id),
  }));
});

// Helper formatting
const formatPrice = (price: string | number) => {
  return Number(price).toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

const getProductImage = (product: any) => {
  if (product.image_url) return product.image_url;
  if (product.images && product.images.length > 0) {
    return product.images[0].image_url;
  }
  return null;
};

// Actions on characteristics
const addAttributeRow = () => {
  dynamicAttrs.value.push({ key: '', value: '' });
};

const removeAttributeRow = (index: number) => {
  dynamicAttrs.value.splice(index, 1);
};

// Drag and drop events
const onDrop = (event: DragEvent) => {
  isDragging.value = false;
  if (event.dataTransfer?.files) {
    addFiles(event.dataTransfer.files);
  }
};

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    addFiles(target.files);
  }
};

const addFiles = (files: FileList) => {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file && file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file);
      uploadFiles.value.push({ file, previewUrl });
    }
  }
};

const removeSelectedFile = (index: number) => {
  const fileObj = uploadFiles.value[index];
  if (fileObj) {
    URL.revokeObjectURL(fileObj.previewUrl); // Free memory
    uploadFiles.value.splice(index, 1);
  }
};

const openCreateModal = () => {
  editId.value = null;
  currentImages.value = [];
  formState.name_uk = '';
  formState.name_en = '';
  formState.price = undefined;
  formState.category_id = '';
  dynamicAttrs.value = [];
  
  // Clear file lists
  uploadFiles.value.forEach((f) => URL.revokeObjectURL(f.previewUrl));
  uploadFiles.value = [];
  
  isOpen.value = true;
};

const openEditModal = (product: any) => {
  editId.value = product.id;
  currentImages.value = [...(product.images || [])];
  formState.name_uk = product.name_uk;
  formState.name_en = product.name_en;
  formState.price = product.price;
  formState.category_id = String(product.category_id);
  dynamicAttrs.value = Object.entries(product.attributes || {}).map(([key, value]) => ({ key, value: String(value) }));
  
  // Clear file lists
  uploadFiles.value.forEach((f) => URL.revokeObjectURL(f.previewUrl));
  uploadFiles.value = [];
  
  isOpen.value = true;
};

// Delete existing product image immediately
const deleteExistingImage = async (imageId: number) => {
  if (!confirm('Вы уверены, что хотите удалить это изображение?')) return;
  deletingImageId.value = imageId;

  try {
    const { token } = useAuth();
    await $fetch(`${apiBase}/products/image/${imageId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    const index = currentImages.value.findIndex((img) => img.id === imageId);
    if (index !== -1) {
      currentImages.value.splice(index, 1);
    }

    toast.add({
      title: 'Успешно',
      description: 'Изображение удалено',
      color: 'success',
    });

    await refresh();
  } catch (error: any) {
    console.error(error);
    const msg = error.data?.message || 'Не удалось удалить изображение';
    toast.add({
      title: 'Ошибка',
      description: msg,
      color: 'error',
    });
  } finally {
    deletingImageId.value = null;
  }
};

// Submit product (Create or Edit)
const onSubmit = async () => {
  if (!formState.name_uk || !formState.price || !formState.category_id) {
    toast.add({ title: 'Ошибка', description: 'Пожалуйста, заполните все обязательные поля', color: 'error' });
    return;
  }

  submitting.value = true;

  try {
    // 1. Pack specifications
    const attributesObj: Record<string, string> = {};
    dynamicAttrs.value.forEach((attr) => {
      if (attr.key && attr.value) {
        attributesObj[attr.key] = attr.value;
      }
    });

    const productPayload = {
      name_uk: formState.name_uk,
      name_en: formState.name_en,
      price: Number(formState.price),
      category_id: Number(formState.category_id),
      attributes: attributesObj,
    };

    const { token } = useAuth();
    let productId = editId.value;

    if (editId.value) {
      // Edit Mode
      await $fetch(`${apiBase}/products/${editId.value}`, {
        method: 'PATCH',
        body: productPayload,
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
    } else {
      // Create Mode
      const createdProduct = await $fetch<any>(`${apiBase}/products`, {
        method: 'POST',
        body: productPayload,
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      productId = createdProduct.id;
    }

    // Upload new images if any selected (works for both create and edit mode)
    if (uploadFiles.value.length > 0 && productId) {
      const formData = new FormData();
      uploadFiles.value.forEach((fileObj) => {
        formData.append('images', fileObj.file);
      });

      await $fetch(`${apiBase}/products/${productId}/images`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
    }

    toast.add({
      title: 'Успешно',
      description: editId.value ? 'Товар сохранен' : 'Товар создан и фото загружены',
      color: 'success',
    });

    isOpen.value = false;
    await refresh();
  } catch (error: any) {
    console.error(error);
    const msg = error.data?.message || 'Не удалось сохранить товар';
    toast.add({
      title: 'Ошибка',
      description: Array.isArray(msg) ? msg.join(', ') : msg,
      color: 'error',
    });
  } finally {
    submitting.value = false;
  }
};

// Delete product
const deleteProduct = async (id: number) => {
  if (!confirm('Вы уверены, что хотите удалить этот товар?')) return;
  deletingId.value = id;

  try {
    const { token } = useAuth();
    await $fetch(`${apiBase}/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    toast.add({
      title: 'Успешно',
      description: 'Товар удален',
      color: 'success',
    });

    await refresh();
  } catch (error: any) {
    console.error(error);
    const msg = error.data?.message || 'Не удалось удалить товар';
    toast.add({
      title: 'Ошибка',
      description: Array.isArray(msg) ? msg.join(', ') : msg,
      color: 'error',
    });
  } finally {
    deletingId.value = null;
  }
};
</script>
