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
                  <li class="breadcrumb-item"><NuxtLink to="/cart">Корзина</NuxtLink></li>
                  <li class="breadcrumb-item active" aria-current="page">Оформление заказа</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- breadcrumb area end -->

    <!-- checkout main wrapper start -->
    <div class="checkout-page-wrapper section-space">
      <div class="container">
        <div v-if="cartItems.length > 0" class="row">
          <!-- Billing Details -->
          <div class="col-lg-6">
            <div class="checkout-billing-details-wrap bg-white p-4 rounded shadow-sm">
              <h4 class="checkout-title border-bottom pb-2 mb-4">Данные для доставки</h4>
              <form @submit.prevent="handlePlaceOrder">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="font-weight-bold">Имя <span class="text-danger">*</span></label>
                    <input type="text" v-model="form.firstName" class="form-control" required placeholder="Имя">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="font-weight-bold">Фамилия <span class="text-danger">*</span></label>
                    <input type="text" v-model="form.lastName" class="form-control" required placeholder="Фамилия">
                  </div>
                </div>

                <div class="mb-3">
                  <label class="font-weight-bold">Телефон <span class="text-danger">*</span></label>
                  <input type="tel" v-model="form.phone" class="form-control" required placeholder="+380...">
                </div>

                <div class="mb-3">
                  <label class="font-weight-bold">Email <span class="text-danger">*</span></label>
                  <input type="email" v-model="form.email" class="form-control" required placeholder="example@mail.com">
                </div>

                <div class="row">
                  <div class="col-md-7 mb-3">
                    <label class="font-weight-bold">Город <span class="text-danger">*</span></label>
                    <input type="text" v-model="form.city" class="form-control" required placeholder="Киев, Львов...">
                  </div>
                  <div class="col-md-5 mb-3">
                    <label class="font-weight-bold">Отделение НП <span class="text-danger">*</span></label>
                    <input type="text" v-model="form.warehouse" class="form-control" required placeholder="№1, №15...">
                  </div>
                </div>

                <div class="mb-3">
                  <label class="font-weight-bold">Примечания к заказу (необязательно)</label>
                  <textarea v-model="form.notes" class="form-control" rows="4" placeholder="Особые пожелания к доставке или упаковке"></textarea>
                </div>

                <button type="submit" id="submit-order-btn" class="d-none"></button>
              </form>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="col-lg-6">
            <div class="order-summary-details bg-white p-4 rounded shadow-sm mt-md-30">
              <h4 class="checkout-title border-bottom pb-2 mb-4">Ваш заказ</h4>
              <div class="order-summary-content">
                <!-- Order Summary Table -->
                <div class="order-summary-table table-responsive text-center">
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th>Товар</th>
                        <th>Итого</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in cartItems" :key="item.id">
                        <td>
                          <NuxtLink :to="`/product/${item.id}`" class="text-dark font-weight-bold">{{ item.name }}</NuxtLink>
                          <strong> × {{ item.quantity }}</strong>
                        </td>
                        <td>{{ item.price * item.quantity }} ₴</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td class="font-weight-bold">Товары</td>
                        <td>{{ cartTotal }} ₴</td>
                      </tr>
                      <tr>
                        <td class="font-weight-bold">Доставка</td>
                        <td class="text-success font-weight-bold">Бесплатно</td>
                      </tr>
                      <tr class="h5">
                        <td class="font-weight-bold">Итого к оплате</td>
                        <td class="text-success font-weight-bold">{{ cartTotal }} ₴</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <!-- Payment Method -->
                <div class="payment-method-wrapper mt-30">
                  <h5 class="mb-3 font-weight-bold">Способ оплаты</h5>
                  <div class="payment-methods">
                    <div class="custom-control custom-radio mb-2">
                      <input 
                        type="radio" 
                        id="payment_cod" 
                        name="paymentmethod" 
                        value="cod" 
                        v-model="form.paymentMethod" 
                        class="custom-control-input"
                      >
                      <label class="custom-control-label cursor-pointer" for="payment_cod">
                        Наложенный платеж (При получении Новой Почтой)
                      </label>
                    </div>
                    <div class="custom-control custom-radio mb-3">
                      <input 
                        type="radio" 
                        id="payment_card" 
                        name="paymentmethod" 
                        value="card" 
                        v-model="form.paymentMethod" 
                        class="custom-control-input"
                      >
                      <label class="custom-control-label cursor-pointer" for="payment_card">
                        Банковская карта (Предоплата)
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="order-btn-wrapper mt-4">
                  <button 
                    type="button" 
                    @click="triggerSubmit" 
                    class="btn btn-secondary w-100 font-weight-bold" 
                    style="background-color: #00DC82; border: none; padding: 14px;"
                  >
                    Подтвердить заказ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Success View -->
        <div v-else-if="orderPlaced" class="text-center py-5 bg-white p-4 rounded shadow-sm">
          <div class="success-icon mb-4" style="font-size: 64px; color: #00DC82;">
            <i class="ion-checkmark-circled"></i>
          </div>
          <h2 class="text-success">Заказ успешно оформлен!</h2>
          <p class="text-muted mt-2">
            Спасибо за покупку в магазине Oregon. Наши менеджеры свяжутся с вами в ближайшее время для подтверждения.
          </p>
          <NuxtLink to="/shop" class="btn btn-secondary text-white font-weight-bold mt-4" style="background-color: #00DC82; border: none; padding: 12px 30px;">
            Продолжить покупки
          </NuxtLink>
        </div>

        <!-- Empty Cart Checkout View -->
        <div v-else class="text-center py-5 bg-white p-4 rounded shadow-sm">
          <div class="empty-cart-icon mb-4" style="font-size: 64px; color: #ccc;">
            <i class="ion-bag"></i>
          </div>
          <h3>Корзина пуста</h3>
          <p class="text-muted mt-2">Для оформления заказа добавьте хотя бы один товар в корзину.</p>
          <NuxtLink to="/shop" class="btn btn-secondary text-white font-weight-bold mt-4" style="background-color: #00DC82; border: none; padding: 12px 30px;">
            В каталог товаров
          </NuxtLink>
        </div>
      </div>
    </div>
    <!-- checkout main wrapper end -->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useCart } from '~/composables/useCart';

definePageMeta({
  layout: 'default'
});

const { cartItems, cartTotal, clearCart } = useCart();

const orderPlaced = ref(false);

const form = reactive({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  city: '',
  warehouse: '',
  notes: '',
  paymentMethod: 'cod'
});

const triggerSubmit = () => {
  const btn = document.getElementById('submit-order-btn');
  if (btn) btn.click();
};

const handlePlaceOrder = () => {
  console.log('Placing order with data:', form);
  // Clear the items
  clearCart();
  // Show success view
  orderPlaced.value = true;
};
</script>

<style scoped>
.custom-control-label {
  font-size: 14px;
}
.success-icon {
  animation: scaleUp 0.5s ease-in-out;
}
@keyframes scaleUp {
  0% { transform: scale(0.5); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
