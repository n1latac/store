<template>
  <div>
    <!-- breadcrumb area start -->
    <div class="breadcrumb-area">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="breadcrumb-wrap">
              <nav aria-label="breadcrumb">
                <h1>{{ t('cart') }}</h1>
                <ul class="breadcrumb">
                  <li class="breadcrumb-item"><NuxtLink to="/">{{ t('home') }}</NuxtLink></li>
                  <li class="breadcrumb-item active" aria-current="page">{{ t('cart') }}</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- breadcrumb area end -->

    <!-- cart main wrapper start -->
    <div class="shop-main-wrapper pt-50 pb-50">
      <div class="container">
        <div class="section-bg-color bg-white p-4 rounded shadow-sm">
          <div class="row">
            <div class="col-lg-12">
              <div v-if="cartItems.length > 0">
                <!-- Cart Table Area -->
                <div class="cart-table table-responsive">
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th class="pro-thumbnail">{{ t('image') }}</th>
                        <th class="pro-title">{{ t('product') }}</th>
                        <th class="pro-price">{{ t('price') }}</th>
                        <th class="pro-quantity">{{ t('quantity') }}</th>
                        <th class="pro-subtotal">{{ t('subtotal') }}</th>
                        <th class="pro-remove">{{ t('remove') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in cartItems" :key="item.id">
                        <td class="pro-thumbnail">
                          <NuxtLink :to="`/product/${item.id}`">
                            <img class="img-fluid cart-img" :src="item.image || '/assets/img/product/product-or-1.jpg'" alt="Product" />
                          </NuxtLink>
                        </td>
                        <td class="pro-title">
                          <NuxtLink :to="`/product/${item.id}`">{{ locale === 'uk' ? (item.name_uk || item.name) : (item.name_en || item.name_uk || item.name) }}</NuxtLink>
                        </td>
                        <td class="pro-price"><span>{{ item.price }} {{ t('currency') }}</span></td>
                        <td class="pro-quantity">
                          <div class="pro-qty border rounded d-inline-flex align-items-center" style="padding: 0 10px; height: 35px;">
                            <span class="dec qtybtn cursor-pointer px-2" @click="updateQuantity(item.id, item.quantity - 1)">-</span>
                            <input 
                              type="text" 
                              :value="item.quantity" 
                              class="text-center border-0" 
                              style="width: 30px; font-weight: bold; background: transparent;"
                              readonly
                            >
                            <span class="inc qtybtn cursor-pointer px-2" @click="updateQuantity(item.id, item.quantity + 1)">+</span>
                          </div>
                        </td>
                        <td class="pro-subtotal"><span>{{ item.price * item.quantity }} {{ t('currency') }}</span></td>
                        <td class="pro-remove">
                          <a href="#" @click.prevent="removeFromCart(item.id)"><i class="fa fa-trash-o"></i></a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Cart Update Options -->
                <div class="cart-update-option d-xs-block d-md-flex justify-content-between align-items-center mt-30">
                  <div class="apply-coupon-wrapper">
                    <NuxtLink to="/shop" class="btn btn-outline">
                      {{ locale === 'uk' ? 'Продовжити покупки' : 'Continue Shopping' }}
                    </NuxtLink>
                  </div>
                  <div class="cart-update mt-xs-30">
                    <button @click="clearCart" class="btn btn-outline">
                      {{ t('clearCart') }}
                    </button>
                  </div>
                </div>

                <!-- Cart Total Area -->
                <div class="row mt-40">
                  <div class="col-lg-5 ml-auto">
                    <div class="cart-calculator-wrapper border p-4 rounded bg-light">
                      <div class="cart-calculate-items">
                        <h3 class="border-bottom pb-2 mb-3">{{ locale === 'uk' ? 'Сума замовлення' : 'Cart Totals' }}</h3>
                        <div class="table-responsive">
                          <table class="table">
                            <tr>
                              <td>{{ locale === 'uk' ? 'Товари' : 'Subtotal' }}</td>
                              <td>{{ cartTotal }} {{ t('currency') }}</td>
                            </tr>
                            <tr>
                              <td>{{ locale === 'uk' ? 'Доставка' : 'Shipping' }}</td>
                              <td>{{ locale === 'uk' ? 'Безкоштовно' : 'Free Shipping' }}</td>
                            </tr>
                            <tr class="total border-top">
                              <td class="font-weight-bold">{{ locale === 'uk' ? 'Разом' : 'Total' }}</td>
                              <td class="text-success font-weight-bold">{{ cartTotal }} {{ t('currency') }}</td>
                            </tr>
                          </table>
                        </div>
                      </div>
                      <NuxtLink to="/checkout" class="btn btn__bg d-block text-center text-white font-weight-bold mt-3" style="padding: 12px;">
                        {{ locale === 'uk' ? 'Перейти до оформлення' : 'Proceed to Checkout' }}
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Cart Empty Message -->
              <div v-else class="text-center py-5">
                <div class="empty-cart-icon mb-4" style="font-size: 64px; color: #ccc;">
                  <i class="ion-bag"></i>
                </div>
                <h3>{{ locale === 'uk' ? 'Ваш кошик порожній!' : 'Your cart is empty!' }}</h3>
                <p class="text-muted mt-2">{{ locale === 'uk' ? 'Ви не додали жодного товару в кошик.' : 'You have not added any products to the cart yet.' }}</p>
                <NuxtLink to="/shop" class="btn btn__bg mt-4" style="padding: 12px 30px;">
                  {{ locale === 'uk' ? 'Повернутися до магазину' : 'Return to Shop' }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- cart main wrapper end -->
  </div>
</template>

<script setup lang="ts">
import { useCart } from '~/composables/useCart';
import { useLocale } from '~/composables/useLocale';

definePageMeta({
  layout: 'default'
});

const { locale, t } = useLocale();
const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
</script>

<style scoped>
.cart-table table thead tr th,
.cart-table table tbody tr td {
  white-space: normal !important;
  vertical-align: middle;
}
.pro-title {
  max-width: 280px;
  word-wrap: break-word;
}
.pro-thumbnail {
  width: 100px;
}
.pro-remove {
  width: 80px;
}
.cart-img {
  max-width: 80px;
  max-height: 80px;
  object-fit: contain;
  background: #fafafa;
}
.qtybtn {
  font-size: 16px;
  user-select: none;
}
.pro-remove a {
  font-size: 20px;
  color: #dc3545;
}
</style>
