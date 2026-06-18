<template>
  <footer class="footer-wrapper bg-dark">
    <!-- footer top area start -->
    <div class="footer-top">
      <div class="container">
        <div class="footer-features-inner">
          <div class="row">
            <div class="col-lg-6 col-md-6">
              <div class="single-features-item footer-feature-item">
                <div class="features-icon">
                  <i class="ion-ios-telephone"></i>
                </div>
                <div class="features-content" style="line-height: 1.2;">
                  <h5 style="margin-bottom: 2px;"><a href="tel:+380930938313" style="color: inherit;">+38 (093) 093 83 13</a></h5>
                  <h5><a href="tel:+380680938313" style="color: inherit;">+38 (068) 093 83 13</a></h5>
                  <p>{{ t('footerFreeSupport') }}</p>
                </div>
              </div>
            </div>

            <div class="col-lg-6 col-md-6">
              <div class="single-features-item footer-feature-item align-items-start">
                <div class="features-icon">
                  <i class="ion-help-buoy"></i>
                </div>
                <div class="features-content" style="line-height: 1.4;">
                  <div class="d-flex flex-column" style="gap: 5px;">
                    <div>
                      <h5 style="margin-bottom: 0;"><a href="mailto:sales@aivixtech.com" style="color: inherit;">sales@aivixtech.com</a></h5>
                      <span style="font-size: 12px; opacity: 0.8; color: #a0a0a0;">{{ t('emailSales') }}</span>
                    </div>
                    <div>
                      <h5 style="margin-bottom: 0;"><a href="mailto:support@aivixtech.com" style="color: inherit;">support@aivixtech.com</a></h5>
                      <span style="font-size: 12px; opacity: 0.8; color: #a0a0a0;">{{ t('emailSupport') }}</span>
                    </div>
                    <div>
                      <h5 style="margin-bottom: 0;"><a href="mailto:service@aivixtech.com" style="color: inherit;">service@aivixtech.com</a></h5>
                      <span style="font-size: 12px; opacity: 0.8; color: #a0a0a0;">{{ t('emailService') }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- footer top area end -->

    <!-- footer widget area start -->
    <div class="footer-widget-area">
      <div class="container">
        <div class="footer-widget-inner">
          <div class="row">
            <!-- footer widget item start (Company & Contacts) -->
            <div class="col-lg-5 col-md-6 col-sm-12">
              <div class="footer-widget-item">
                <div class="footer-widget-logo">
                  <NuxtLink to="/">
                    <img src="/assets/img/logo/logo.svg" alt="Aivix tech Logo">
                  </NuxtLink>
                </div>
                <div class="footer-widget-body">
                  <p>{{ t('footerCompanyDesc') }}</p>
                  <h6 class="contact-info-title">{{ t('footerContacts') }}</h6>
                  <p>{{ t('footerAddress') }}</p>
                  <div style="padding-top: 10px;"></div>
                </div>
              </div>
            </div>
            <!-- footer widget item end -->

            <!-- footer widget item start (Information) -->
            <div class="col-lg-3 col-md-3 col-sm-6">
              <div class="footer-widget-item">
                <div class="footer-widget-title">
                  <h5>{{ t('footerInfoTitle') }}</h5>
                </div>
                <ul class="footer-widget-body">
                  <li><NuxtLink to="/shop">{{ t('footerCatalog') }}</NuxtLink></li>
                  <li><NuxtLink to="/shop">{{ t('footerNewArrivals') }}</NuxtLink></li>
                  <li><NuxtLink to="/about">{{ t('about') }}</NuxtLink></li>
                  <li><NuxtLink to="/payment-delivery">{{ t('paymentDelivery') }}</NuxtLink></li>
                  <li><NuxtLink to="/shop?is_deal=true">{{ locale === 'uk' ? 'Акції' : 'Promotions' }}</NuxtLink></li>
                </ul>
              </div>
            </div>
            <!-- footer widget item end -->

            <!-- footer widget item start (Quick Links) -->
            <div class="col-lg-4 col-md-3 col-sm-6">
              <div class="footer-widget-item">
                <div class="footer-widget-title">
                  <h5>{{ t('quickLinks') }}</h5>
                </div>
                <ul class="footer-widget-body">
                  <li><NuxtLink to="/cart">{{ t('myCart') }}</NuxtLink></li>
                  <li>
                    <a href="https://t.me/+380930938313" target="_blank">
                      Telegram Support
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <!-- footer widget item end -->
          </div>
        </div>
      </div>
    </div>
    <!-- footer widget area end -->

    <!-- footer bottom area start -->
    <div class="footer-bottom-area">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6 col-12">
            <div class="copyright-text text-center text-md-left">
              <p style="margin-bottom: 0;">&copy; 2026 <b>Aivix tech</b>. {{ t('footerCopyright') }} {{ t('developedWith') }} <i class="fa fa-heart text-danger"></i> {{ t('footerDeveloped') }}</p>
            </div>
          </div>
          <div class="col-md-6 col-12 mt-3 mt-md-0">
            <div class="payment-method text-center text-md-right">
              <img src="/assets/img/payment.png" alt="Payment Methods" style="max-height: 28px; width: auto; display: inline-block;">
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- footer bottom area end -->

    <!-- Scroll to top button -->
    <div class="scroll-top" :class="{ 'not-visible': !showScrollBtn }" @click="scrollToTop">
      <i class="fa fa-angle-up"></i>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useLocale } from '~/composables/useLocale';

const { locale, t } = useLocale();

const showScrollBtn = ref(false);

const checkScroll = () => {
  showScrollBtn.value = window.scrollY > 400;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  window.addEventListener('scroll', checkScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll);
});
</script>

<style scoped>
/* Scoped overrides if needed */
.scroll-top {
  position: fixed;
  bottom: 60px;
  right: 30px;
  z-index: 999;
  cursor: pointer;
  transition: all 0.3s ease;
}
.scroll-top.not-visible {
  opacity: 0;
  visibility: hidden;
}
</style>
