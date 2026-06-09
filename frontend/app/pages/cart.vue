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
                  <li class="breadcrumb-item"><NuxtLink to="/">Головна</NuxtLink></li>
                  <li class="breadcrumb-item active" aria-current="page">Кошик</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- breadcrumb area end -->

    <!-- cart main wrapper start -->
    <div class="cart-main-wrapper section-space">
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
                        <th class="pro-thumbnail">Зображення</th>
                        <th class="pro-title">Товар</th>
                        <th class="pro-price">Ціна</th>
                        <th class="pro-quantity">Кількість</th>
                        <th class="pro-subtotal">Всього</th>
                        <th class="pro-remove">Видалити</th>
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
                          <NuxtLink :to="`/product/${item.id}`">{{ item.name }}</NuxtLink>
                        </td>
                        <td class="pro-price"><span>{{ item.price }} ₴</span></td>
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
                        <td class="pro-subtotal"><span>{{ item.price * item.quantity }} ₴</span></td>
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
                    <NuxtLink to="/shop" class="btn btn-secondary text-white font-weight-bold" style="background-color: #777; border: none; padding: 10px 20px;">
                      Продовжити покупки
                    </NuxtLink>
                  </div>
                  <div class="cart-update mt-xs-30">
                    <button @click="clearCart" class="btn btn-secondary font-weight-bold" style="background-color: #dc3545; border: none; padding: 10px 20px;">
                      Очистити кошик
                    </button>
                  </div>
                </div>

                <!-- Cart Total Area -->
                <div class="row mt-40">
                  <div class="col-lg-5 ml-auto">
                    <div class="cart-calculator-wrapper border p-4 rounded bg-light">
                      <div class="cart-calculate-items">
                        <h3 class="border-bottom pb-2 mb-3">Сума замовлення</h3>
                        <div class="table-responsive">
                          <table class="table">
                            <tr>
                              <td>Товари</td>
                              <td>{{ cartTotal }} ₴</td>
                            </tr>
                            <tr>
                              <td>Доставка</td>
                              <td>Безкоштовно</td>
                            </tr>
                            <tr class="total border-top">
                              <td class="font-weight-bold">Разом</td>
                              <td class="text-success font-weight-bold">{{ cartTotal }} ₴</td>
                            </tr>
                          </table>
                        </div>
                      </div>
                      <NuxtLink to="/checkout" class="btn btn-secondary d-block text-center text-white font-weight-bold mt-3" style="background-color: #00DC82; border: none; padding: 12px;">
                        Перейти до оформлення
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
                <h3>Ваш кошик порожній!</h3>
                <p class="text-muted mt-2">Ви не додали жодного товару в кошик.</p>
                <NuxtLink to="/shop" class="btn btn-secondary text-white font-weight-bold mt-4" style="background-color: #00DC82; border: none; padding: 12px 30px;">
                  Повернутися до магазину
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

definePageMeta({
  layout: 'default'
});

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
