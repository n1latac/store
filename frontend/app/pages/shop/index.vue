<template>
  <div>
    <!-- breadcrumb area start -->
    <div class="breadcrumb-area">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="breadcrumb-wrap">
              <nav aria-label="breadcrumb">
                <ul class="breadcrumb">
                  <li class="breadcrumb-item"><NuxtLink to="/">Главная</NuxtLink></li>
                  <li class="breadcrumb-item active" aria-current="page">Магазин / Каталог</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- breadcrumb area end -->

    <!-- page main wrapper start -->
    <main class="shop-main-wrapper section-space">
      <div class="container">
        <div class="row">
          <!-- sidebar area start -->
          <div class="col-lg-3 order-2 order-lg-1">
            <aside class="sidebar-wrapper">
              <!-- single sidebar start -->
              <div class="sidebar-single">
                <h5 class="sidebar-title">Категории</h5>
                <div class="sidebar-body">
                  <ul class="shop-categories-list">
                    <li :class="{ active: !activeCategoryId }">
                      <a href="#" @click.prevent="selectCategory(null)">Все категории</a>
                    </li>
                    <li 
                      v-for="parentCat in parentCategories" 
                      :key="parentCat.id"
                      :class="{ active: activeCategoryId === parentCat.id }"
                    >
                      <a href="#" @click.prevent="selectCategory(parentCat.id)">
                        {{ parentCat.name_uk }}
                      </a>
                      <ul v-if="getSubCategories(parentCat.id).length > 0" class="sub-categories">
                        <li 
                          v-for="subCat in getSubCategories(parentCat.id)" 
                          :key="subCat.id"
                          :class="{ active: activeCategoryId === subCat.id }"
                        >
                          <a href="#" @click.prevent="selectCategory(subCat.id)">
                            — {{ subCat.name_uk }}
                          </a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
              <!-- single sidebar end -->

              <!-- single sidebar start -->
              <div class="sidebar-single">
                <h5 class="sidebar-title">Фильтр по цене</h5>
                <div class="sidebar-body">
                  <div class="price-filter-wrapper">
                    <div class="d-flex align-items-center mb-2">
                      <input 
                        type="number" 
                        v-model.number="tempMinPrice" 
                        placeholder="Мин" 
                        class="form-control mr-2"
                        style="height: 35px; font-size: 14px;"
                      >
                      <span class="mr-2">—</span>
                      <input 
                        type="number" 
                        v-model.number="tempMaxPrice" 
                        placeholder="Макс" 
                        class="form-control"
                        style="height: 35px; font-size: 14px;"
                      >
                    </div>
                    <button 
                      class="btn btn-secondary w-100" 
                      @click="applyPriceFilter"
                      style="background-color: #00DC82; border: none; font-size: 14px; padding: 6px;"
                    >Применить</button>
                  </div>
                </div>
              </div>
              <!-- single sidebar end -->
            </aside>
          </div>
          <!-- sidebar area end -->

          <!-- shop main content area start -->
          <div class="col-lg-9 order-1 order-lg-2">
            <div class="shop-product-wrapper">
              <!-- shop product top toolbar start -->
              <div class="shop-top-bar d-flex align-items-center justify-content-between">
                <div class="select-shoing-wrap">
                  <p>Найдено товаров: {{ filteredProducts.length }}</p>
                </div>
                <div class="d-flex align-items-center">
                  <!-- Sort select -->
                  <div class="product-short-select mr-3">
                    <select class="form-control" v-model="sortBy" style="height: 35px; font-size: 14px;">
                      <option value="default">Сортировка: По умолчанию</option>
                      <option value="price-asc">Цена: от дешевых к дорогим</option>
                      <option value="price-desc">Цена: от дорогих к дешевым</option>
                      <option value="name-asc">Название: А-Я</option>
                    </select>
                  </div>
                  <!-- Grid/List Switcher -->
                  <div class="product-view-mode">
                    <a 
                      href="#" 
                      :class="{ active: viewMode === 'grid' }" 
                      @click.prevent="viewMode = 'grid'" 
                      title="Сетка"
                    ><i class="fa fa-th"></i></a>
                    <a 
                      href="#" 
                      :class="{ active: viewMode === 'list' }" 
                      @click.prevent="viewMode = 'list'" 
                      title="Список"
                    ><i class="fa fa-list"></i></a>
                  </div>
                </div>
              </div>
              <!-- shop product top toolbar end -->

              <!-- product item list start -->
              <div class="shop-product-wrap mt-30" :class="viewMode === 'grid' ? 'grid-view row' : 'list-view'">
                <!-- product grid item start -->
                <div 
                  v-for="product in paginatedProducts" 
                  :key="product.id"
                  :class="viewMode === 'grid' ? 'col-xl-4 col-lg-4 col-md-6 col-sm-6' : 'row align-items-center mt-30'"
                >
                  <div :class="viewMode === 'grid' ? 'product-item mt-30' : 'product-list-item d-flex border p-3 rounded w-100'">
                    <!-- Thumbnail -->
                    <div :class="viewMode === 'grid' ? 'product-thumb' : 'product-thumb mr-4'" :style="viewMode === 'list' ? 'width: 200px; flex-shrink: 0;' : ''">
                      <NuxtLink :to="`/product/${product.id}`">
                        <img 
                          :src="product.image_url || '/assets/img/product/product-or-1.jpg'" 
                          alt="" 
                          class="product-img"
                        >
                      </NuxtLink>
                      <div v-if="viewMode === 'grid'" class="button-group">
                        <a 
                          href="#" 
                          @click.prevent="toggleWishlist(product)" 
                          :title="isInWishlist(product.id) ? 'Удалить из избранного' : 'В избранное'"
                        >
                          <i :class="isInWishlist(product.id) ? 'ion-android-favorite' : 'ion-android-favorite-outline'"></i>
                        </a>
                        <NuxtLink :to="`/product/${product.id}`" title="Просмотр"><i class="ion-android-eye"></i></NuxtLink>
                      </div>
                    </div>

                    <!-- Content -->
                    <div :class="viewMode === 'grid' ? 'product-content' : 'product-content-list flex-grow-1'">
                      <div class="product-category">
                        <NuxtLink :to="`/shop?category=${product.category_id}`">{{ product.category?.name_uk }}</NuxtLink>
                      </div>
                      <h5 class="product-name">
                        <NuxtLink :to="`/product/${product.id}`">{{ product.name_uk }}</NuxtLink>
                      </h5>
                      <div class="price-box">
                        <span class="regular-price">{{ product.price }} ₴</span>
                      </div>
                      <p v-if="viewMode === 'list'" class="mt-2 text-muted">
                        Нажмите кнопку ниже или перейдите в детальный просмотр товара для изучения характеристик.
                      </p>
                      <div class="product-action-link mt-3">
                        <a href="#" @click.prevent="addToCart(product)" class="btn-add-cart">В корзину</a>
                        <a 
                          v-if="viewMode === 'list'"
                          href="#" 
                          class="btn-wishlist ml-2"
                          @click.prevent="toggleWishlist(product)"
                          style="font-size: 18px; color: #777;"
                        >
                          <i :class="isInWishlist(product.id) ? 'ion-android-favorite text-danger' : 'ion-android-favorite-outline'"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- product item list end -->

              <!-- start pagination area -->
              <div v-if="totalPages > 1" class="paginatoin-area mt-30 text-center">
                <ul class="pagination-box justify-content-center">
                  <li :class="{ disabled: currentPage === 1 }">
                    <a class="previous" href="#" @click.prevent="prevPage">
                      <i class="ion-ios-arrow-left"></i>
                    </a>
                  </li>
                  <li 
                    v-for="page in totalPages" 
                    :key="page"
                    :class="{ active: page === currentPage }"
                  >
                    <a href="#" @click.prevent="currentPage = page">{{ page }}</a>
                  </li>
                  <li :class="{ disabled: currentPage === totalPages }">
                    <a class="next" href="#" @click.prevent="nextPage">
                      <i class="ion-ios-arrow-right"></i>
                    </a>
                  </li>
                </ul>
              </div>
              <!-- end pagination area -->
            </div>
          </div>
          <!-- shop main content area end -->
        </div>
      </div>
    </main>
    <!-- page main wrapper end -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCart } from '~/composables/useCart';
import { useWishlist } from '~/composables/useWishlist';

definePageMeta({
  layout: 'default'
});

const route = useRoute();
const router = useRouter();

// Filter & View States
const activeCategoryId = computed(() => route.query.category ? Number(route.query.category) : null);
const sortBy = ref('default');
const viewMode = ref('grid');

const tempMinPrice = ref<number | null>(null);
const tempMaxPrice = ref<number | null>(null);
const minPrice = ref<number | null>(null);
const maxPrice = ref<number | null>(null);

// Pagination States
const currentPage = ref(1);
const itemsPerPage = 9;

// Fetch database products & categories
const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

const { data: categories } = await useFetch<any[]>(`${apiBase}/categories`);
const { data: products } = await useFetch<any[]>(`${apiBase}/products`);

const parentCategories = computed(() => {
  if (!categories.value) return [];
  return categories.value.filter(cat => cat.parent_id === null);
});

const getSubCategories = (parentId: number) => {
  if (!categories.value) return [];
  return categories.value.filter(cat => cat.parent_id === parentId);
};

const getCategoryIdsToFilter = (catId: number): number[] => {
  const ids = [catId];
  if (categories.value) {
    const subcats = categories.value.filter(c => c.parent_id === catId);
    subcats.forEach(sc => ids.push(sc.id));
  }
  return ids;
};

// Filtered and Sorted products
const filteredProducts = computed(() => {
  if (!products.value) return [];

  let list = [...products.value];

  // Search filter
  const searchQ = route.query.search ? String(route.query.search).toLowerCase().trim() : '';
  if (searchQ) {
    list = list.filter(p => p.name_uk.toLowerCase().includes(searchQ));
  }

  // Category filter (includes subcategories if parent selected)
  if (activeCategoryId.value) {
    const targetIds = getCategoryIdsToFilter(activeCategoryId.value);
    list = list.filter(p => targetIds.includes(p.category_id));
  }

  // Price range filters
  if (minPrice.value !== null) {
    list = list.filter(p => p.price >= (minPrice.value as number));
  }
  if (maxPrice.value !== null) {
    list = list.filter(p => p.price <= (maxPrice.value as number));
  }

  // Sorting
  if (sortBy.value === 'price-asc') {
    list.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortBy.value === 'price-desc') {
    list.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (sortBy.value === 'name-asc') {
    list.sort((a, b) => a.name_uk.localeCompare(b.name_uk));
  }

  return list;
});

// Paginated products
const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage));

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredProducts.value.slice(start, start + itemsPerPage);
});

// Watch filtering to reset current page
watch([activeCategoryId, minPrice, maxPrice, sortBy, () => route.query.search], () => {
  currentPage.value = 1;
});

const selectCategory = (catId: number | null) => {
  if (catId === null) {
    router.push('/shop');
  } else {
    router.push(`/shop?category=${catId}`);
  }
};

const applyPriceFilter = () => {
  minPrice.value = tempMinPrice.value;
  maxPrice.value = tempMaxPrice.value;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

// Cart / Wishlist actions
const { addToCart } = useCart();
const { isInWishlist, toggleWishlist } = useWishlist();
</script>

<style scoped>
.shop-categories-list {
  list-style: none;
  padding-left: 0;
}
.shop-categories-list li a {
  display: block;
  padding: 6px 0;
  color: #333;
  transition: color 0.2s;
}
.shop-categories-list li.active > a {
  color: #00DC82 !important;
  font-weight: bold;
}
.sub-categories {
  list-style: none;
  padding-left: 15px;
}
.product-img {
  width: 100%;
  height: 230px;
  object-fit: contain;
  background: #fdfdfd;
}
.pagination-box li.disabled a {
  pointer-events: none;
  opacity: 0.5;
}
.product-list-item {
  background: #fff;
  transition: box-shadow 0.3s;
}
.product-list-item:hover {
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}
</style>
