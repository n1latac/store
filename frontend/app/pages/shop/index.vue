<template>
  <div>
    <!-- breadcrumb area start -->
    <div class="breadcrumb-area">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="breadcrumb-wrap">
              <nav aria-label="breadcrumb">
                <h1>{{ t('shop') }}</h1>
                <ul class="breadcrumb">
                  <li class="breadcrumb-item"><NuxtLink to="/">{{ t('home') }}</NuxtLink></li>
                  <li class="breadcrumb-item active" aria-current="page">{{ locale === 'uk' ? 'Магазин / Каталог' : 'Shop / Catalog' }}</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- breadcrumb area end -->

    <!-- page main wrapper start -->
    <main class="shop-main-wrapper pt-50 pb-50">
      <div class="container">
        <div class="row">
          <!-- sidebar area start -->
          <div class="col-lg-3 order-2 order-lg-1">
            <aside class="sidebar-wrapper">
              <!-- single sidebar start -->
              <div class="sidebar-single">
                <div class="sidebar-title">
                  <h3>{{ t('categoriesTitle') }}</h3>
                </div>
                <div class="sidebar-body">
                  <div class="shop-categories">
                    <nav>
                      <ul class="mobile-menu">
                        <li :class="{ active: !activeCategoryId }">
                          <a href="#" @click.prevent="selectCategory(null)">{{ t('allCategories') }}</a>
                        </li>
                        <li 
                          v-for="parentCat in parentCategories" 
                          :key="parentCat.id"
                          :class="{ 'menu-item-has-children': getSubCategories(parentCat.id).length > 0 }"
                        >
                          <div class="d-flex align-items-center justify-content-between w-100">
                            <a 
                              href="#" 
                              @click.prevent="handleParentCategoryClick(parentCat.id)" 
                              class="flex-grow-1"
                              style="min-width: 0;"
                              :class="{ 
                                'active-link': activeCategoryId === parentCat.id,
                                'parent-active-link': isChildSubCategoryActive(parentCat.id)
                              }"
                            >
                              {{ locale === 'uk' ? parentCat.name_uk : (parentCat.name_en || parentCat.name_uk) }}
                            </a>
                            <span 
                              v-if="getSubCategories(parentCat.id).length > 0" 
                              @click.stop="toggleCategory(parentCat.id)" 
                              class="menu-expand-btn"
                              :class="{ 'active': isCategoryExpanded(parentCat.id) }"
                            >
                              <i class="expand-icon"></i>
                            </span>
                          </div>
                          <ul 
                            v-if="getSubCategories(parentCat.id).length > 0" 
                            class="dropdown category-submenu" 
                            :class="{ 'open': isCategoryExpanded(parentCat.id) }" 
                            style="position: static; box-shadow: none; padding-left: 15px;"
                          >
                            <li 
                              v-for="subCat in getSubCategories(parentCat.id)" 
                              :key="subCat.id"
                            >
                              <a 
                                href="#" 
                                @click.prevent="selectCategory(subCat.id)"
                                :class="{ 'active-link': activeCategoryId === subCat.id }"
                              >
                                {{ locale === 'uk' ? subCat.name_uk : (subCat.name_en || subCat.name_uk) }}
                              </a>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
              <!-- single sidebar end -->

              <!-- single sidebar start -->
              <div class="sidebar-single">
                <div class="sidebar-title">
                  <h3>{{ t('priceFilter') }}</h3>
                </div>
                <div class="sidebar-body">
                  <ul class="radio-container">
                    <li v-for="(range, idx) in priceRanges" :key="idx">
                      <div class="custom-control custom-radio">
                        <input 
                          type="radio" 
                          class="custom-control-input" 
                          name="price-range" 
                          :id="'price-range-' + idx" 
                          :value="idx"
                          v-model="selectedPriceRangeIdx"
                          @change="selectPriceRange(range)"
                        >
                        <label class="custom-control-label" :for="'price-range-' + idx">{{ range.label }}</label>
                      </div>
                    </li>
                  </ul>
                  
                  <div class="price-filter-wrapper mt-3 pt-3 border-top">
                    <div class="d-flex align-items-center mb-2">
                      <input 
                        type="number" 
                        v-model.number="tempMinPrice" 
                        :placeholder="locale === 'uk' ? 'Мін' : 'Min'" 
                        class="form-control mr-2"
                        style="height: 35px; font-size: 14px;"
                      >
                      <span class="mr-2">—</span>
                      <input 
                        type="number" 
                        v-model.number="tempMaxPrice" 
                        :placeholder="locale === 'uk' ? 'Макс' : 'Max'" 
                        class="form-control"
                        style="height: 35px; font-size: 14px;"
                      >
                    </div>
                    <button 
                      class="btn btn__bg w-100 mt-3" 
                      @click="applyPriceFilter"
                    >{{ t('applyBtn') }}</button>
                  </div>
                </div>
              </div>
              <!-- single sidebar end -->

              <!-- single sidebar start (Brand Checklist) -->
              <div class="sidebar-single" v-if="false && availableBrands.length > 0">
                <div class="sidebar-title">
                  <h3>{{ t('brandFilter') }}</h3>
                </div>
                <div class="sidebar-body">
                  <ul class="checkbox-container">
                    <li v-for="brand in availableBrands" :key="brand">
                      <div class="custom-control custom-checkbox">
                        <input 
                          type="checkbox" 
                          class="custom-control-input" 
                          :id="'brand-' + brand" 
                          :value="brand"
                          v-model="selectedBrands"
                        >
                        <label class="custom-control-label" :for="'brand-' + brand">{{ brand }}</label>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <!-- single sidebar end -->

              <!-- single sidebar start (RAM Checklist) -->
              <div class="sidebar-single" v-if="false && availableRams.length > 0">
                <div class="sidebar-title">
                  <h3>{{ t('ramFilter') }}</h3>
                </div>
                <div class="sidebar-body">
                  <ul class="checkbox-container">
                    <li v-for="ram in availableRams" :key="ram">
                      <div class="custom-control custom-checkbox">
                        <input 
                          type="checkbox" 
                          class="custom-control-input" 
                          :id="'ram-' + ram" 
                          :value="ram"
                          v-model="selectedRams"
                        >
                        <label class="custom-control-label" :for="'ram-' + ram">{{ ram }}</label>
                      </div>
                    </li>
                  </ul>
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
                <div class="top-bar-left">
                  <div class="product-view-mode">
                    <a 
                      href="#" 
                      :class="{ active: viewMode === 'grid' }" 
                      @click.prevent="viewMode = 'grid'" 
                      :title="locale === 'uk' ? 'Сітка' : 'Grid'"
                    ><i class="fa fa-th"></i></a>
                    <a 
                      href="#" 
                      :class="{ active: viewMode === 'list' }" 
                      @click.prevent="viewMode = 'list'" 
                      :title="locale === 'uk' ? 'Список' : 'List'"
                    ><i class="fa fa-list"></i></a>
                  </div>
                  <div class="product-amount">
                    <p>{{ t('foundProducts') }} {{ filteredProducts.length }}</p>
                  </div>
                </div>
                <div class="top-bar-right">
                  <!-- Sort select -->
                  <div class="product-short-select">
                    <select class="form-control" v-model="sortBy" style="height: 35px; font-size: 14px;">
                      <option value="default">{{ t('sortByDefault') }}</option>
                      <option value="price-asc">{{ t('sortByPriceAsc') }}</option>
                      <option value="price-desc">{{ t('sortByPriceDesc') }}</option>
                      <option value="name-asc">{{ t('sortByNameAsc') }}</option>
                    </select>
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
                      <div class="add-to-links">
                        <a 
                          href="#" 
                          @click.prevent="toggleWishlist(product)" 
                          :title="isInWishlist(product.id) ? 'Видалити з обраного' : 'В обране'"
                        >
                          <i :class="isInWishlist(product.id) ? 'ion-android-favorite' : 'ion-android-favorite-outline'"></i>
                        </a>
                        <NuxtLink :to="`/product/${product.id}`" title="Перегляд"><i class="ion-eye"></i></NuxtLink>
                      </div>
                    </div>

                    <!-- Content -->
                    <div :class="viewMode === 'grid' ? 'product-content' : 'product-content-list flex-grow-1'">
                      <div class="product-category">
                        <NuxtLink :to="`/shop?category=${product.category_id}`">{{ locale === 'uk' ? product.category?.name_uk : (product.category?.name_en || product.category?.name_uk) }}</NuxtLink>
                      </div>
                      <h5 class="product-name">
                        <NuxtLink :to="`/product/${product.id}`">{{ locale === 'uk' ? product.name_uk : (product.name_en || product.name_uk) }}</NuxtLink>
                      </h5>
                      <div class="price-box">
                        <span class="price-regular">{{ product.price }} ₴</span>
                        <span class="price-old" v-if="product.old_price"><del>{{ product.old_price }} ₴</del></span>
                      </div>
                      <p v-if="viewMode === 'list'" class="mt-2 text-muted">
                        {{ locale === 'uk' ? 'Натисніть кнопку нижче або перейдіть у детальний перегляд товару для вивчення характеристик.' : 'Click the button below or go to the details page to view detailed technical specifications.' }}
                      </p>
                      
                      <!-- Actions -->
                      <div v-if="viewMode === 'grid'" class="product-item-action">
                        <a class="btn btn-cart" href="#" @click.prevent="addToCart(product)"><i class="ion-bag"></i> {{ t('addToCart') }}</a>
                      </div>
                      <div v-else class="mt-3">
                        <a class="btn btn-cart" href="#" @click.prevent="addToCart(product)"><i class="ion-bag"></i> {{ t('addToCart') }}</a>
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
                      {{ t('prev') }}
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
                      {{ t('next') }}
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
import { useLocale } from '~/composables/useLocale';

definePageMeta({
  layout: 'default'
});

const route = useRoute();
const router = useRouter();

const { locale, t } = useLocale();

// Filter & View States
const activeCategoryId = computed(() => route.query.category ? Number(route.query.category) : null);
const sortBy = ref('default');
const viewMode = ref('grid');

const tempMinPrice = ref<number | null>(null);
const tempMaxPrice = ref<number | null>(null);
const minPrice = ref<number | null>(null);
const maxPrice = ref<number | null>(null);

const selectedBrands = ref<string[]>([]);
const selectedRams = ref<string[]>([]);

// Price Ranges Config
const priceRanges = computed(() => [
  { label: locale.value === 'uk' ? 'Усі ціни' : 'All prices', min: null, max: null },
  { label: locale.value === 'uk' ? 'до 5 000 ₴' : 'up to 5,000 ₴', min: 0, max: 5000 },
  { label: locale.value === 'uk' ? '5 000 ₴ - 15 000 ₴' : '5,000 ₴ - 15,000 ₴', min: 5000, max: 15000 },
  { label: locale.value === 'uk' ? '15 000 ₴ - 30 000 ₴' : '15,000 ₴ - 30,000 ₴', min: 15000, max: 30000 },
  { label: locale.value === 'uk' ? 'від 30 000 ₴' : 'over 30,000 ₴', min: 30000, max: null }
]);
const selectedPriceRangeIdx = ref<number | null>(0);

const selectPriceRange = (range: { min: number | null; max: number | null }) => {
  minPrice.value = range.min;
  maxPrice.value = range.max;
  tempMinPrice.value = range.min;
  tempMaxPrice.value = range.max;
};

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

// Collapsible parent categories mapping
const expandedCategories = ref<Record<number, boolean>>({});

const isCategoryExpanded = (parentId: number): boolean => {
  if (expandedCategories.value[parentId] !== undefined) {
    return expandedCategories.value[parentId];
  }
  // Auto-expand if the active category matches this parent or one of its subcategories
  if (activeCategoryId.value === parentId) return true;
  const subs = getSubCategories(parentId);
  return subs.some(sub => sub.id === activeCategoryId.value);
};

const toggleCategory = (parentId: number) => {
  expandedCategories.value[parentId] = !isCategoryExpanded(parentId);
};

const handleParentCategoryClick = (parentId: number) => {
  const hasSubs = getSubCategories(parentId).length > 0;
  
  if (activeCategoryId.value === parentId) {
    if (hasSubs) {
      toggleCategory(parentId);
    }
  } else {
    // Accordion: collapse others
    if (categories.value) {
      categories.value.forEach(cat => {
        if (cat.id !== parentId) {
          expandedCategories.value[cat.id] = false;
        }
      });
    }
    selectCategory(parentId);
    if (hasSubs) {
      expandedCategories.value[parentId] = true;
    }
  }
};

const isChildSubCategoryActive = (parentId: number): boolean => {
  const subs = getSubCategories(parentId);
  return subs.some(sub => sub.id === activeCategoryId.value);
};

// Reset other filters when active category changes
watch(activeCategoryId, () => {
  selectedBrands.value = [];
  selectedRams.value = [];
  currentPage.value = 1;
});

// Extract available Brands dynamically (context-sensitive to category)
const availableBrands = computed(() => {
  if (!products.value) return [];
  const brandsSet = new Set<string>();
  
  let list = products.value;
  if (activeCategoryId.value) {
    const targetIds = getCategoryIdsToFilter(activeCategoryId.value);
    list = list.filter(p => targetIds.includes(p.category_id));
  }

  list.forEach(p => {
    if (p.attributes && p.attributes.brand) {
      brandsSet.add(p.attributes.brand);
    }
  });
  return Array.from(brandsSet).sort();
});

// Extract available RAM options dynamically (context-sensitive to category)
const availableRams = computed(() => {
  if (!products.value) return [];
  const ramsSet = new Set<string>();

  let list = products.value;
  if (activeCategoryId.value) {
    const targetIds = getCategoryIdsToFilter(activeCategoryId.value);
    list = list.filter(p => targetIds.includes(p.category_id));
  }

  list.forEach(p => {
    if (p.attributes && p.attributes.ram) {
      ramsSet.add(p.attributes.ram);
    }
  });
  return Array.from(ramsSet).sort((a, b) => {
    const numA = parseInt(a);
    const numB = parseInt(b);
    if (isNaN(numA) || isNaN(numB)) return a.localeCompare(b);
    return numA - numB;
  });
});

// Filtered and Sorted products
const filteredProducts = computed(() => {
  if (!products.value) return [];

  let list = [...products.value];

  // Search filter
  const searchQ = route.query.search ? String(route.query.search).toLowerCase().trim() : '';
  if (searchQ) {
    list = list.filter(p => 
      p.name_uk.toLowerCase().includes(searchQ) || 
      (p.name_en && p.name_en.toLowerCase().includes(searchQ))
    );
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

  // Brand filters
  if (selectedBrands.value.length > 0) {
    list = list.filter(p => p.attributes && selectedBrands.value.includes(p.attributes.brand));
  }

  // RAM filters
  if (selectedRams.value.length > 0) {
    list = list.filter(p => p.attributes && selectedRams.value.includes(p.attributes.ram));
  }

  // Sorting
  if (sortBy.value === 'price-asc') {
    list.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortBy.value === 'price-desc') {
    list.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (sortBy.value === 'name-asc') {
    const isUk = locale.value === 'uk';
    list.sort((a, b) => {
      const nameA = isUk ? a.name_uk : (a.name_en || a.name_uk);
      const nameB = isUk ? b.name_uk : (b.name_en || b.name_uk);
      return nameA.localeCompare(nameB);
    });
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
watch([activeCategoryId, minPrice, maxPrice, selectedBrands, selectedRams, sortBy, () => route.query.search], () => {
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
  selectedPriceRangeIdx.value = null; // Uncheck quick ranges if custom inputs are applied
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
/* Smooth expand/collapse animation for subcategories list */
.category-submenu {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease-in-out, margin 0.35s ease-in-out;
  margin-top: 0;
  margin-bottom: 0;
}
.category-submenu.open {
  max-height: 400px; /* high limit to handle standard height */
  opacity: 1;
  margin-top: 8px;
  margin-bottom: 8px;
}

/* Active and parent highlight styles */
.active-link {
  color: #1891ac !important;
  font-weight: 600 !important;
  transition: none !important;
}
.parent-active-link {
  color: #1891ac !important;
  font-weight: 500 !important;
  opacity: 0.85;
  transition: none !important;
}
.mobile-menu li a {
  transition: none !important;
}

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
  color: #1891ac !important;
  font-weight: bold;
}

/* Custom premium plus/minus toggle button */
.menu-expand-btn {
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: transform 0.25s ease-out;
  flex-shrink: 0;
}

.expand-icon {
  display: block;
  position: relative;
  width: 10px;
  height: 1px;
  background-color: #555;
  transition: background-color 0.25s ease-out;
}

.expand-icon::before {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 10px;
  height: 1px;
  background-color: #555;
  transform: rotate(90deg);
  transition: transform 0.25s ease-out, background-color 0.25s ease-out;
}

.menu-expand-btn.active .expand-icon::before {
  transform: rotate(0deg);
}

.menu-expand-btn:hover .expand-icon,
.menu-expand-btn:hover .expand-icon::before {
  background-color: #1891ac;
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
.product-item .product-thumb {
  position: relative;
  text-align: center;
  padding-top: 45px;
  padding-bottom: 45px;
}
.product-list-item .product-thumb {
  position: relative;
  text-align: center;
  padding-top: 45px;
  padding-bottom: 0;
}
.pagination-box li {
  margin: 0 5px;
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
