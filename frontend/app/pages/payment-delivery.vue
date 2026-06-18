<template>
  <div>
    <!-- breadcrumb area start -->
    <div class="breadcrumb-area">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="breadcrumb-wrap">
              <nav aria-label="breadcrumb">
                <h1>{{ t('paymentDelivery') }}</h1>
                <ul class="breadcrumb">
                  <li class="breadcrumb-item"><NuxtLink to="/">{{ t('home') }}</NuxtLink></li>
                  <li class="breadcrumb-item active" aria-current="page">{{ t('paymentDelivery') }}</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- breadcrumb area end -->

    <!-- payment & delivery content wrapper start -->
    <div class="payment-delivery-wrapper pt-50 pb-50">
      <div class="container">
        <!-- Main Intro Card -->
        <div class="row mb-5">
          <div class="col-lg-12">
            <div class="section-bg-color bg-white p-5 rounded shadow-sm text-center main-intro-card">
              <span class="badge badge-info-theme mb-3">AIVIXTECH SERVICE</span>
              <h2 class="mb-4 font-weight-bold color-dark">
                {{ locale === 'uk' 
                  ? 'Зручні умови оплати та надійна доставка обладнання по всій Україні' 
                  : 'Convenient payment terms and reliable equipment delivery throughout Ukraine' }}
              </h2>
              <p class="lead-text text-muted mx-auto" style="max-width: 900px; font-size: 17px; line-height: 1.6;">
                {{ locale === 'uk'
                  ? 'Ми робимо все можливе, щоб процес придбання ІТ-рішень та обладнання був максимально простим, прозорим та швидким. Перед кожним відправленням техніка проходить ретельне тестування та надійне пакування.'
                  : 'We do our best to make the purchasing process of IT solutions and equipment as simple, transparent, and fast as possible. Before each shipment, all hardware undergoes thorough testing and secure packaging.' }}
              </p>
            </div>
          </div>
        </div>

        <div class="row">
          <!-- Delivery Column -->
          <div class="col-lg-6 mb-4">
            <div class="info-card bg-white p-4 rounded shadow-sm h-100 border-top-delivery">
              <div class="icon-wrap mb-4 delivery-icon">
                <i class="ion-plane"></i>
              </div>
              <h3 class="font-weight-bold mb-4">
                {{ locale === 'uk' ? 'Способи доставки' : 'Delivery Methods' }}
              </h3>
              
              <div class="method-item mb-3 pb-3 border-bottom">
                <h5 class="font-weight-bold mb-2">
                  {{ locale === 'uk' ? '1. Кур\'єрська доставка по Києву' : '1. Courier delivery in Kyiv' }}
                </h5>
                <p class="text-muted">
                  {{ locale === 'uk'
                    ? 'Швидка доставка до дверей вашого офісу або будинку. Доставка здійснюється з понеділка по п\'ятницю. Безкоштовно для замовлень на суму від 10 000 грн.'
                    : 'Fast delivery directly to the doors of your office or home. Deliveries are made Monday through Friday. Free for orders over 10,000 UAH.' }}
                </p>
              </div>

              <div class="method-item mb-3 pb-3 border-bottom">
                <h5 class="font-weight-bold mb-2">
                  {{ locale === 'uk' ? '2. Нова Пошта (по всій Україні)' : '2. Nova Poshta (across Ukraine)' }}
                </h5>
                <p class="text-muted">
                  {{ locale === 'uk'
                    ? 'Відправка у будь-яке працююче відділення або поштомат за тарифами перевізника. Також доступна адресна доставка кур\'єром Нової Пошти за вашою адресою.'
                    : 'Shipment to any operating branch or parcel locker at the carrier\'s rates. Address delivery by Nova Poshta courier is also available.' }}
                </p>
              </div>

              <div class="method-item">
                <h5 class="font-weight-bold mb-2">
                  {{ locale === 'uk' ? '3. Самовивіз в Києві' : '3. Self-pickup in Kyiv' }}
                </h5>
                <p class="text-muted">
                  {{ locale === 'uk'
                    ? 'Ви можете забрати замовлений товар безпосередньо з нашого офісу за попереднім погодженням з менеджером.'
                    : 'You can pick up your ordered products directly from our office by prior agreement with the manager.' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Payment Column -->
          <div class="col-lg-6 mb-4">
            <div class="info-card bg-white p-4 rounded shadow-sm h-100 border-top-payment">
              <div class="icon-wrap mb-4 payment-icon">
                <i class="ion-card"></i>
              </div>
              <h3 class="font-weight-bold mb-4">
                {{ locale === 'uk' ? 'Варіанти оплати' : 'Payment Options' }}
              </h3>

              <div class="method-item mb-3 pb-3 border-bottom">
                <h5 class="font-weight-bold mb-2">
                  {{ locale === 'uk' ? '1. Безготівковий розрахунок' : '1. Bank Transfer' }}
                </h5>
                <p class="text-muted">
                  {{ locale === 'uk'
                    ? 'Оплата за безготівковим розрахунком на розрахунковий рахунок нашої компанії (ТОВ або ФОП). Ми працюємо як з ПДВ, так і без ПДВ. Надаємо всі супровідні документи.'
                    : 'Non-cash payment to our company bank account (LLC or Sole Proprietorship). We work both with VAT and without VAT. All supporting documents are provided.' }}
                </p>
              </div>

              <div class="method-item mb-3 pb-3 border-bottom">
                <h5 class="font-weight-bold mb-2">
                  {{ locale === 'uk' ? '2. Накладений платіж (післяплата)' : '2. Cash on Delivery (COD)' }}
                </h5>
                <p class="text-muted">
                  {{ locale === 'uk'
                    ? 'Оплата готівкою або карткою при отриманні товару у відділенні Нової Пошти. Зверніть увагу: перевізник стягує додаткову комісію за переказ коштів (2% від суми + 20 грн).'
                    : 'Payment in cash or by card upon receipt at Nova Poshta branches. Note: the carrier charges an additional commission for money transfer (2% of the sum + 20 UAH).' }}
                </p>
              </div>

              <div class="method-item">
                <h5 class="font-weight-bold mb-2">
                  {{ locale === 'uk' ? '3. Онлайн-оплата карткою' : '3. Online Card Payment' }}
                </h5>
                <p class="text-muted">
                  {{ locale === 'uk'
                    ? 'Швидка та безпечна оплата банківськими картами Visa/Mastercard безпосередньо при оформленні замовлення.'
                    : 'Fast and secure payment with Visa/Mastercard bank cards directly during the checkout process.' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Testing & Terms Alert Card -->
        <div class="row mt-4">
          <div class="col-12">
            <div class="terms-highlight-card p-5 rounded text-white shadow">
              <div class="row align-items-center">
                <div class="col-lg-2 text-center mb-4 mb-lg-0">
                  <div class="shield-icon-big">
                    <i class="ion-android-checkmark-circle"></i>
                  </div>
                </div>
                <div class="col-lg-10">
                  <h4 class="font-weight-bold text-white mb-3">
                    {{ locale === 'uk' ? 'Гарантія якості та терміни виконання' : 'Quality Assurance and Processing Terms' }}
                  </h4>
                  <p style="font-size: 16px; line-height: 1.7; opacity: 0.95; margin-bottom: 0;">
                    {{ locale === 'uk'
                      ? 'Відправка здійснюється протягом 1-3 робочих днів після підтвердження замовлення (або отримання оплати у випадку безготівкового розрахунку). Усе обладнання проходить обов\'язкове передпродажне тестування спеціалістами нашого сервісного центру, що мінімізує ризик виникнення будь-яких технічних несправностей. Разом із товаром ви отримуєте офіційний гарантійний талон.'
                      : 'Shipments are dispatched within 1-3 business days after order confirmation (or receipt of payment for bank transfers). All equipment undergoes mandatory pre-sale testing by our service center experts, minimizing the risk of any technical malfunctions. An official warranty certificate is provided with every purchase.' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Support contacts block -->
        <div class="row mt-5">
          <div class="col-12 text-center">
            <h4 class="font-weight-bold" style="color: #17a2b8;">
              {{ locale === 'uk'
                ? 'Виникли запитання щодо оплати чи доставки? Зв\'яжіться з нашою підтримкою:'
                : 'Have questions regarding payment or delivery? Contact our support:' }}
            </h4>
            <div class="d-flex flex-wrap justify-content-center mt-3" style="gap: 20px; font-size: 16px;">
              <strong><a href="tel:+380930938313" style="color: #333;"><i class="fa fa-phone"></i> +38 (093) 093 83 13</a></strong>
              <strong><a href="mailto:support@aivixtech.com" style="color: #333;"><i class="fa fa-envelope"></i> support@aivixtech.com</a></strong>
            </div>
          </div>
        </div>

      </div>
    </div>
    <!-- payment & delivery content wrapper end -->
  </div>
</template>

<script setup lang="ts">
import { useLocale } from '~/composables/useLocale';

const { locale, t } = useLocale();

useHead({
  title: locale.value === 'uk' ? 'Оплата та доставка - Aivixtech' : 'Payment & Delivery - Aivixtech',
  meta: [
    {
      name: 'description',
      content: locale.value === 'uk'
        ? 'Умови оплати та доставки продукції в інтернет-магазині Aivixtech. Безготівковий розрахунок, післяплата, доставка кур\'єром по Києву та Новою Поштою по Україні.'
        : 'Payment and delivery terms in Aivixtech online store. Bank transfer, COD, courier delivery in Kyiv and Nova Poshta across Ukraine.'
    }
  ]
});
</script>

<style scoped>
.payment-delivery-wrapper {
  background-color: #f8f9fa;
  font-family: 'Outfit', 'Inter', 'Segoe UI', sans-serif;
}

.badge-info-theme {
  background-color: #e3f2fd;
  color: #0d47a1;
  font-size: 14px;
  padding: 6px 16px;
  border-radius: 50px;
  letter-spacing: 1.5px;
  font-weight: 700;
}

.color-dark {
  color: #2b2b2b;
}

.main-intro-card {
  border: none;
  transition: transform 0.3s ease;
}

.border-top-delivery {
  border-top: 4px solid #17a2b8;
}

.border-top-payment {
  border-top: 4px solid #106f85;
}

.info-card {
  border: none;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08) !important;
}

.icon-wrap {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  transition: all 0.3s ease;
}

.delivery-icon {
  background-color: #eaf6f8;
  color: #17a2b8;
}

.payment-icon {
  background-color: #e7f0f2;
  color: #106f85;
}

.info-card:hover .delivery-icon {
  background-color: #17a2b8;
  color: #fff;
}

.info-card:hover .payment-icon {
  background-color: #106f85;
  color: #fff;
}

.terms-highlight-card {
  background: linear-gradient(135deg, #102a43 0%, #17a2b8 100%);
  border: none;
}

.shield-icon-big {
  font-size: 60px;
  color: #00E5FF;
  text-shadow: 0 0 15px rgba(0, 229, 255, 0.4);
}
</style>
