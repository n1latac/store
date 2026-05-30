<template>
  <footer class="footer-wrapper bg-dark">
    <!-- footer top area start -->
    <div class="footer-top">
      <div class="container">
        <div class="footer-features-inner">
          <div class="row">
            <div class="col-lg-4 col-md-4">
              <div class="single-features-item footer-feature-item">
                <div class="features-icon">
                  <i class="ion-ios-telephone"></i>
                </div>
                <div class="features-content">
                  <h5>+38 (044) 123-45-67</h5>
                  <p>Бесплатная поддержка!</p>
                </div>
              </div>
            </div>

            <div class="col-lg-4 col-md-4">
              <div class="single-features-item footer-feature-item">
                <div class="features-icon">
                  <i class="ion-help-buoy"></i>
                </div>
                <div class="features-content">
                  <h5>support@oregonstore.com</h5>
                  <p>Поддержка заказов!</p>
                </div>
              </div>
            </div>

            <div class="col-lg-4 col-md-4">
              <div class="single-features-item footer-feature-item">
                <div class="features-icon">
                  <i class="ion-clock"></i>
                </div>
                <div class="features-content">
                  <h5>Пн - Пт / 9:00 - 18:00</h5>
                  <p>Рабочие дни/часы!</p>
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
            <!-- footer widget item start -->
            <div class="col-lg-3 col-md-6 col-sm-6">
              <div class="footer-widget-item">
                <div class="footer-widget-logo">
                  <NuxtLink to="/">
                    <img src="/assets/img/logo/logo.png" alt="Oregon Logo">
                  </NuxtLink>
                </div>
                <div class="footer-widget-body">
                  <p>Мы — команда профессионалов, предлагающая вам лучшую компьютерную и офисную технику с быстрой доставкой.</p>
                  <h6 class="contact-info-title">Контакты:</h6>
                  <p>Украина, г. Киев, ул. Крещатик, 1</p>
                  <div class="footer-social-link">
                    <a href="#"><i class="fa fa-facebook"></i></a>
                    <a href="#"><i class="fa fa-google-plus"></i></a>
                    <a href="#"><i class="fa fa-twitter"></i></a>
                    <a href="#"><i class="fa fa-youtube"></i></a>
                    <a href="#"><i class="fa fa-rss"></i></a>
                  </div>
                </div>
              </div>
            </div>
            <!-- footer widget item end -->

            <!-- footer widget item start -->
            <div class="col-lg-3 col-md-6 col-sm-6">
              <div class="footer-widget-item">
                <div class="footer-widget-title">
                  <h5>Информация</h5>
                </div>
                <ul class="footer-widget-body">
                  <li><NuxtLink to="/shop">Каталог товаров</NuxtLink></li>
                  <li><NuxtLink to="/shop">Новинки</NuxtLink></li>
                  <li><a href="#">Акции</a></li>
                  <li><a href="#">О нас</a></li>
                  <li><a href="#">Контакты</a></li>
                </ul>
              </div>
            </div>
            <!-- footer widget item end -->

            <!-- footer widget item start -->
            <div class="col-lg-3 col-md-6 col-sm-6">
              <div class="footer-widget-item">
                <div class="footer-widget-title">
                  <h5>Мой Аккаунт</h5>
                </div>
                <ul class="footer-widget-body">
                  <li><NuxtLink to="/admin/categories">Админ-панель</NuxtLink></li>
                  <li><NuxtLink to="/cart">Моя Корзина</NuxtLink></li>
                  <li><a href="#">История заказов</a></li>
                  <li><a href="#">Мои адреса</a></li>
                </ul>
              </div>
            </div>
            <!-- footer widget item end -->

            <!-- footer widget item start -->
            <div class="col-lg-3 col-md-6 col-sm-6">
              <div class="footer-widget-item">
                <div class="footer-widget-title">
                  <h5>Поддержка</h5>
                </div>
                <ul class="footer-widget-body">
                  <li><a href="#">Карта сайта</a></li>
                  <li><a href="#">Возврат товара</a></li>
                  <li><a href="#">Политика конфиденциальности</a></li>
                  <li><a href="#">Условия обслуживания</a></li>
                </ul>
              </div>
            </div>
            <!-- footer widget item end -->
          </div>
        </div>
      </div>
    </div>
    <!-- footer widget area end -->

    <!-- newsletter area start -->
    <div class="newsletter-area">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-xl-4 col-lg-4 col-md-5">
            <div class="newsletter-title">
              <div class="newsletter-icon">
                <i class="ion-ios-email"></i>
              </div>
              <h3>Подпишитесь на новости</h3>
            </div>
          </div>
          <div class="col-xl-5 col-lg-5 col-md-7">
            <div class="newsletter-inner">
              <form @submit.prevent="handleSubscribe">
                <input type="email" v-model="email" class="news-field" required placeholder="Введите ваш email адрес">
                <button type="submit" class="news-btn">Подписаться</button>
              </form>
            </div>
          </div>
          <div class="col-xl-3 col-lg-3 col-md-12">
            <div class="payment-method">
              <img src="/assets/img/payment.png" alt="Payment Methods">
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- newsletter area end -->

    <!-- footer bottom area start -->
    <div class="footer-bottom-area">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="copyright-text text-center">
              <p>&copy; 2026 <b>Oregon</b>. Все права защищены. Разработано с <i class="fa fa-heart text-danger"></i> для демонстрации.</p>
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

const email = ref('');
const showScrollBtn = ref(false);

const handleSubscribe = () => {
  if (email.value) {
    alert(`Спасибо за подписку, ${email.value}!`);
    email.value = '';
  }
};

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
