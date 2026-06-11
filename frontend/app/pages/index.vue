<template>
  <div>
    <main class="body-bg">
      <!-- slider area start -->
      <section class="slider-area position-relative">
        <div class="hero-slider-active-wrapper">
          <div 
            class="hero-slider-item slick-current" 
            :style="{ 
              backgroundImage: `url(${activeSlide.bg})`, 
              display: 'block',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }"
          >
            <div class="container h-100">
              <div class="row align-items-center h-100">
                <div class="col-md-10">
                  <div class="hero-slider-content text-left">
                    <h2>{{ activeSlide.subtitle }}</h2>
                    <h1>{{ activeSlide.title }}</h1>
                    <h3>{{ activeSlide.desc }}</h3>
                    <NuxtLink to="/shop" class="btn-hero">{{ locale === 'uk' ? 'Купити зараз' : 'Buy Now' }}</NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Slider Navigation -->
          <button type="button" class="slick-prev slider-nav-btn" @click="prevSlide">
            <i class="ion-ios-arrow-left"></i>
          </button>
          <button type="button" class="slick-next slider-nav-btn" @click="nextSlide">
            <i class="ion-ios-arrow-right"></i>
          </button>
        </div>
      </section>
      <!-- slider area end -->

      <!-- service features start -->
      <section class="service-features pt-50">
        <div class="container">
          <div class="service-features-inner bg-white">
            <div class="row">
              <div class="col-lg-4 col-md-4">
                <div class="single-features-item">
                  <div class="features-icon">
                    <i class="ion-paper-airplane"></i>
                  </div>
                  <div class="features-content">
                    <h5>{{ locale === 'uk' ? 'Швидка доставка' : 'Fast Delivery' }}</h5>
                    <p>{{ locale === 'uk' ? 'По всій Україні Новою Поштою' : 'All over Ukraine via Nova Poshta' }}</p>
                  </div>
                </div>
              </div>

              <div class="col-lg-4 col-md-4">
                <div class="single-features-item">
                  <div class="features-icon">
                    <i class="ion-help-buoy"></i>
                  </div>
                  <div class="features-content">
                    <h5>{{ locale === 'uk' ? 'Підтримка 24/7' : 'Support 24/7' }}</h5>
                    <p>{{ locale === 'uk' ? 'Наші менеджери завжди на зв’язку' : 'Our managers are always online' }}</p>
                  </div>
                </div>
              </div>

              <div class="col-lg-4 col-md-4">
                <div class="single-features-item">
                  <div class="features-icon">
                    <i class="ion-lock-combination"></i>
                  </div>
                  <div class="features-content">
                    <h5>{{ locale === 'uk' ? 'Безпечна оплата' : 'Secure Payment' }}</h5>
                    <p>{{ locale === 'uk' ? '100% захист ваших платежів' : '100% protected payments' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- service features end -->

      <!-- deals area start -->
      <section class="deals-area pt-50" v-if="dealsProducts.length > 0">
        <div class="container">
          <div class="deals-wrapper bg-white">
            <div class="row">
              <div class="col-12">
                <div class="section-header-deals">
                  <div class="section-title-deals">
                    <h4>{{ locale === 'uk' ? 'Пропозиції тижня' : 'Deals Of The Week' }}</h4>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <div class="deals-carousel-container">
                  <!-- Navigation buttons -->
                  <button class="carousel-nav-btn prev" @click="scrollDeals('left')" aria-label="Previous">
                    <i class="ion-ios-arrow-left"></i>
                  </button>
                  <button class="carousel-nav-btn next" @click="scrollDeals('right')" aria-label="Next">
                    <i class="ion-ios-arrow-right"></i>
                  </button>
                  
                  <div class="deals-slider-track" ref="dealsSliderRef">
                    <div 
                      v-for="product in dealsProducts" 
                      :key="product.id" 
                      class="deals-item-col mb-4"
                    >
                      <div class="deals-item">
                        <div class="deals-thumb">
                          <NuxtLink :to="`/product/${product.id}`">
                            <img :src="product.image_url || '/assets/img/product/product-or-1.jpg'" alt="" class="product-img">
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
                        <div class="deals-content">
                          <h4 class="product-name">
                            <NuxtLink :to="`/product/${product.id}`">
                              {{ locale === 'uk' ? product.name_uk : (product.name_en || product.name_uk) }}
                            </NuxtLink>
                          </h4>
                          <div class="mt-auto">
                            <div class="price-box">
                              <span class="price-regular">{{ product.price }} ₴</span>
                              <span class="price-old" v-if="product.old_price"><del>{{ product.old_price }} ₴</del></span>
                            </div>
                            <a class="btn btn-cart mt-2" href="#" @click.prevent="addToCart(product)"><i class="ion-bag"></i> {{ t('addToCart') }}</a>
                            <div class="product-countdown mt-2 font-weight-bold text-info" style="font-size: 13px;">
                              <i class="ion-android-alarm-clock mr-1"></i>
                              {{ locale === 'uk' ? 'Акція діє до кінця тижня' : 'Sale ends this week' }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- deals area end -->

      <!-- banner statistics start 
      <div class="banner-statistics-area pt-50">
        <div class="container">
          <div class="row">
            <div class="col-12">
              <div class="img-container">
                <NuxtLink to="/shop">
                  <img src="/assets/img/banner/tech_wide_banner.png" alt="Banner 1" class="w-100 rounded">
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      banner statistics end -->

      <!-- features categories area start 1 (Personal Computers) -->
      <section class="features-categories-area pt-50" v-if="catComputers">
        <div class="container">
          <div class="section-wrapper bg-white">
            <div class="row">
              <div class="col-12">
                <div class="section-header">
                  <!-- section title start -->
                  <div class="section-title">
                    <h4>{{ locale === 'uk' ? catComputers.name_uk : (catComputers.name_en || catComputers.name_uk) }}</h4>
                  </div>
                  <!-- section title start -->

                  <!-- product tab menu start -->
                  <div class="feature-menu">
                    <ul class="nav justify-content-start justify-content-lg-end">
                      <li>
                        <a 
                          href="#" 
                          :class="{ active: activeCatTab1 === 'all' }" 
                          @click.prevent="activeCatTab1 = 'all'"
                        >{{ locale === 'uk' ? 'Усі товари' : 'All Products' }}</a>
                      </li>
                      <li v-for="sub in subCatsComputers" :key="sub.id">
                        <a 
                          href="#" 
                          :class="{ active: activeCatTab1 === sub.id }" 
                          @click.prevent="activeCatTab1 = sub.id"
                        >{{ locale === 'uk' ? sub.name_uk : (sub.name_en || sub.name_uk) }}</a>
                      </li>
                    </ul>
                  </div>
                  <!-- product tab menu start -->
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <div class="products-area-wrapper mt-30">
                  <div class="row" v-if="productsCat1.length > 0">
                    <div 
                      v-for="product in productsCat1" 
                      :key="product.id" 
                      class="col-xl-3 col-lg-4 col-sm-6 mb-4"
                    >
                      <!-- Product Card -->
                      <div class="product-item">
                        <div class="product-thumb">
                          <NuxtLink :to="`/product/${product.id}`">
                            <img :src="product.image_url || '/assets/img/product/product-or-1.jpg'" alt="" class="product-img">
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
                        <div class="product-content">
                          <div class="product-category">
                            <NuxtLink :to="`/shop?category=${product.category_id}`">{{ locale === 'uk' ? product.category?.name_uk : (product.category?.name_en || product.category?.name_uk) }}</NuxtLink>
                          </div>
                          <h5 class="product-name">
                            <NuxtLink :to="`/product/${product.id}`">{{ locale === 'uk' ? product.name_uk : (product.name_en || product.name_uk) }}</NuxtLink>
                          </h5>
                          <div class="price-box">
                            <span class="price-regular">{{ product.price }} ₴</span>
                          </div>
                          <div class="product-item-action">
                            <a class="btn btn-cart" href="#" @click.prevent="addToCart(product)"><i class="ion-bag"></i> {{ t('addToCart') }}</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-center py-5 text-muted">
                    {{ locale === 'uk' ? 'Товарів не знайдено' : 'No products found' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- features categories area end 1 -->

      <!-- group list product area start -->
      <section class="group-list-product-area pt-50 pb-50" v-if="products.length > 0">
        <div class="container">
          <div class="row">
            <!-- group 1: Special Offers -->
            <div class="col-lg-4 col-md-6 mb-4">
              <div class="group-list-wrapper bg-white p-4 h-100">
                <div class="group-list-header border-bottom pb-2 mb-3">
                  <h4 class="group-list-title mb-0">{{ locale === 'uk' ? 'Спеціальні пропозиції' : 'Special Offers' }}</h4>
                </div>
                <div class="group-list-item-wrapper">
                  <div v-for="product in groupOffers" :key="product.id" class="group-item d-flex align-items-center mb-3">
                    <div class="group-item-thumb border rounded p-1 mr-3" style="width: 80px; height: 80px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: #fff;">
                      <NuxtLink :to="`/product/${product.id}`">
                        <img :src="product.image_url || '/assets/img/product/product-or-1.jpg'" alt="" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                      </NuxtLink>
                    </div>
                    <div class="group-item-desc">
                      <h5 class="group-product-name mb-1" style="font-size: 14px; line-height: 1.3;">
                        <NuxtLink :to="`/product/${product.id}`" class="text-dark">
                          {{ locale === 'uk' ? product.name_uk : (product.name_en || product.name_uk) }}
                        </NuxtLink>
                      </h5>
                      <div class="price-box my-1">
                        <span class="price-regular font-weight-bold text-info">{{ product.price }} ₴</span>
                      </div>
                      <div class="add-to-links group-action-link" style="font-size: 14px;">
                        <a href="#" class="mr-2" @click.prevent="toggleWishlist(product)" :title="locale === 'uk' ? 'В обране' : 'Wishlist'">
                          <i :class="isInWishlist(product.id) ? 'ion-android-favorite text-danger' : 'ion-android-favorite-outline'"></i>
                        </a>
                        <a href="#" @click.prevent="addToCart(product)" :title="locale === 'uk' ? 'В кошик' : 'Add to Cart'">
                          <i class="ion-bag"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- group 2: New Products -->
            <div class="col-lg-4 col-md-6 mb-4">
              <div class="group-list-wrapper bg-white p-4 h-100">
                <div class="group-list-header border-bottom pb-2 mb-3">
                  <h4 class="group-list-title mb-0">{{ locale === 'uk' ? 'Нові товари' : 'New Products' }}</h4>
                </div>
                <div class="group-list-item-wrapper">
                  <div v-for="product in groupNew" :key="product.id" class="group-item d-flex align-items-center mb-3">
                    <div class="group-item-thumb border rounded p-1 mr-3" style="width: 80px; height: 80px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: #fff;">
                      <NuxtLink :to="`/product/${product.id}`">
                        <img :src="product.image_url || '/assets/img/product/product-or-1.jpg'" alt="" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                      </NuxtLink>
                    </div>
                    <div class="group-item-desc">
                      <h5 class="group-product-name mb-1" style="font-size: 14px; line-height: 1.3;">
                        <NuxtLink :to="`/product/${product.id}`" class="text-dark">
                          {{ locale === 'uk' ? product.name_uk : (product.name_en || product.name_uk) }}
                        </NuxtLink>
                      </h5>
                      <div class="price-box my-1">
                        <span class="price-regular font-weight-bold text-info">{{ product.price }} ₴</span>
                      </div>
                      <div class="add-to-links group-action-link" style="font-size: 14px;">
                        <a href="#" class="mr-2" @click.prevent="toggleWishlist(product)" :title="locale === 'uk' ? 'В обране' : 'Wishlist'">
                          <i :class="isInWishlist(product.id) ? 'ion-android-favorite text-danger' : 'ion-android-favorite-outline'"></i>
                        </a>
                        <a href="#" @click.prevent="addToCart(product)" :title="locale === 'uk' ? 'В кошик' : 'Add to Cart'">
                          <i class="ion-bag"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- group 3: Popular Products -->
            <div class="col-lg-4 col-md-6 mb-4">
              <div class="group-list-wrapper bg-white p-4 h-100">
                <div class="group-list-header border-bottom pb-2 mb-3">
                  <h4 class="group-list-title mb-0">{{ locale === 'uk' ? 'Популярні товари' : 'Popular Products' }}</h4>
                </div>
                <div class="group-list-item-wrapper">
                  <div v-for="product in groupPopular" :key="product.id" class="group-item d-flex align-items-center mb-3">
                    <div class="group-item-thumb border rounded p-1 mr-3" style="width: 80px; height: 80px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: #fff;">
                      <NuxtLink :to="`/product/${product.id}`">
                        <img :src="product.image_url || '/assets/img/product/product-or-1.jpg'" alt="" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                      </NuxtLink>
                    </div>
                    <div class="group-item-desc">
                      <h5 class="group-product-name mb-1" style="font-size: 14px; line-height: 1.3;">
                        <NuxtLink :to="`/product/${product.id}`" class="text-dark">
                          {{ locale === 'uk' ? product.name_uk : (product.name_en || product.name_uk) }}
                        </NuxtLink>
                      </h5>
                      <div class="price-box my-1">
                        <span class="price-regular font-weight-bold text-info">{{ product.price }} ₴</span>
                      </div>
                      <div class="add-to-links group-action-link" style="font-size: 14px;">
                        <a href="#" class="mr-2" @click.prevent="toggleWishlist(product)" :title="locale === 'uk' ? 'В обране' : 'Wishlist'">
                          <i :class="isInWishlist(product.id) ? 'ion-android-favorite text-danger' : 'ion-android-favorite-outline'"></i>
                        </a>
                        <a href="#" @click.prevent="addToCart(product)" :title="locale === 'uk' ? 'В кошик' : 'Add to Cart'">
                          <i class="ion-bag"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- group list product area end -->

      <!-- features categories area start 2 (Laptops) -->
      <section class="features-categories-area pt-50 pb-50" v-if="catLaptops">
        <div class="container">
          <div class="section-wrapper bg-white">
            <div class="row">
              <div class="col-12">
                <div class="section-header">
                  <!-- section title start -->
                  <div class="section-title">
                    <h4>{{ locale === 'uk' ? catLaptops.name_uk : (catLaptops.name_en || catLaptops.name_uk) }}</h4>
                  </div>
                  <!-- section title start -->

                  <!-- product tab menu start -->
                  <div class="feature-menu">
                    <ul class="nav justify-content-start justify-content-lg-end">
                      <li>
                        <a 
                          href="#" 
                          :class="{ active: activeCatTab2 === 'all' }" 
                          @click.prevent="activeCatTab2 = 'all'"
                        >{{ locale === 'uk' ? 'Усі товари' : 'All Products' }}</a>
                      </li>
                      <li v-for="sub in subCatsLaptops" :key="sub.id">
                        <a 
                          href="#" 
                          :class="{ active: activeCatTab2 === sub.id }" 
                          @click.prevent="activeCatTab2 = sub.id"
                        >{{ locale === 'uk' ? sub.name_uk : (sub.name_en || sub.name_uk) }}</a>
                      </li>
                    </ul>
                  </div>
                  <!-- product tab menu start -->
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <div class="products-area-wrapper mt-30">
                  <div class="row" v-if="productsCat2.length > 0">
                    <div 
                      v-for="product in productsCat2" 
                      :key="product.id" 
                      class="col-xl-3 col-lg-4 col-sm-6 mb-4"
                    >
                      <!-- Product Card -->
                      <div class="product-item">
                        <div class="product-thumb">
                          <NuxtLink :to="`/product/${product.id}`">
                            <img :src="product.image_url || '/assets/img/product/product-or-1.jpg'" alt="" class="product-img">
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
                        <div class="product-content">
                          <div class="product-category">
                            <NuxtLink :to="`/shop?category=${product.category_id}`">{{ locale === 'uk' ? product.category?.name_uk : (product.category?.name_en || product.category?.name_uk) }}</NuxtLink>
                          </div>
                          <h5 class="product-name">
                            <NuxtLink :to="`/product/${product.id}`">{{ locale === 'uk' ? product.name_uk : (product.name_en || product.name_uk) }}</NuxtLink>
                          </h5>
                          <div class="price-box">
                            <span class="price-regular">{{ product.price }} ₴</span>
                          </div>
                          <div class="product-item-action">
                            <a class="btn btn-cart" href="#" @click.prevent="addToCart(product)"><i class="ion-bag"></i> {{ t('addToCart') }}</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-center py-5 text-muted">
                    {{ locale === 'uk' ? 'Товарів не знайдено' : 'No products found' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- features categories area end 2 -->

    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useCart } from '~/composables/useCart';
import { useWishlist } from '~/composables/useWishlist';
import { useLocale } from '~/composables/useLocale';

definePageMeta({
  layout: 'default'
});

const { locale, t } = useLocale();

// Slider config
const slides = computed(() => [
  {
    bg: '/assets/img/slider/home1-slide1.jpg',
    subtitle: locale.value === 'uk' ? 'ПЕРСОНАЛЬНІ КОМП’ЮТЕРИ' : 'PERSONAL COMPUTERS',
    title: locale.value === 'uk' ? 'Висока потужність' : 'High Performance',
    desc: locale.value === 'uk' ? 'Міні ПК MinisForum та Geekom від 10,500 ₴' : 'MinisForum & Geekom Mini PCs from 10,500 ₴',
  },
  {
    bg: '/assets/img/slider/home1-slide2.jpg',
    subtitle: locale.value === 'uk' ? 'СУЧАСНІ МОНІТОРИ' : 'MODERN MONITORS',
    title: locale.value === 'uk' ? 'Чітке зображення' : 'Crystal Clear Image',
    desc: locale.value === 'uk' ? 'IPS дисплеї Dell та Acer з частотою до 144Hz' : 'Dell & Acer IPS displays up to 144Hz',
  }
]);

const currentSlide = ref(0);
const activeSlide = computed(() => (slides.value[currentSlide.value] || slides.value[0]) as { bg: string; subtitle: string; title: string; desc: string });

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length;
};

let slideTimer: any;
onMounted(() => {
  slideTimer = setInterval(nextSlide, 5000);
});
onUnmounted(() => {
  clearInterval(slideTimer);
});

// Fetch data from backend
const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

const { data: rawProducts } = await useFetch<any>(`${apiBase}/products`);
const { data: rawDealsProducts } = await useFetch<any>(`${apiBase}/products`, {
  query: { is_deal: 'true' }
});
const { data: rawCategories } = await useFetch<any>(`${apiBase}/categories`);

const products = computed<any[]>(() => {
  if (!rawProducts.value) return [];
  if (Array.isArray(rawProducts.value)) return rawProducts.value;
  if (rawProducts.value.rows && Array.isArray(rawProducts.value.rows)) return rawProducts.value.rows;
  return [];
});

const dealsProducts = computed<any[]>(() => {
  if (!rawDealsProducts.value) return [];
  if (Array.isArray(rawDealsProducts.value)) return rawDealsProducts.value;
  if (rawDealsProducts.value.rows && Array.isArray(rawDealsProducts.value.rows)) return rawDealsProducts.value.rows;
  return [];
});

const categories = computed<any[]>(() => {
  if (!rawCategories.value) return [];
  if (Array.isArray(rawCategories.value)) return rawCategories.value;
  if (rawCategories.value.rows && Array.isArray(rawCategories.value.rows)) return rawCategories.value.rows;
  return [];
});

// Find Computer Category (ID 1 in seed)
const catComputers = computed(() => {
  return categories.value.find(c => c.name_uk.includes("Персональні комп'ютери") || c.name_en?.includes("Personal Computers") || c.id === 1);
});

// Find Laptops Category (ID 3 in seed)
const catLaptops = computed(() => {
  return categories.value.find(c => c.name_uk.includes("Ноутбуки") || c.name_en?.includes("Laptops") || c.id === 3);
});

// Subcategories
const subCatsComputers = computed(() => {
  if (!catComputers.value) return [];
  return categories.value.filter(c => c.parent_id === catComputers.value.id);
});

const subCatsLaptops = computed(() => {
  if (!catLaptops.value) return [];
  return categories.value.filter(c => c.parent_id === catLaptops.value.id);
});

// Tabs state for category sections
const activeCatTab1 = ref<string | number>('all');
const activeCatTab2 = ref<string | number>('all');

// Category products lists
const productsCat1 = computed(() => {
  if (!catComputers.value) return [];
  let list = products.value;
  if (activeCatTab1.value === 'all') {
    const ids = [catComputers.value.id, ...subCatsComputers.value.map(c => c.id)];
    list = list.filter(p => ids.includes(p.category_id));
  } else {
    list = list.filter(p => p.category_id === Number(activeCatTab1.value));
  }
  return list.slice(0, 8);
});

const productsCat2 = computed(() => {
  if (!catLaptops.value) return [];
  let list = products.value;
  if (activeCatTab2.value === 'all') {
    const ids = [catLaptops.value.id, ...subCatsLaptops.value.map(c => c.id)];
    list = list.filter(p => ids.includes(p.category_id));
  } else {
    list = list.filter(p => p.category_id === Number(activeCatTab2.value));
  }
  return list.slice(0, 8);
});

// Group lists (Special, New, Most Viewed)
const groupOffers = computed(() => {
  return products.value.slice(0, 3);
});

const groupNew = computed(() => {
  return products.value.slice(3, 6);
});

const groupPopular = computed(() => {
  return products.value.slice(6, 9);
});


// Cart & Wishlist actions
const { addToCart } = useCart();
const { isInWishlist, toggleWishlist } = useWishlist();

// Slider for Deals of the week
const dealsSliderRef = ref<HTMLElement | null>(null);
const scrollDeals = (direction: 'left' | 'right') => {
  const slider = dealsSliderRef.value;
  if (!slider) return;
  const itemWidth = slider.querySelector('.deals-item-col')?.getBoundingClientRect().width || 300;
  const scrollAmount = direction === 'left' ? -itemWidth : itemWidth;
  slider.scrollBy({
    left: scrollAmount,
    behavior: 'smooth'
  });
};
</script>

<style scoped>
.hero-slider-active-wrapper {
  position: relative;
  overflow: hidden;
  height: 520px;
}
.hero-slider-item {
  height: 100%;
}
.slider-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.3);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  z-index: 10;
  transition: background 0.3s;
}
.slider-nav-btn:hover {
  background: rgba(255, 255, 255, 0.7);
  color: #333;
}
.slick-prev {
  left: 30px;
}
.slick-next {
  right: 30px;
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

/* Deals carousel styles */
.deals-carousel-container {
  position: relative;
  width: 100%;
  padding-left: 50px;
  padding-right: 50px;
}
.deals-slider-track {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Hide scrollbar Firefox */
}
.deals-slider-track::-webkit-scrollbar {
  display: none; /* Hide scrollbar Chrome/Safari */
}
.deals-item-col {
  flex: 0 0 100%;
  scroll-snap-align: start;
  padding: 0 10px;
}
@media (min-width: 576px) {
  .deals-item-col {
    flex: 0 0 50%;
  }
}
@media (min-width: 992px) {
  .deals-item-col {
    flex: 0 0 33.333%;
  }
}
.deals-item {
  display: flex;
  flex-direction: row;
  height: 100%;
}
.deals-thumb {
  max-width: 50%;
  flex-basis: 50%;
  position: relative;
  padding-top: 35px;
}
.deals-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  max-width: 50%;
  flex-basis: 50%;
  padding-left: 20px;
  padding-top: 25px;
}
@media (max-width: 575.98px) {
  .deals-item {
    flex-direction: column;
  }
  .deals-thumb,
  .deals-content {
    max-width: 100%;
    flex-basis: 100%;
  }
  .deals-content {
    padding-left: 0;
    padding-top: 15px;
  }
}
.product-name {
  flex-grow: 1;
  min-height: 48px; /* ensures title area has enough space */
}

/* Nav buttons */
.carousel-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #eee;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  font-size: 20px;
  color: #333;
}
.carousel-nav-btn:hover {
  background: #1891ac; /* Theme blue color of the template */
  color: #fff;
  border-color: #1891ac;
  box-shadow: 0 6px 16px rgba(24, 145, 172, 0.3);
}
.carousel-nav-btn.prev {
  left: 3px;
}
.carousel-nav-btn.next {
  right: 3px;
}
@media (max-width: 768px) {
  .deals-carousel-container {
    padding-left: 40px;
    padding-right: 40px;
  }
  .carousel-nav-btn {
    width: 36px;
    height: 36px;
  }
  .carousel-nav-btn.prev {
    left: 2px;
  }
  .carousel-nav-btn.next {
    right: 2px;
  }
}
</style>
