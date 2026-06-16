<template>
  <div>
    <!-- breadcrumb area start -->
    <div class="breadcrumb-area">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="breadcrumb-wrap">
              <nav aria-label="breadcrumb">
                <h1>{{ t('checkout') }}</h1>
                <ul class="breadcrumb">
                  <li class="breadcrumb-item"><NuxtLink to="/">{{ t('home') }}</NuxtLink></li>
                  <li class="breadcrumb-item"><NuxtLink to="/cart">{{ t('cart') }}</NuxtLink></li>
                  <li class="breadcrumb-item active" aria-current="page">{{ t('checkout') }}</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- breadcrumb area end -->

    <!-- checkout main wrapper start -->
    <div class="checkout-page-wrapper pt-50 pb-50">
      <div class="container">
        <div v-if="cartItems.length > 0" class="row">
          <!-- Billing Details -->
          <div class="col-lg-6">
            <div class="checkout-billing-details-wrap bg-white p-4 rounded shadow-sm">
              <h4 class="checkout-title border-bottom pb-2 mb-4">{{ t('checkoutTitle') }}</h4>
              <form @submit.prevent="handlePlaceOrder">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="font-weight-bold">{{ t('firstName') }}</label>
                    <input type="text" v-model="form.firstName" class="form-control" :placeholder="t('firstName')">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="font-weight-bold">{{ t('lastName') }}</label>
                    <input type="text" v-model="form.lastName" class="form-control" :placeholder="t('lastName')">
                  </div>
                </div>

                <div class="mb-3">
                  <label class="font-weight-bold">{{ t('phone') }} <span class="text-danger">*</span></label>
                  <input type="tel" v-model="form.phone" class="form-control" :class="{ 'is-invalid': errors.phone }" required placeholder="+380..." @blur="validatePhoneField" @input="onPhoneInput">
                  <div v-if="errors.phone" class="text-danger mt-1" style="font-size: 13px;">{{ errors.phone }}</div>
                </div>

                <div class="mb-3">
                  <label class="font-weight-bold">{{ t('email') }}</label>
                  <input type="email" v-model="form.email" class="form-control" :class="{ 'is-invalid': errors.email }" placeholder="example@mail.com" @blur="validateEmailField" @input="onEmailInput">
                  <div v-if="errors.email" class="text-danger mt-1" style="font-size: 13px;">{{ errors.email }}</div>
                </div>

                <div class="row">
                  <div class="col-md-7 mb-3">
                    <label class="font-weight-bold">{{ t('city') }}</label>
                    <input type="text" v-model="form.city" class="form-control" :placeholder="locale === 'uk' ? 'Київ, Львів...' : 'Kyiv, Lviv...'">
                  </div>
                  <div class="col-md-5 mb-3">
                    <label class="font-weight-bold">{{ t('warehouse') }}</label>
                    <input type="text" v-model="form.warehouse" class="form-control" :placeholder="locale === 'uk' ? '№1, №15...' : 'No. 1, No. 15...'">
                  </div>
                </div>

                <div class="mb-3">
                  <label class="font-weight-bold">{{ t('notes') }}</label>
                  <textarea v-model="form.notes" class="form-control" rows="4" :placeholder="t('notesPlaceholder')"></textarea>
                </div>

                <button type="submit" id="submit-order-btn" class="d-none"></button>
              </form>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="col-lg-6">
            <div class="order-summary-details bg-white p-4 rounded shadow-sm mt-md-30">
              <h4 class="checkout-title border-bottom pb-2 mb-4">{{ t('yourOrder') }}</h4>
              <div class="order-summary-content">
                <!-- Order Summary Table -->
                <div class="order-summary-table table-responsive text-center">
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th>{{ t('product') }}</th>
                        <th>{{ t('total') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in cartItems" :key="item.id">
                        <td>
                          <NuxtLink :to="`/product/${item.id}`" class="text-dark font-weight-bold">{{ locale === 'uk' ? (item.name_uk || item.name) : (item.name_en || item.name_uk || item.name) }}</NuxtLink>
                          <strong> × {{ item.quantity }}</strong>
                        </td>
                        <td>{{ item.price * item.quantity }} {{ t('currency') }}</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td class="font-weight-bold">{{ locale === 'uk' ? 'Товари' : 'Subtotal' }}</td>
                        <td>{{ cartTotal }} {{ t('currency') }}</td>
                      </tr>
                      <tr>
                        <td class="font-weight-bold">{{ t('shipping') }}</td>
                        <td class="text-success font-weight-bold">{{ t('freeShipping') }}</td>
                      </tr>
                      <tr class="h5">
                        <td class="font-weight-bold">{{ locale === 'uk' ? 'Разом до сплати' : 'Total Payment' }}</td>
                        <td class="text-success font-weight-bold">{{ cartTotal }} {{ t('currency') }}</td>
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
                    class="btn btn__bg w-100 font-weight-bold" 
                    style="padding: 14px;"
                  >
                    {{ orderSubmitting ? t('placingOrder') : t('confirmOrder') }}
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
          <h2 class="text-success">{{ t('orderSuccess') }}</h2>
          <p class="text-muted mt-2">
            {{ t('orderSuccessText') }}
          </p>
          <NuxtLink to="/shop" class="btn btn__bg mt-4" style="padding: 12px 30px;">
            {{ t('continueShopping') }}
          </NuxtLink>
        </div>

        <!-- Empty Cart Checkout View -->
        <div v-else class="text-center py-5 bg-white p-4 rounded shadow-sm">
          <div class="empty-cart-icon mb-4" style="font-size: 64px; color: #ccc;">
            <i class="ion-bag"></i>
          </div>
          <h3>{{ t('cartEmpty') }}</h3>
          <p class="text-muted mt-2">{{ t('cartEmptyDesc') }}</p>
          <NuxtLink to="/shop" class="btn btn__bg mt-4" style="padding: 12px 30px;">
            {{ t('toCatalog') }}
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
import { useLocale } from '~/composables/useLocale';

definePageMeta({
  layout: 'default'
});

const { locale, t } = useLocale();
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

const errors = reactive({
  phone: '',
  email: ''
});

const validatePhoneField = () => {
  errors.phone = '';
  const cleanPhone = form.phone.replace(/[\s()\-]/g, '');
  const isPhoneValid = /^\+?\d{9,15}$/.test(cleanPhone);
  if (!isPhoneValid && form.phone) {
    errors.phone = locale.value === 'uk'
      ? 'Некоректний формат телефону. Телефон повинен бути у міжнародному форматі (наприклад, +380XXXXXXXXX)'
      : 'Invalid phone format. Phone must be in international format (e.g. +380XXXXXXXXX)';
  } else if (!form.phone) {
    errors.phone = locale.value === 'uk'
      ? 'Телефон є обов’язковим полем'
      : 'Phone is a required field';
  }
};

const validateEmailField = () => {
  errors.email = '';
  if (form.email) {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!isEmailValid) {
      errors.email = locale.value === 'uk'
        ? 'Некоректний формат email'
        : 'Invalid email format';
    }
  }
};

const onPhoneInput = () => {
  if (errors.phone) {
    const cleanPhone = form.phone.replace(/[\s()\-]/g, '');
    if (/^\+?\d{9,15}$/.test(cleanPhone)) {
      errors.phone = '';
    }
  }
};

const onEmailInput = () => {
  if (errors.email) {
    if (!form.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = '';
    }
  }
};

const triggerSubmit = () => {
  if (orderSubmitting.value) return;
  const btn = document.getElementById('submit-order-btn');
  if (btn) btn.click();
};

const handlePlaceOrder = async () => {
  validatePhoneField();
  validateEmailField();

  const cleanPhone = form.phone.replace(/[\s()\-]/g, '');
  const isPhoneValid = /^\+?\d{9,15}$/.test(cleanPhone);
  if (!isPhoneValid) {
    errors.phone = locale.value === 'uk'
      ? 'Некоректний формат телефону. Телефон повинен бути у міжнародному форматі (наприклад, +380XXXXXXXXX)'
      : 'Invalid phone format. Phone must be in international format (e.g. +380XXXXXXXXX)';
  }

  if (form.email) {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!isEmailValid) {
      errors.email = locale.value === 'uk'
        ? 'Некоректний формат email'
        : 'Invalid email format';
    }
  }

  if (errors.phone || errors.email) {
    return;
  }

  console.log('Placing order with data:', form);
  orderSubmitting.value = true;

  try {
    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      phone: cleanPhone,
      email: form.email || undefined,
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
      alert(response?.message || (locale.value === 'uk' ? 'Не вдалося надіслати замовлення. Спробуйте пізніше.' : 'Failed to place the order. Please try again later.'));
    }
  } catch (error: any) {
    console.error(error);
    const msg = error.data?.message || (locale.value === 'uk' ? 'Помилка при оформленні замовлення.' : 'Error placing the order.');
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
