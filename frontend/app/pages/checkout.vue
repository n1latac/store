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
                  <li class="breadcrumb-item"><NuxtLink to="/cart">Кошик</NuxtLink></li>
                  <li class="breadcrumb-item active" aria-current="page">Оформлення замовлення</li>
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
              <h4 class="checkout-title border-bottom pb-2 mb-4">Дані для доставки</h4>
              <form @submit.prevent="handlePlaceOrder">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="font-weight-bold">Ім’я</label>
                    <input type="text" v-model="form.firstName" class="form-control" placeholder="Ім’я">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="font-weight-bold">Прізвище</label>
                    <input type="text" v-model="form.lastName" class="form-control" placeholder="Прізвище">
                  </div>
                </div>

                <div class="mb-3">
                  <label class="font-weight-bold">Телефон <span class="text-danger">*</span></label>
                  <input type="tel" v-model="form.phone" class="form-control" required placeholder="+380...">
                </div>

                <div class="mb-3">
                  <label class="font-weight-bold">Email</label>
                  <input type="email" v-model="form.email" class="form-control" placeholder="example@mail.com">
                </div>

                <div class="row">
                  <div class="col-md-7 mb-3">
                    <label class="font-weight-bold">Місто</label>
                    <input type="text" v-model="form.city" class="form-control" placeholder="Київ, Львів...">
                  </div>
                  <div class="col-md-5 mb-3">
                    <label class="font-weight-bold">Відділення НП</label>
                    <input type="text" v-model="form.warehouse" class="form-control" placeholder="№1, №15...">
                  </div>
                </div>

                <div class="mb-3">
                  <label class="font-weight-bold">Примітки до замовлення (необов’язково)</label>
                  <textarea v-model="form.notes" class="form-control" rows="4" placeholder="Особливі побажання до доставки або пакування"></textarea>
                </div>

                <button type="submit" id="submit-order-btn" class="d-none"></button>
              </form>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="col-lg-6">
            <div class="order-summary-details bg-white p-4 rounded shadow-sm mt-md-30">
              <h4 class="checkout-title border-bottom pb-2 mb-4">Ваше замовлення</h4>
              <div class="order-summary-content">
                <!-- Order Summary Table -->
                <div class="order-summary-table table-responsive text-center">
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th>Товар</th>
                        <th>Всього</th>
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
                        <td class="font-weight-bold">Товари</td>
                        <td>{{ cartTotal }} ₴</td>
                      </tr>
                      <tr>
                        <td class="font-weight-bold">Доставка</td>
                        <td class="text-success font-weight-bold">Безкоштовно</td>
                      </tr>
                      <tr class="h5">
                        <td class="font-weight-bold">Разом до сплати</td>
                        <td class="text-success font-weight-bold">{{ cartTotal }} ₴</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>


                <!-- Submit Button -->
                <div class="order-btn-wrapper mt-4">
                  <button 
                    type="button" 
                    @click="triggerSubmit" 
                    :disabled="orderSubmitting"
                    class="btn btn-secondary w-100 font-weight-bold" 
                    style="background-color: #00DC82; border: none; padding: 14px;"
                  >
                    {{ orderSubmitting ? 'Оформлення замовлення...' : 'Підтвердити замовлення' }}
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
          <h2 class="text-success">Замовлення успішно оформлено!</h2>
          <p class="text-muted mt-2">
            Дякуємо за покупку в магазині Aivix tech. Наші менеджери зв’яжуться з вами найближчим часом для підтвердження.
          </p>
          <NuxtLink to="/shop" class="btn btn-secondary text-white font-weight-bold mt-4" style="background-color: #00DC82; border: none; padding: 12px 30px;">
            Продовжити покупки
          </NuxtLink>
        </div>

        <!-- Empty Cart Checkout View -->
        <div v-else class="text-center py-5 bg-white p-4 rounded shadow-sm">
          <div class="empty-cart-icon mb-4" style="font-size: 64px; color: #ccc;">
            <i class="ion-bag"></i>
          </div>
          <h3>Кошик порожній</h3>
          <p class="text-muted mt-2">Для оформлення замовлення додайте хоча б один товар у кошик.</p>
          <NuxtLink to="/shop" class="btn btn-secondary text-white font-weight-bold mt-4" style="background-color: #00DC82; border: none; padding: 12px 30px;">
            До каталогу товарів
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
const orderSubmitting = ref(false);

const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

const form = reactive({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  city: '',
  warehouse: '',
  notes: ''
});

const triggerSubmit = () => {
  if (orderSubmitting.value) return;
  const btn = document.getElementById('submit-order-btn');
  if (btn) btn.click();
};

const handlePlaceOrder = async () => {
  console.log('Placing order with data:', form);
  orderSubmitting.value = true;

  try {
    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      email: form.email,
      city: form.city,
      warehouse: form.warehouse,
      notes: form.notes,
      items: cartItems.value.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total: cartTotal.value
    };

    const response = await $fetch<any>(`${apiBase}/orders`, {
      method: 'POST',
      body: payload
    });

    if (response && response.success) {
      // Clear the items
      clearCart();
      // Show success view
      orderPlaced.value = true;
    } else {
      alert(response?.message || 'Не вдалося надіслати замовлення. Спробуйте пізніше.');
    }
  } catch (error: any) {
    console.error(error);
    const msg = error.data?.message || 'Помилка при оформленні замовлення.';
    alert(Array.isArray(msg) ? msg.join(', ') : msg);
  } finally {
    orderSubmitting.value = false;
  }
};
</script>

<style scoped>
.order-summary-table table thead tr th,
.order-summary-table table tbody tr td {
  white-space: normal !important;
  vertical-align: middle;
}
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
