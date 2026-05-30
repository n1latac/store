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
                    <span>Language:</span>
                    <img src="/assets/img/icon/en.png" alt="English"> English
                  </li>
                  <li class="curreny-wrap">
                    <span>Currency:</span>
                    ₴ UAH
                  </li>
                </ul>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="header-links">
                <ul class="nav justify-content-end">
                  <li><NuxtLink to="/admin/categories">Админ-панель</NuxtLink></li>
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
                  <img src="/assets/img/logo/logo.png" alt="Oregon Logo">
                </NuxtLink>
              </div>
            </div>
            <!-- start logo area -->

            <!-- start search box area -->
            <div class="col-lg-5">
              <div class="search-box-wrapper">
                <form class="search-box-inner" @submit.prevent="handleSearch">
                  <input type="text" v-model="searchQuery" class="search-field" placeholder="Поиск товаров...">
                  <button type="submit" class="search-btn"><i class="ion-ios-search"></i></button>
                </form>
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
                    <p>Поддержка звонков:</p>
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
                              <span class="cart-qty">Кол-во: {{ item.quantity }}</span>
                              <span>{{ item.price }} ₴</span>
                            </div>
                            <div class="del-icon" @click="removeFromCart(item.id)">
                              <i class="fa fa-times"></i>
                            </div>
                          </li>
                        </ul>
                        <div v-else class="text-center py-4 text-muted">
                          Корзина пуста
                        </div>
                        <template v-if="cartItems.length > 0">
                          <ul class="minicart-pricing-box">
                            <li class="total">
                              <span>Итого</span>
                              <span><strong>{{ cartTotal }} ₴</strong></span>
                            </li>
                          </ul>
                          <div class="minicart-button">
                            <NuxtLink to="/cart"><i class="fa fa-shopping-cart"></i> В корзину</NuxtLink>
                            <NuxtLink to="/checkout"><i class="fa fa-share"></i> Оформить</NuxtLink>
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
                  Категории товаров
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
                    <li :class="{ active: route.path === '/' }"><NuxtLink to="/">Главная</NuxtLink></li>
                    <li :class="{ active: route.path === '/shop' }"><NuxtLink to="/shop">Магазин</NuxtLink></li>
                    <li :class="{ active: route.path === '/cart' }"><NuxtLink to="/cart">Корзина</NuxtLink></li>
                    <li :class="{ active: route.path === '/checkout' }"><NuxtLink to="/checkout">Оформление заказа</NuxtLink></li>
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
              <input type="text" v-model="searchQuery" placeholder="Поиск товаров...">
              <button type="submit" class="search-btn"><i class="ion-ios-search-strong"></i></button>
            </form>
          </div>
          <!-- search box end -->

          <!-- mobile menu start -->
          <div class="mobile-navigation">
            <!-- mobile menu navigation start -->
            <nav>
              <ul class="mobile-menu">
                <li><NuxtLink to="/" @click="isMobileMenuOpen = false">Главная</NuxtLink></li>
                <li><NuxtLink to="/shop" @click="isMobileMenuOpen = false">Магазин</NuxtLink></li>
                <li><NuxtLink to="/cart" @click="isMobileMenuOpen = false">Корзина</NuxtLink></li>
                <li><NuxtLink to="/checkout" @click="isMobileMenuOpen = false">Оформление заказа</NuxtLink></li>
                <li><NuxtLink to="/admin/categories" @click="isMobileMenuOpen = false">Админ-панель</NuxtLink></li>
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

const isCategoryMenuOpen = ref(isHome.value);
const isMobileMenuOpen = ref(false);
const searchQuery = ref('');

watch(() => route.path, (newPath) => {
  isCategoryMenuOpen.value = newPath === '/';
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
  isSticky.value = window.scrollY >= 300;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
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
</style>
