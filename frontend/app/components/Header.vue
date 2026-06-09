<template>
  <header class="header-area">
    <!-- main header start -->
    <div class="main-header d-none d-lg-block">
      <!-- header top start -->
      <div class="header-top theme-color">
        <div class="container bdr-bottom">
          <div class="row align-items-center">
            <div class="col-lg-6">
              <div class="header-top-settings">
                <ul class="nav align-items-center">
                  <li class="language">
                    <span>Мова:</span>
                    <img src="/assets/img/icon/en.png" alt="English"> English
                  </li>
                </ul>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="header-links">
                <ul class="nav justify-content-end">
                  <li><NuxtLink to="/admin/categories">Адмін-панель</NuxtLink></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- header top end -->

      <!-- header middle area start -->
      <div class="header-middle-area theme-color">
        <div class="container">
          <div class="row align-items-center">
            <!-- start logo area -->
            <div class="col-lg-3">
              <div class="logo">
                <NuxtLink to="/">
                  <img src="/assets/img/logo/logo.png" alt="Aivix tech Logo">
                </NuxtLink>
              </div>
            </div>
            <!-- start logo area -->

            <!-- start search box area -->
            <div class="col-lg-5 position-relative">
              <div class="search-box-wrapper">
                <form class="search-box-inner" @submit.prevent="handleSearch">
                  <input
                    type="text"
                    v-model="searchQuery"
                    @input="onSearchInput"
                    @focus="isSearchFocused = true"
                    @blur="onSearchBlur"
                    class="search-field"
                    placeholder="Пошук товарів..."
                  >
                  <button type="submit" class="search-btn"><i class="ion-ios-search"></i></button>
                </form>
              </div>

              <!-- Autocomplete suggestions dropdown -->
              <div
                v-if="isSearchFocused && searchSuggestions.length > 0"
                class="search-suggestions-dropdown"
              >
                <div
                  v-for="item in searchSuggestions"
                  :key="item.id"
                  class="suggestion-item"
                  @mousedown="navigateToProduct(item.id)"
                >
                  <img :src="getProductImage(item)" class="suggestion-img" />
                  <div class="suggestion-info">
                    <span class="suggestion-name">{{ item.name_uk }}</span>
                    <span class="suggestion-price">{{ item.price }} ₴</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- start search box end -->

            <!-- mini cart area start -->
            <div class="col-lg-4">
              <div class="header-configure-wrapper">
                <div class="support-inner">
                  <div class="support-icon">
                    <i class="ion-android-call"></i>
                  </div>
                  <div class="support-info">
                    <p>Підтримка дзвінків:</p>
                    <strong><a href="tel:+380441234567">+38 (044) 123-45-67</a></strong>
                  </div>
                </div>
                <div class="header-configure-area">
                  <ul class="nav justify-content-end">
                    <li>
                      <NuxtLink to="/shop">
                        <i class="ion-android-favorite-outline"></i>
                        <span class="notify">{{ wishlistCount }}</span>
                      </NuxtLink>
                    </li>
                    <li class="mini-cart-wrap">
                      <NuxtLink to="/cart">
                        <i class="ion-bag"></i>
                        <span class="notify">{{ cartCount }}</span>
                      </NuxtLink>
                      <div class="cart-list-wrapper">
                        <ul v-if="cartItems.length > 0" class="cart-list">
                          <li v-for="item in cartItems" :key="item.id">
                            <div class="cart-img">
                              <NuxtLink :to="`/product/${item.id}`">
                                <img :src="item.image || '/assets/img/product/product-or-1.jpg'" alt="">
                              </NuxtLink>
                            </div>
                            <div class="cart-info">
                              <h4><NuxtLink :to="`/product/${item.id}`">{{ item.name }}</NuxtLink></h4>
                              <span class="cart-qty">К-ть: {{ item.quantity }}</span>
                              <span>{{ item.price }} ₴</span>
                            </div>
                            <div class="del-icon" @click="removeFromCart(item.id)">
                              <i class="fa fa-times"></i>
                            </div>
                          </li>
                        </ul>
                        <div v-else class="text-center py-4 text-muted">
                          Кошик порожній
                        </div>
                        <template v-if="cartItems.length > 0">
                          <ul class="minicart-pricing-box">
                            <li class="total">
                              <span>Всього</span>
                              <span><strong>{{ cartTotal }} ₴</strong></span>
                            </li>
                          </ul>
                          <div class="minicart-button">
                            <NuxtLink to="/cart"><i class="fa fa-shopping-cart"></i> В кошик</NuxtLink>
                            <NuxtLink to="/checkout"><i class="fa fa-share"></i> Оформити</NuxtLink>
                          </div>
                        </template>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <!-- mini cart area end -->
          </div>
        </div>
      </div>
      <!-- header middle area end -->

      <!-- main menu area start -->
      <div class="main-menu-area bg-white sticky" :class="{ 'is-sticky': isSticky }">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-3">
              <div class="category-toggle-wrap">
                <div class="category-toggle" @click="isCategoryMenuOpen = !isCategoryMenuOpen">
                  <i class="ion-android-menu"></i>
                  Категорії товарів
                </div>
                <nav class="category-menu" :style="{ display: isCategoryMenuOpen ? 'block' : 'none' }">
                  <ul class="categories-list">
                    <li v-for="parentCat in parentCategories" :key="parentCat.id" class="menu-item-has-children">
                      <NuxtLink :to="`/shop?category=${parentCat.id}`">{{ parentCat.name_uk }}</NuxtLink>
                      <!-- Sub Category Menu Start -->
                      <ul v-if="getSubCategories(parentCat.id).length > 0" class="category-mega-menu dropdown">
                        <li class="menu-item-has-children">
                          <ul class="dropdown" style="display: block;">
                            <li v-for="subCat in getSubCategories(parentCat.id)" :key="subCat.id">
                              <NuxtLink :to="`/shop?category=${subCat.id}`">{{ subCat.name_uk }}</NuxtLink>
                            </li>
                          </ul>
                        </li>
                      </ul>
                      <!-- Sub Category Menu End -->
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
            <div class="col-lg-9">
              <div class="main-menu main-menu-style-1">
                <!-- main menu navbar start -->
                <nav class="desktop-menu">
                  <ul>
                    <li :class="{ active: route.path === '/' }"><NuxtLink to="/">Головна</NuxtLink></li>
                    <li :class="{ active: route.path === '/shop' }"><NuxtLink to="/shop">Магазин</NuxtLink></li>
                    <li :class="{ active: route.path === '/cart' }"><NuxtLink to="/cart">Кошик</NuxtLink></li>
                    <li :class="{ active: route.path === '/checkout' }"><NuxtLink to="/checkout">Оформлення замовлення</NuxtLink></li>
                  </ul>
                </nav>
                <!-- main menu navbar end -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- main menu area end -->
    </div>
    <!-- main header end -->

    <!-- mobile header start -->
    <div class="mobile-header d-lg-none d-md-block sticky" :class="{ 'is-sticky': isSticky }">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-12">
            <div class="mobile-main-header">
              <div class="mobile-logo">
                <NuxtLink to="/">
                  <img src="/assets/img/logo/logo-black.png" alt="Brand Logo">
                </NuxtLink>
              </div>
              <div class="mobile-menu-toggler">
                <div class="mini-cart-wrap">
                  <NuxtLink to="/cart">
                    <i class="ion-bag"></i>
                    <span class="notify">{{ cartCount }}</span>
                  </NuxtLink>
                </div>
                <div class="mobile-menu-btn" @click="isMobileMenuOpen = true">
                  <div class="off-canvas-btn">
                    <i class="ion-android-menu"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- mobile header end -->

    <!-- off-canvas menu start -->
    <aside class="off-canvas-wrapper" :class="{ 'open': isMobileMenuOpen }">
      <div class="off-canvas-overlay" @click="isMobileMenuOpen = false"></div>
      <div class="off-canvas-inner-content">
        <div class="btn-close-off-canvas" @click="isMobileMenuOpen = false">
          <i class="ion-android-close"></i>
        </div>

        <div class="off-canvas-inner">
          <!-- search box start -->
          <div class="search-box-offcanvas">
            <form @submit.prevent="handleSearch">
              <input type="text" v-model="searchQuery" placeholder="Пошук товарів...">
              <button type="submit" class="search-btn"><i class="ion-ios-search-strong"></i></button>
            </form>
          </div>
          <!-- search box end -->

          <!-- mobile menu start -->
          <div class="mobile-navigation">
            <!-- mobile menu navigation start -->
            <nav>
              <ul class="mobile-menu">
                <li><NuxtLink to="/" @click="isMobileMenuOpen = false">Головна</NuxtLink></li>
                <li><NuxtLink to="/shop" @click="isMobileMenuOpen = false">Магазин</NuxtLink></li>
                <li><NuxtLink to="/cart" @click="isMobileMenuOpen = false">Кошик</NuxtLink></li>
                <li><NuxtLink to="/checkout" @click="isMobileMenuOpen = false">Оформлення замовлення</NuxtLink></li>
                <li><NuxtLink to="/admin/categories" @click="isMobileMenuOpen = false">Адмін-панель</NuxtLink></li>
              </ul>
            </nav>
            <!-- mobile menu navigation end -->
          </div>
          <!-- mobile menu end -->
        </div>
      </div>
    </aside>
    <!-- off-canvas menu end -->
  </header>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCart } from '~/composables/useCart';
import { useWishlist } from '~/composables/useWishlist';

const route = useRoute();
const isHome = computed(() => route.path === '/');

const isCategoryMenuOpen = ref(false);
const isMobileMenuOpen = ref(false);
const searchQuery = ref('');
const isSearchFocused = ref(false);
const searchSuggestions = ref<any[]>([]);

watch(() => route.path, () => {
  isCategoryMenuOpen.value = false;
  isMobileMenuOpen.value = false;
});

// Fetch categories from database
const config = useRuntimeConfig();
const apiBase = config.public.apiBase;
const { data: categories } = await useFetch<any[]>(`${apiBase}/categories`);

const parentCategories = computed(() => {
  if (!categories.value) return [];
  return categories.value.filter((cat) => cat.parent_id === null);
});

const getSubCategories = (parentId: number) => {
  if (!categories.value) return [];
  return categories.value.filter((cat) => cat.parent_id === parentId);
};

// Cart / Wishlist States
const { cartItems, cartCount, cartTotal, removeFromCart } = useCart();
const { wishlistCount } = useWishlist();

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/shop?search=${encodeURIComponent(searchQuery.value.trim())}`);
    isMobileMenuOpen.value = false;
  }
};

// Scroll handler for Sticky Menu
const isSticky = ref(false);
const handleScroll = () => {
  const stickyActive = window.scrollY >= 300;
  if (stickyActive !== isSticky.value) {
    isSticky.value = stickyActive;
    isCategoryMenuOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

let debounceTimeout: any = null;

const onSearchInput = () => {
  clearTimeout(debounceTimeout);
  if (!searchQuery.value.trim()) {
    searchSuggestions.value = [];
    return;
  }

  debounceTimeout = setTimeout(async () => {
    try {
      const results = await $fetch<any>(`${apiBase}/products`, {
        query: {
          search: searchQuery.value.trim(),
          limit: 5,
          page: 1
        }
      });
      if (results && results.rows) {
        searchSuggestions.value = results.rows;
      } else {
        searchSuggestions.value = results || [];
      }
    } catch (err) {
      console.error('Search error:', err);
    }
  }, 300);
};

const onSearchBlur = () => {
  setTimeout(() => {
    isSearchFocused.value = false;
  }, 200);
};

const navigateToProduct = (id: number) => {
  searchQuery.value = '';
  searchSuggestions.value = [];
  isSearchFocused.value = false;
  navigateTo(`/product/${id}`);
};

const getProductImage = (product: any) => {
  if (product.image_url) return product.image_url;
  if (product.images && product.images.length > 0) {
    return product.images[0].image_url;
  }
  return '/assets/img/product/product-or-1.jpg';
};
</script>

<style scoped>
.header-middle-area {
  position: relative;
  z-index: 110;
}
/* Ensure main menu area sits above body content (e.g. slider) when not sticky */
.main-menu-area {
  position: relative;
  z-index: 100;
}
/* Scoped adjustments for Category Menu */
.category-menu {
  position: absolute;
  width: 100%;
  z-index: 99;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-top: none;
}
.off-canvas-wrapper.open {
  opacity: 1;
  visibility: visible;
}
.search-suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 15px;
  right: 15px;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 99999;
  max-height: 350px;
  overflow-y: auto;
}
.suggestion-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background 0.2s;
}
.suggestion-item:last-child {
  border-bottom: none;
}
.suggestion-item:hover {
  background: #f9f9f9;
}
.suggestion-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  margin-right: 12px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
}
.suggestion-info {
  display: flex;
  flex-direction: column;
}
.suggestion-name {
  font-size: 13px;
  font-weight: 500;
  color: #333;
  line-height: 1.2;
}
.suggestion-price {
  font-size: 12px;
  color: #1891ac;
  font-weight: 600;
  margin-top: 4px;
}
</style>
