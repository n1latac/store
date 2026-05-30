<template>
  <div>
    <main class="body-bg">
      <!-- slider area start -->
      <section class="slider-area position-relative">
        <div class="hero-slider-active-wrapper">
          <div 
            class="hero-slider-item" 
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
                    <h2 class="animated fadeInDown">{{ activeSlide.subtitle }}</h2>
                    <h1 class="animated fadeInUp">{{ activeSlide.title }}</h1>
                    <h3 class="animated fadeInUp">{{ activeSlide.desc }}</h3>
                    <NuxtLink to="/shop" class="btn-hero animated fadeInUp">Купить сейчас</NuxtLink>
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
      <section class="service-policy-area section-space">
        <div class="container">
          <div class="service-policy-inner">
            <div class="row">
              <div class="col-lg-4 col-md-4">
                <div class="single-policy-item">
                  <div class="policy-icon">
                    <i class="ion-android-plane"></i>
                  </div>
                  <div class="policy-content">
                    <h5>Быстрая доставка</h5>
                    <p>По всей Украине Новой Почтой</p>
                  </div>
                </div>
              </div>

              <div class="col-lg-4 col-md-4">
                <div class="single-policy-item">
                  <div class="policy-icon">
                    <i class="ion-help-buoy"></i>
                  </div>
                  <div class="policy-content">
                    <h5>Поддержка 24/7</h5>
                    <p>Наши менеджеры всегда на связи</p>
                  </div>
                </div>
              </div>

              <div class="col-lg-4 col-md-4">
                <div class="single-policy-item">
                  <div class="policy-icon">
                    <i class="ion-lock-combination"></i>
                  </div>
                  <div class="policy-content">
                    <h5>Безопасная оплата</h5>
                    <p>100% защита ваших платежей</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- service features end -->

      <!-- banner statistics start -->
      <section class="banner-statistics-area">
        <div class="container">
          <div class="row row-10 mtn-20">
            <div class="col-md-6">
              <div class="img-container mt-20">
                <NuxtLink to="/shop">
                  <img src="/assets/img/banner/img1_home.jpg" alt="Banner 1" class="img-fluid w-100 rounded">
                </NuxtLink>
              </div>
            </div>
            <div class="col-md-6">
              <div class="img-container mt-20">
                <NuxtLink to="/shop">
                  <img src="/assets/img/banner/img2_home.jpg" alt="Banner 2" class="img-fluid w-100 rounded">
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- banner statistics end -->

      <!-- product section start -->
      <section class="our-product-area section-space">
        <div class="container">
          <div class="row">
            <div class="col-12">
              <div class="section-title text-center">
                <h2>Наши товары</h2>
                <p>Посмотрите новинки и популярные предложения из каталога</p>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <!-- Tab Navigation -->
              <div class="product-tab-menu text-center">
                <ul class="nav justify-content-center">
                  <li>
                    <a 
                      href="#" 
                      :class="{ active: activeTab === 'new' }" 
                      @click.prevent="activeTab = 'new'"
                    >Новые поступления</a>
                  </li>
                  <li>
                    <a 
                      href="#" 
                      :class="{ active: activeTab === 'featured' }" 
                      @click.prevent="activeTab = 'featured'"
                    >Популярные</a>
                  </li>
                </ul>
              </div>

              <!-- Tab Content -->
              <div class="product-tab-content">
                <div class="row">
                  <div 
                    v-for="product in filteredProducts" 
                    :key="product.id" 
                    class="col-xl-3 col-lg-4 col-md-6 col-sm-6"
                  >
                    <div class="product-item mt-30">
                      <div class="product-thumb">
                        <NuxtLink :to="`/product/${product.id}`">
                          <img :src="product.image_url || '/assets/img/product/product-or-1.jpg'" alt="" class="product-img">
                        </NuxtLink>
                        <div class="button-group">
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
                      <div class="product-content">
                        <div class="product-category">
                          <NuxtLink :to="`/shop?category=${product.category_id}`">{{ product.category?.name_uk }}</NuxtLink>
                        </div>
                        <h5 class="product-name">
                          <NuxtLink :to="`/product/${product.id}`">{{ product.name_uk }}</NuxtLink>
                        </h5>
                        <div class="price-box">
                          <span class="regular-price">{{ product.price }} ₴</span>
                        </div>
                        <div class="product-action-link">
                          <a href="#" @click.prevent="addToCart(product)" class="btn-add-cart">В корзину</a>
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
      <!-- product section end -->
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useCart } from '~/composables/useCart';
import { useWishlist } from '~/composables/useWishlist';

definePageMeta({
  layout: 'default'
});

// Slider config
const slides = [
  {
    bg: '/assets/img/slider/home1-slide1.jpg',
    subtitle: 'ПЕРСОНАЛЬНЫЕ КОМПЬЮТЕРЫ',
    title: 'Высокая мощность',
    desc: 'Мини ПК MinisForum и Geekom от 10,500 ₴',
  },
  {
    bg: '/assets/img/slider/home1-slide2.jpg',
    subtitle: 'СОВРЕМЕННЫЕ МОНИТОРЫ',
    title: 'Четкое изображение',
    desc: 'IPS дисплеи Dell и Acer с частотой до 144Hz',
  }
];

const currentSlide = ref(0);
const activeSlide = computed(() => (slides[currentSlide.value] || slides[0]) as { bg: string; subtitle: string; title: string; desc: string });
const activeTab = ref('new');

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length;
};

let slideTimer: any;
onMounted(() => {
  slideTimer = setInterval(nextSlide, 5000);
});
onUnmounted(() => {
  clearInterval(slideTimer);
});

// Fetch products from backend
const config = useRuntimeConfig();
const apiBase = config.public.apiBase;
const { data: products } = await useFetch<any[]>(`${apiBase}/products`);

const filteredProducts = computed(() => {
  if (!products.value) return [];
  if (activeTab.value === 'new') {
    return products.value.slice(0, 8);
  } else {
    return products.value.slice(8, 16);
  }
});

// Cart & Wishlist actions
const { addToCart } = useCart();
const { isInWishlist, toggleWishlist } = useWishlist();
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
  height: 250px;
  object-fit: contain;
  background: #fdfdfd;
}
</style>
