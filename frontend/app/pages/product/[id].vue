<template>
  <div v-if="product">
    <!-- breadcrumb area start -->
    <div class="breadcrumb-area">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="breadcrumb-wrap">
              <nav aria-label="breadcrumb">
                <h1>{{ locale === 'uk' ? product.name_uk : (product.name_en || product.name_uk) }}</h1>
                <ul class="breadcrumb">
                  <li class="breadcrumb-item"><NuxtLink to="/">{{ t('home') }}</NuxtLink></li>
                  <li class="breadcrumb-item"><NuxtLink to="/shop">{{ t('shop') }}</NuxtLink></li>
                  <li class="breadcrumb-item active" aria-current="page">{{ locale === 'uk' ? product.name_uk : (product.name_en || product.name_uk) }}</li>
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
          <div class="col-lg-9 bg-white p-4 rounded shadow-sm">
            <!-- product details inner end -->
            <div class="product-details-inner">
              <div class="row">
                <div class="col-lg-6">
                  <!-- Product Image Gallery -->
                  <div class="product-large-slider-wrapper cursor-pointer position-relative" @click="openLightbox">
                     <img 
                       :src="selectedImage || '/assets/img/product/product-or-1.jpg'" 
                       alt="Product Image" 
                       class="img-fluid main-product-image border rounded"
                     >
                     <div class="zoom-icon-overlay">
                       <i class="ion-android-search"></i>
                     </div>
                   </div>
                  <!-- Thumbnails -->
                  <div v-if="product.images && product.images.length > 0" class="pro-nav-thumbnails mt-3 d-flex overflow-auto">
                    <div 
                      v-for="img in product.images" 
                      :key="img.id"
                      class="thumbnail-wrapper border p-1 rounded mr-2 cursor-pointer"
                      :class="{ active: selectedImage === img.image_url }"
                      @click="selectedImage = img.image_url"
                      style="width: 70px; height: 70px; flex-shrink: 0;"
                    >
                      <img :src="img.image_url" alt="" class="img-fluid h-100 w-100 object-fit-contain">
                    </div>
                  </div>
                </div>

                <div class="col-lg-6">
                  <div class="product-details-des mt-md-30">
                    <div class="product-category mb-2">
                      <NuxtLink :to="`/shop?category=${product.category_id}`" class="text-muted">
                        {{ locale === 'uk' ? product.category?.name_uk : (product.category?.name_en || product.category?.name_uk) }}
                      </NuxtLink>
                    </div>
                    <h3 class="product-name-title mb-3">{{ locale === 'uk' ? product.name_uk : (product.name_en || product.name_uk) }}</h3>
                    
                    <div class="price-box mb-3">
                      <span class="price-regular">{{ product.price }} ₴</span>
                    </div>

                    <div class="product-description-brief mb-4 text-muted" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                       {{ locale === 'uk' ? (product.description_uk || 'Характеристики цього товару можна подивитися в таблиці нижче. Товар доступний для купівлі.') : (product.description_en || product.description_uk || 'You can find the technical specifications of this product in the table below. The product is available for purchase.') }}
                     </div>

                    <!-- Quantity and actions -->
                    <div class="quantity-add-cart d-flex align-items-center mb-4">
                      <div class="pro-qty border rounded mr-3 d-flex align-items-center" style="height: 45px; padding: 0 10px;">
                        <span class="dec qtybtn cursor-pointer px-2" @click="decQty">-</span>
                        <input 
                          type="text" 
                          v-model.number="quantity" 
                          class="text-center border-0" 
                          style="width: 40px; font-weight: bold;"
                          readonly
                        >
                        <span class="inc qtybtn cursor-pointer px-2" @click="incQty">+</span>
                      </div>
                      <button 
                        class="btn btn__bg" 
                        @click="handleAddToCart"
                        style="height: 45px; padding: 0 25px;"
                      >{{ t('addToCart') }}</button>
                    </div>

                    <!-- External Resource Link Button -->
                    <div v-if="product.attributes?.external_link" class="external-buy-action mb-4">
                      <a 
                        :href="product.attributes.external_link" 
                        target="_blank" 
                        class="btn btn-outline-info w-100 font-weight-bold d-flex align-items-center justify-content-center"
                        style="height: 45px; font-size: 16px; border-color: #17a2b8;"
                      >
                        <i class="ion-android-open mr-2"></i> {{ locale === 'uk' ? 'Купити на першоджерелі' : 'Buy on original source' }}
                      </a>
                    </div>

                    <!-- Wishlist add -->
                    <div class="wishlist-link-wrapper">
                      <a 
                        href="#" 
                        class="text-muted" 
                        @click.prevent="toggleWishlist(product)"
                      >
                        <i 
                          class="mr-2"
                          :class="isInWishlist(product.id) ? 'ion-android-favorite text-danger' : 'ion-android-favorite-outline'"
                        ></i>
                        {{ isInWishlist(product.id) ? (locale === 'uk' ? 'Видалити з обраного' : 'Remove from wishlist') : (locale === 'uk' ? 'Додати до обраного' : 'Add to wishlist') }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- product details inner end -->

            <!-- product details reviews start -->
            <div class="product-details-reviews section-space-top">
              <div class="row">
                <div class="col-12">
                  <div class="product-review-info">
                    <ul class="nav review-tab" role="tablist">
                      <li>
                        <a 
                          href="#" 
                          :class="{ active: activeTab === 'specs' }" 
                          @click.prevent="activeTab = 'specs'"
                        >{{ t('characteristics') }}</a>
                      </li>
                      <li>
                        <a 
                          href="#" 
                          :class="{ active: activeTab === 'description' }" 
                          @click.prevent="activeTab = 'description'"
                        >{{ t('description') }}</a>
                      </li>
                    </ul>
                    
                    <div class="tab-content reviews-tab-content border-top pt-4">
                      <!-- Specs tab -->
                      <div v-if="activeTab === 'specs'" class="tab-pane fade show active">
                        <table class="table table-striped table-bordered spec-table">
                          <tbody>
                            <tr v-if="product.attributes?.brand">
                              <td class="font-weight-bold" style="width: 30%;">{{ locale === 'uk' ? 'Бренд' : 'Brand' }}</td>
                              <td>{{ product.attributes.brand }}</td>
                            </tr>
                            <tr v-if="product.attributes?.ram">
                              <td class="font-weight-bold">{{ locale === 'uk' ? 'Оперативна пам’ять' : 'RAM' }}</td>
                              <td>{{ product.attributes.ram }}</td>
                            </tr>
                            <tr v-if="product.attributes?.storage">
                              <td class="font-weight-bold">{{ locale === 'uk' ? 'Накопичувач' : 'Storage' }}</td>
                              <td>{{ product.attributes.storage }}</td>
                            </tr>
                            <tr v-for="(val, key) in customSpecs" :key="key">
                              <td class="font-weight-bold text-capitalize">{{ key }}</td>
                              <td>{{ val }}</td>
                            </tr>
                            <tr v-if="!hasSpecs">
                              <td colspan="2" class="text-center text-muted">{{ locale === 'uk' ? 'Характеристики відсутні' : 'No specifications available' }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <!-- Description tab -->
                      <div v-if="activeTab === 'description'" class="tab-pane fade show active">
                        <div class="product-description-full text-muted" style="white-space: pre-wrap;">
                          <div v-if="locale === 'uk' ? product.description_uk : (product.description_en || product.description_uk)">
                            {{ locale === 'uk' ? product.description_uk : (product.description_en || product.description_uk) }}
                          </div>
                          <div v-else>
                            <p>
                              {{ locale === 'uk' ? 'Оригінальний продукт ' + product.name_uk + '. Відповідає всім міжнародним стандартам якості та комплектується офіційною гарантією.' : 'Original product ' + (product.name_en || product.name_uk) + '. Meets all international quality standards and comes with an official warranty.' }}
                            </p>
                          </div>
                          <p v-if="product.attributes?.external_link" class="mt-3">
                            {{ locale === 'uk' ? 'Ви можете ознайомитися з усіма деталями, відгуками та оглядами на першоджерелі:' : 'You can read all the details, reviews, and specs on the original source:' }}
                            <a :href="product.attributes.external_link" target="_blank">{{ product.attributes.external_link }}</a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- product details reviews end -->
          </div>

          <!-- sidebar related products -->
          <div class="col-lg-3">
            <div class="related-products-sidebar p-3 border rounded bg-white shadow-sm">
              <h5 class="border-bottom pb-2 mb-3">{{ locale === 'uk' ? 'Схожі товари' : 'Related Products' }}</h5>
              <div v-if="relatedProducts.length > 0" class="related-list">
                <div v-for="rp in relatedProducts" :key="rp.id" class="related-item mb-4 pb-3 border-bottom">
                  <NuxtLink :to="`/product/${rp.id}`">
                    <img :src="rp.image_url" alt="" class="img-fluid mb-2 related-img rounded">
                  </NuxtLink>
                  <h6 class="related-title text-truncate">
                    <NuxtLink :to="`/product/${rp.id}`" class="text-dark font-weight-bold">{{ locale === 'uk' ? rp.name_uk : (rp.name_en || rp.name_uk) }}</NuxtLink>
                  </h6>
                  <span class="text-success font-weight-bold">{{ rp.price }} ₴</span>
                </div>
              </div>
              <div v-else class="text-muted text-center py-4">
                {{ locale === 'uk' ? 'Немає схожих товарів' : 'No related products found' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <!-- page main wrapper end -->

    <!-- Lightbox Modal -->
    <Transition name="lightbox-fade">
      <div v-if="isLightboxOpen && product.images && product.images.length > 0" class="lightbox-modal" @click.self="closeLightbox">
        <!-- Close Button -->
        <button class="lightbox-close" @click="closeLightbox" aria-label="Close">
          &times;
        </button>
        
        <!-- Navigation Buttons -->
        <button 
          v-if="product.images.length > 1" 
          class="lightbox-nav lightbox-prev" 
          @click="prevLightboxImage" 
          aria-label="Previous"
        >
          &#10094;
        </button>
        
        <button 
          v-if="product.images.length > 1" 
          class="lightbox-nav lightbox-next" 
          @click="nextLightboxImage" 
          aria-label="Next"
        >
          &#10095;
        </button>
        
        <!-- Main Lightbox Image Wrapper -->
        <div class="lightbox-content-wrapper">
          <div class="lightbox-main-container">
            <Transition name="lightbox-zoom" mode="out-in">
              <img 
                :key="lightboxIndex" 
                :src="product.images[lightboxIndex].image_url" 
                class="lightbox-main-image" 
                alt="Product Gallery Large View"
              />
            </Transition>
          </div>
          
          <!-- Lightbox Counter / Details -->
          <div class="lightbox-caption">
            {{ lightboxIndex + 1 }} / {{ product.images.length }}
          </div>
          
          <!-- Lightbox Thumbnails Grid -->
          <div v-if="product.images.length > 1" class="lightbox-thumbnails">
            <div 
              v-for="(img, idx) in product.images" 
              :key="img.id"
              class="lightbox-thumb-wrapper"
              :class="{ active: lightboxIndex === Number(idx) }"
              @click="lightboxIndex = Number(idx)"
            >
              <img :src="img.image_url" class="lightbox-thumb-image" alt="Thumbnail" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCart } from '~/composables/useCart';
import { useWishlist } from '~/composables/useWishlist';
import { useLocale } from '~/composables/useLocale';

definePageMeta({
  layout: 'default'
});

const route = useRoute();
const { locale, t } = useLocale();

// Fetch product details
const config = useRuntimeConfig();
const apiBase = config.public.apiBase;
const { data: product } = await useFetch<any>(`${apiBase}/products/${route.params.id}`);

// Fetch all products for related sidebar
const { data: allProducts } = await useFetch<any[]>(`${apiBase}/products`);

const relatedProducts = computed(() => {
  if (!product.value || !allProducts.value) return [];
  return allProducts.value
    .filter(p => p.category_id === product.value.category_id && p.id !== product.value.id)
    .slice(0, 4);
});

// Gallery state
const selectedImage = ref('');
watch(product, (newVal) => {
  if (newVal) {
    // If image_url is empty, fallback to the first thumbnail image from images array
    selectedImage.value = newVal.image_url || (newVal.images && newVal.images.length > 0 ? newVal.images[0].image_url : '');
  }
}, { immediate: true });

// Lightbox state & methods
const isLightboxOpen = ref(false);
const lightboxIndex = ref(0);

const openLightbox = () => {
  if (!product.value?.images || product.value.images.length === 0) return;
  const idx = product.value.images.findIndex((img: any) => img.image_url === selectedImage.value);
  lightboxIndex.value = idx !== -1 ? idx : 0;
  isLightboxOpen.value = true;
};

const closeLightbox = () => {
  isLightboxOpen.value = false;
};

const prevLightboxImage = () => {
  if (!product.value?.images || product.value.images.length === 0) return;
  lightboxIndex.value = (lightboxIndex.value - 1 + product.value.images.length) % product.value.images.length;
};

const nextLightboxImage = () => {
  if (!product.value?.images || product.value.images.length === 0) return;
  lightboxIndex.value = (lightboxIndex.value + 1) % product.value.images.length;
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (!isLightboxOpen.value) return;
  if (e.key === 'ArrowLeft') {
    prevLightboxImage();
  } else if (e.key === 'ArrowRight') {
    nextLightboxImage();
  } else if (e.key === 'Escape') {
    closeLightbox();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

// Tabs state
const activeTab = ref('specs');
const quantity = ref(1);

const decQty = () => {
  if (quantity.value > 1) quantity.value--;
};
const incQty = () => {
  quantity.value++;
};

// Specs computations
const customSpecs = computed(() => {
  if (!product.value?.attributes) return {};
  const copy = { ...product.value.attributes };
  // remove standard ones to prevent duplication in customSpecs loop
  delete copy.external_link;
  delete copy.brand;
  delete copy.ram;
  delete copy.storage;
  return copy;
});

const hasSpecs = computed(() => {
  const attrs = product.value?.attributes;
  if (!attrs) return false;
  return Object.keys(attrs).some(k => k !== 'external_link');
});

// Cart & Wishlist actions
const { addToCart } = useCart();
const { isInWishlist, toggleWishlist } = useWishlist();

const handleAddToCart = () => {
  if (product.value) {
    addToCart(product.value, quantity.value);
    alert(locale.value === 'uk' ? 'Товар додано в кошик!' : 'Product added to cart!');
  }
};
</script>

<style scoped>
.main-product-image {
  max-height: 400px;
  width: 100%;
  object-fit: contain;
  background: #fafafa;
}
.thumbnail-wrapper {
  cursor: pointer;
  background: #fff;
  transition: border-color 0.2s;
}
.thumbnail-wrapper.active {
  border-color: #00DC82 !important;
}
.qtybtn {
  font-size: 20px;
  user-select: none;
}
.nav.review-tab li a {
  display: block;
  padding: 10px 20px;
  color: #333;
  font-weight: bold;
}
.nav.review-tab li a.active {
  color: #00DC82;
  border-bottom: 2px solid #00DC82;
}
.related-img {
  height: 150px;
  width: 100%;
  object-fit: contain;
  background: #fafafa;
}
.related-title {
  font-size: 14px;
}

/* Lightbox styles */
.product-large-slider-wrapper {
  position: relative;
  overflow: hidden;
}
.product-large-slider-wrapper:hover .zoom-icon-overlay {
  opacity: 1;
}
.zoom-icon-overlay {
  position: absolute;
  bottom: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.85);
  color: #333;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  opacity: 0;
  transition: opacity 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  pointer-events: none;
}

.lightbox-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.lightbox-close {
  position: absolute;
  top: 20px;
  right: 25px;
  color: rgba(255, 255, 255, 0.75);
  font-size: 45px;
  font-weight: 300;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s, transform 0.2s;
  z-index: 100001;
}

.lightbox-close:hover {
  color: #fff;
  transform: scale(1.1);
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  font-size: 24px;
  padding: 18px 24px;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100000;
  user-select: none;
}

.lightbox-nav:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) scale(1.08);
}

.lightbox-prev {
  left: 30px;
}

.lightbox-next {
  right: 30px;
}

.lightbox-content-wrapper {
  max-width: 90%;
  max-height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.lightbox-main-container {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 100%;
  height: 60vh;
}

.lightbox-main-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.6);
  user-select: none;
}

.lightbox-caption {
  color: rgba(255, 255, 255, 0.6);
  margin-top: 15px;
  font-size: 14px;
  letter-spacing: 1px;
  font-weight: 500;
}

.lightbox-thumbnails {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  max-width: 100%;
  overflow-x: auto;
  padding: 5px;
  scrollbar-width: thin;
}

.lightbox-thumb-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
  opacity: 0.5;
  flex-shrink: 0;
  background: #fff;
}

.lightbox-thumb-wrapper:hover {
  opacity: 0.85;
  transform: translateY(-2px);
}

.lightbox-thumb-wrapper.active {
  border-color: #00DC82;
  opacity: 1;
  transform: scale(1.05);
}

.lightbox-thumb-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 2px;
}

/* Transition animations */
.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.35s ease;
}

.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}

.lightbox-zoom-enter-active,
.lightbox-zoom-leave-active {
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
}

.lightbox-zoom-enter-from {
  transform: scale(0.92);
  opacity: 0;
}

.lightbox-zoom-leave-to {
  transform: scale(1.05);
  opacity: 0;
}

@media (max-width: 768px) {
  .lightbox-nav {
    padding: 12px 18px;
    font-size: 18px;
  }
  .lightbox-prev {
    left: 15px;
  }
  .lightbox-next {
    right: 15px;
  }
  .lightbox-main-container {
    height: 50vh;
  }
}
</style>
