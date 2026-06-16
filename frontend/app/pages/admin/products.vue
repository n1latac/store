<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center bg-white dark:bg-gray-950 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Керування товарами</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Додавайте товари, керуйте характеристиками та завантажуйте зображення</p>
      </div>
      <UButton
        icon="i-lucide-plus"
        color="primary"
        size="md"
        class="rounded-xl shadow-sm hover:scale-[1.02] transition-transform duration-200"
        @click="openCreateModal"
      >
        Створити товар
      </UButton>
    </div>

    <!-- Filters and Search -->
    <div class="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-gray-950 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
      <div class="w-full sm:max-w-xs">
        <UInput
          v-model="searchInput"
          icon="i-lucide-search"
          placeholder="Пошук за назвою..."
          class="w-full"
          size="md"
        />
      </div>
      <div class="w-full sm:max-w-xs">
        <USelect
          v-model="selectedCategoryId"
          :items="[{ label: 'Усі категорії', value: 'all' }, ...categoryItems]"
          placeholder="Фільтр за категорією"
          class="w-full"
          size="md"
        />
      </div>
    </div>

    <!-- Table Card -->
    <UCard class="rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden" :ui="{ body: 'p-0' }">
      <div class="overflow-x-auto">
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
          <div class="flex flex-col gap-1">
            <span class="font-semibold text-gray-900 dark:text-white">
              {{ formatPrice(row.original.price) }} грн
            </span>
            <span v-if="row.original.old_price" class="text-xs text-gray-400 line-through">
              {{ formatPrice(row.original.old_price) }} грн
            </span>
            <UBadge v-if="row.original.is_deal" size="sm" color="warning" class="w-max">
              Пропозиція тижня
            </UBadge>
          </div>
        </template>

        <!-- Attributes Render -->
        <template #attributes-cell="{ row }">
          <div class="flex flex-wrap gap-1 max-w-[200px] whitespace-normal break-all">
            <span
              v-for="attr in getOrderedAttributes(row.original.attributes)"
              :key="attr.key"
              class="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-md border border-gray-200 dark:border-gray-700 break-all whitespace-normal"
            >
              {{ attr.key }}: {{ attr.value }}
            </span>
            <span v-if="!getOrderedAttributes(row.original.attributes).length" class="text-gray-400 text-xs">
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
      </div>

      <!-- Pagination Footer -->
      <div v-if="totalPages > 1" class="flex justify-between items-center p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
        <span class="text-sm text-gray-500 dark:text-gray-400">
          Показано {{ (currentPage - 1) * limit + 1 }} - {{ Math.min(currentPage * limit, totalItems) }} з {{ totalItems }}
        </span>
        <div class="flex items-center gap-2">
          <UButton
            icon="i-lucide-chevron-left"
            variant="outline"
            color="neutral"
            size="sm"
            :disabled="currentPage === 1"
            @click="currentPage--"
          />
          <span class="px-3 py-1 text-sm bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-700 dark:text-gray-300 font-medium">
            Сторінка {{ currentPage }} з {{ totalPages }}
          </span>
          <UButton
            icon="i-lucide-chevron-right"
            variant="outline"
            color="neutral"
            size="sm"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          />
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!products?.length && status !== 'pending'" class="flex flex-col items-center justify-center py-12 px-4 text-center">
        <UIcon name="i-lucide-shopping-bag" class="w-12 h-12 text-gray-300 dark:text-gray-700 mb-3" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Немає товарів</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm mt-1">
          База даних товарів порожня. Натисніть кнопку вище, щоб додати перший товар.
        </p>
      </div>
    </UCard>

    <!-- Create / Edit Product Modal -->
    <UModal v-model:open="isOpen" :title="editId ? 'Редагувати товар' : 'Створити товар'" :description="editId ? 'Змініть параметри товару та відредагуйте галерею' : 'Вкажіть параметри товару та завантажте фотографії'">
      <template #body>
        <UForm :state="formState" class="space-y-4" @submit="onSubmit">
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Назва (UA)" name="name_uk" required>
              <UInput v-model="formState.name_uk" placeholder="Наприклад: Кросівки Nike" class="w-full" size="md" />
            </UFormField>

            <UFormField label="Назва (EN)" name="name_en" required>
              <UInput v-model="formState.name_en" placeholder="Наприклад: Nike Sneakers" class="w-full" size="md" />
            </UFormField>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Ціна (грн)" name="price" required>
              <UInput v-model.number="formState.price" type="number" placeholder="2500" class="w-full" size="md" />
            </UFormField>

            <UFormField label="Стара ціна (грн) - для перекреслення" name="old_price">
              <UInput v-model.number="formState.old_price" type="number" placeholder="3000" class="w-full" size="md" />
            </UFormField>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Категорія" name="category_id" required>
              <USelect
                v-model="formState.category_id"
                :items="categoryItems"
                placeholder="Оберіть категорію"
                class="w-full"
                size="md"
              />
            </UFormField>

            <UFormField label="Акційні пропозиції" name="is_deal" class="flex items-center pt-6">
              <UCheckbox v-model="formState.is_deal" label="Показувати в Пропозиціях тижня" />
            </UFormField>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Опис (UA)" name="description_uk">
              <UTextarea v-model="formState.description_uk" placeholder="Опис товару українською..." class="w-full" size="md" :rows="3" />
            </UFormField>

            <UFormField label="Опис (EN)" name="description_en">
              <UTextarea v-model="formState.description_en" placeholder="Product description in English..." class="w-full" size="md" :rows="3" />
            </UFormField>
          </div>

          <!-- Dynamic Attributes (Характеристики) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Характеристики (Специфікації)
            </label>
            <div class="space-y-2">
              <div v-for="(attr, index) in dynamicAttrs" :key="index" class="flex items-center gap-2">
                <UInput v-model="attr.key" placeholder="Назва (напр. Колір)" class="flex-1" size="sm" />
                <UInput v-model="attr.value" placeholder="Значення (напр. Чорний)" class="flex-1" size="sm" />
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
                Додати характеристику
              </UButton>
            </div>
          </div>

          <!-- Existing Images Gallery (Only shown in Edit mode) -->
          <div v-if="editId && currentImages.length" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Поточні зображення товару
            </label>
            <div class="grid grid-cols-5 gap-3">
              <div
                v-for="img in currentImages"
                :key="img.id"
                class="relative aspect-square rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden group"
              >
                <img :src="img.image_url" class="object-cover w-full h-full" />
                
                <!-- Main image badge -->
                <div
                  v-if="img.is_main"
                  class="absolute top-1 left-1 bg-primary-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow z-10"
                >
                  Головна
                </div>

                <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity duration-150">
                  <UButton
                    v-if="!img.is_main"
                    icon="i-lucide-star"
                    color="warning"
                    size="sm"
                    variant="solid"
                    type="button"
                    title="Зробити головною"
                    :loading="settingMainImageId === img.id"
                    @click.stop="setAsMainImage(img.id)"
                  />
                  <UButton
                    icon="i-lucide-trash-2"
                    color="error"
                    size="sm"
                    variant="solid"
                    type="button"
                    title="Видалити зображення"
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
              Зображення товару (Drag & Drop)
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
                Перетягніть сюди файли зображень або клікніть для вибору
              </p>
              <p class="text-xs text-gray-400 mt-1">Допускаються файли JPG, PNG, WEBP (до 10 штук)</p>
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
              Скасувати
            </UButton>
            <UButton type="submit" color="primary" :loading="submitting">
              {{ editId ? 'Зберегти зміни' : 'Створити та завантажити фото' }}
            </UButton>
          </div>
        </UForm>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';

definePageMeta({
  layout: 'admin',
});

const config = useRuntimeConfig();
const apiBase = config.public.apiBase;
const toast = useToast();

// Pagination, search & filter state
const searchInput = ref('');
const searchQuery = ref('');
const selectedCategoryId = ref('all');
const currentPage = ref(1);
const limit = ref(10);

let searchDebounce: any = null;
watch(searchInput, (newVal) => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    searchQuery.value = newVal;
  }, 300);
});

watch([searchQuery, selectedCategoryId], () => {
  currentPage.value = 1;
});

const queryParams = computed(() => {
  const params: any = {
    page: currentPage.value,
    limit: limit.value,
  };
  if (searchQuery.value.trim()) {
    params.search = searchQuery.value.trim();
  }
  if (selectedCategoryId.value && selectedCategoryId.value !== 'all') {
    params.category_id = selectedCategoryId.value;
  }
  return params;
});

// Fetch products & categories
const { data: productsData, refresh, status } = await useFetch<any>(`${apiBase}/products`, {
  query: queryParams,
});
const { data: categories } = await useFetch<any[]>(`${apiBase}/categories`);

const products = computed<any[]>(() => {
  if (!productsData.value) return [];
  if (productsData.value.rows) {
    return productsData.value.rows;
  }
  return Array.isArray(productsData.value) ? productsData.value : [];
});

const totalItems = computed(() => {
  if (!productsData.value) return 0;
  if (productsData.value.count !== undefined) {
    return productsData.value.count;
  }
  return productsData.value.length;
});

const totalPages = computed(() => Math.ceil(totalItems.value / limit.value));

const columns = [
  { accessorKey: 'id', header: 'ID' },
  { id: 'image', header: 'Фото' },
  { accessorKey: 'name_uk', header: 'Назва (UA)' },
  { accessorKey: 'name_en', header: 'Назва (EN)' },
  { accessorKey: 'category', header: 'Категорія' },
  { accessorKey: 'price', header: 'Ціна' },
  { accessorKey: 'attributes', header: 'Характеристики' },
  { id: 'actions', header: 'Дії' },
];

// Modal / Form state
const isOpen = ref(false);
const submitting = ref(false);
const deletingId = ref<number | null>(null);
const editId = ref<number | null>(null);
const currentImages = ref<Array<{ id: number, image_url: string, is_main: boolean }>>([]);
const deletingImageId = ref<number | null>(null);
const settingMainImageId = ref<number | null>(null);

const formState = reactive({
  name_uk: '',
  name_en: '',
  price: undefined as number | undefined,
  old_price: undefined as number | undefined,
  is_deal: false,
  category_id: '',
  description_uk: '',
  description_en: '',
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
  return Number(price).toLocaleString('uk-UA', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

const getProductImage = (product: any) => {
  if (product.image_url) return product.image_url;
  if (product.images && product.images.length > 0) {
    return product.images[0].image_url;
  }
  return null;
};

const getOrderedAttributes = (attributes: Record<string, any>) => {
  if (!attributes) return [];
  const order: string[] = attributes._spec_order || Object.keys(attributes);
  const result: Array<{ key: string; value: any }> = [];

  order.forEach((key) => {
    if (key !== '_spec_order' && attributes[key] !== undefined) {
      result.push({ key, value: attributes[key] });
    }
  });

  Object.keys(attributes).forEach((key) => {
    if (key !== '_spec_order' && !order.includes(key) && attributes[key] !== undefined) {
      result.push({ key, value: attributes[key] });
    }
  });

  return result;
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
  formState.old_price = undefined;
  formState.is_deal = false;
  formState.category_id = '';
  formState.description_uk = '';
  formState.description_en = '';
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
  formState.old_price = product.old_price ? Number(product.old_price) : undefined;
  formState.is_deal = !!product.is_deal;
  formState.category_id = String(product.category_id);
  formState.description_uk = product.description_uk || '';
  formState.description_en = product.description_en || '';
  const attrs = product.attributes || {};
  const order: string[] = attrs._spec_order || Object.keys(attrs);
  const attrsList: Array<{ key: string; value: string }> = [];

  // first, load keys in stored order
  order.forEach((key) => {
    if (key !== '_spec_order' && attrs[key] !== undefined) {
      attrsList.push({ key, value: String(attrs[key]) });
    }
  });
  // then load any remaining keys not in order array (just in case)
  Object.keys(attrs).forEach((key) => {
    if (key !== '_spec_order' && !order.includes(key) && attrs[key] !== undefined) {
      attrsList.push({ key, value: String(attrs[key]) });
    }
  });
  dynamicAttrs.value = attrsList;
  
  // Clear file lists
  uploadFiles.value.forEach((f) => URL.revokeObjectURL(f.previewUrl));
  uploadFiles.value = [];
  
  isOpen.value = true;
};

// Helper to reload product details to sync images/main flags
const refreshProductDetail = async () => {
  if (!editId.value) return;
  try {
    const product = await $fetch<any>(`${apiBase}/products/${editId.value}`);
    if (product) {
      currentImages.value = [...(product.images || [])];
    }
  } catch (error) {
    console.error('Failed to refresh product detail:', error);
  }
};

// Set image as main
const setAsMainImage = async (imageId: number) => {
  if (!editId.value) return;
  settingMainImageId.value = imageId;

  try {
    const { token } = useAuth();
    await $fetch(`${apiBase}/products/${editId.value}/image/${imageId}/main`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    toast.add({
      title: 'Успішно',
      description: 'Зображення встановлено як головне',
      color: 'success',
    });

    await refreshProductDetail();
    await refresh();
  } catch (error: any) {
    console.error(error);
    const msg = error.data?.message || 'Не вдалося зробити зображення головним';
    toast.add({
      title: 'Помилка',
      description: msg,
      color: 'error',
    });
  } finally {
    settingMainImageId.value = null;
  }
};

// Delete existing product image immediately
const deleteExistingImage = async (imageId: number) => {
  if (!confirm('Ви впевнені, що хочете видалити це зображення?')) return;
  deletingImageId.value = imageId;

  try {
    const { token } = useAuth();
    await $fetch(`${apiBase}/products/image/${imageId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    toast.add({
      title: 'Успішно',
      description: 'Зображення видалено',
      color: 'success',
    });

    await refreshProductDetail();
    await refresh();
  } catch (error: any) {
    console.error(error);
    const msg = error.data?.message || 'Не удалось удалить изображение';
    toast.add({
      title: 'Помилка',
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
    toast.add({ title: 'Помилка', description: 'Будь ласка, заповніть усі обов’язкові поля', color: 'error' });
    return;
  }

  submitting.value = true;

  try {
    // 1. Pack specifications
    const attributesObj: Record<string, any> = {};
    const specOrder: string[] = [];
    dynamicAttrs.value.forEach((attr) => {
      const trimmedKey = attr.key ? attr.key.trim() : '';
      const trimmedValue = attr.value ? attr.value.trim() : '';
      if (trimmedKey && trimmedValue) {
        attributesObj[trimmedKey] = trimmedValue;
        specOrder.push(trimmedKey);
      }
    });
    attributesObj._spec_order = specOrder;

    const productPayload = {
      name_uk: formState.name_uk,
      name_en: formState.name_en,
      price: Number(formState.price),
      old_price: formState.old_price ? Number(formState.old_price) : null,
      is_deal: formState.is_deal,
      category_id: Number(formState.category_id),
      attributes: attributesObj,
      description_uk: formState.description_uk,
      description_en: formState.description_en,
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
      title: 'Успішно',
      description: editId.value ? 'Товар збережено' : 'Товар створено та photo завантажено',
      color: 'success',
    });

    isOpen.value = false;
    await refresh();
  } catch (error: any) {
    console.error(error);
    const msg = error.data?.message || 'Не вдалося зберегти товар';
    toast.add({
      title: 'Помилка',
      description: Array.isArray(msg) ? msg.join(', ') : msg,
      color: 'error',
    });
  } finally {
    submitting.value = false;
  }
};

// Delete product
const deleteProduct = async (id: number) => {
  if (!confirm('Ви впевнені, що хочете видалити цей товар?')) return;
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
      title: 'Успішно',
      description: 'Товар видалено',
      color: 'success',
    });

    await refresh();
  } catch (error: any) {
    console.error(error);
    const msg = error.data?.message || 'Не вдалося видалити товар';
    toast.add({
      title: 'Помилка',
      description: Array.isArray(msg) ? msg.join(', ') : msg,
      color: 'error',
    });
  } finally {
    deletingId.value = null;
  }
};
</script>
