<template>
  <div>
    <!-- breadcrumb area start -->
    <div class="breadcrumb-area">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="breadcrumb-wrap">
              <nav aria-label="breadcrumb">
                <h1>{{ t('about') }}</h1>
                <ul class="breadcrumb">
                  <li class="breadcrumb-item"><NuxtLink to="/">{{ t('home') }}</NuxtLink></li>
                  <li class="breadcrumb-item active" aria-current="page">{{ t('about') }}</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- breadcrumb area end -->

    <!-- about us content wrapper start -->
    <div class="about-us-wrapper pt-50 pb-50">
      <div class="container">
        <!-- Main Intro Card -->
        <div class="row mb-5">
          <div class="col-lg-12">
            <div class="section-bg-color bg-white p-5 rounded shadow-sm main-intro-card text-center">
              <span class="badge badge-info-theme mb-3">AIVIXTECH</span>
              <h2 class="mb-4 font-weight-bold color-dark">
                {{ locale === 'uk' 
                  ? 'Ваш надійний технологічний партнер у сфері системної інтеграції та модернізації' 
                  : 'Your reliable technological partner in system integration and modernization' }}
              </h2>
              <p class="lead-text text-muted mx-auto" style="max-width: 900px; font-size: 18px; line-height: 1.6;">
                {{ locale === 'uk'
                  ? 'Aivixtech — команда професіоналів, яка розробляє та впроваджує готові інноваційні рішення, що допомагають адаптувати український бізнес, інфраструктуру та державний сектор до викликів сучасності.'
                  : 'Aivixtech is a team of professionals developing and implementing ready-to-use innovative solutions that help adapt Ukrainian business, infrastructure, and the public sector to modern challenges.' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Focus Areas Title -->
        <div class="row mb-4">
          <div class="col-12 text-center">
            <h3 class="font-weight-bold color-dark">
              {{ locale === 'uk' ? 'Комплексний підхід до цифрової трансформації' : 'Comprehensive Approach to Digital Transformation' }}
            </h3>
            <p class="text-muted">
              {{ locale === 'uk' ? 'Ми пропонуємо індивідуальні рішення для ключових сфер:' : 'We offer customized solutions for key sectors:' }}
            </p>
          </div>
        </div>

        <!-- Focus Areas Grid -->
        <div class="row mb-5">
          <!-- Area 1: Production & Business -->
          <div class="col-lg-4 col-md-6 mb-4">
            <div class="focus-card bg-white p-4 rounded shadow-sm h-100 border-top-theme">
              <div class="focus-icon-wrap mb-4">
                <i class="ion-ios-gear-outline"></i>
              </div>
              <h4 class="font-weight-bold mb-3">
                {{ locale === 'uk' ? 'Виробництво та бізнес' : 'Production & Business' }}
              </h4>
              <p class="text-muted">
                {{ locale === 'uk'
                  ? 'Оптимізація робочих процесів, автоматизація та розгортання потужних локальних мереж для безперебійного функціонування підприємства.'
                  : 'Workflow optimization, automation, and deployment of high-performance local area networks for seamless enterprise operation.' }}
              </p>
            </div>
          </div>

          <!-- Area 2: Education & Medicine -->
          <div class="col-lg-4 col-md-6 mb-4">
            <div class="focus-card bg-white p-4 rounded shadow-sm h-100 border-top-theme">
              <div class="focus-icon-wrap mb-4">
                <i class="ion-ios-book-outline"></i>
              </div>
              <h4 class="font-weight-bold mb-3">
                {{ locale === 'uk' ? 'Освіта та медицина' : 'Education & Medicine' }}
              </h4>
              <p class="text-muted">
                {{ locale === 'uk'
                  ? 'Створення сучасних цифрових класів, інтерактивних просторів та надійної, швидкодіючої ІТ-інфраструктури для медичних закладів.'
                  : 'Creation of modern digital classrooms, interactive learning environments, and reliable, high-performance IT infrastructure for healthcare institutions.' }}
              </p>
            </div>
          </div>

          <!-- Area 3: Public Sector -->
          <div class="col-lg-4 col-md-12 mb-4">
            <div class="focus-card bg-white p-4 rounded shadow-sm h-100 border-top-theme">
              <div class="focus-icon-wrap mb-4">
                <i class="ion-ios-locked-outline"></i>
              </div>
              <h4 class="font-weight-bold mb-3">
                {{ locale === 'uk' ? 'Адміністрації та держсектор' : 'Administrations & Public Sector' }}
              </h4>
              <p class="text-muted">
                {{ locale === 'uk'
                  ? 'Безпечні, швидкодіючі та відмовостійкі рішення для ефективного керування, збереження даних та захисту конфіденційної інформації.'
                  : 'Secure, high-speed, and fault-tolerant solutions for efficient administration management, data preservation, and privacy protection.' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Reliability & Energy Efficiency Highlight Card (Glassmorphism-styled gradient overlay) -->
        <div class="row mb-5">
          <div class="col-12">
            <div class="energy-highlight-card p-5 rounded text-white shadow">
              <div class="row align-items-center">
                <div class="col-lg-2 text-center mb-4 mb-lg-0">
                  <div class="energy-icon-big">
                    <i class="ion-flash"></i>
                  </div>
                </div>
                <div class="col-lg-10">
                  <h3 class="font-weight-bold text-white mb-3">
                    {{ locale === 'uk' ? 'Надійність та енергоефективність у часи викликів' : 'Reliability & Energy Efficiency in Challenging Times' }}
                  </h3>
                  <p class="energy-desc" style="font-size: 16px; line-height: 1.7; opacity: 0.95;">
                    {{ locale === 'uk'
                      ? 'Сьогодні, в період повномасштабної війни, перед кожним підприємством та установою в Україні стоїть критичне завдання — забезпечити безперебійну роботу в умовах нестабільного енергопостачання. Обираючи обладнання від Aivixtech, ви інвестуєте у надвисоку енергоефективність. Наші рішення споживають мінімум енергії, що дозволяє значно довше працювати від систем резервного живлення (EcoFlow, інверторів, генераторів), гарантуючи живучість вашої інфраструктури за будь-яких обставин.'
                      : 'Today, during the full-scale war, every enterprise and institution in Ukraine faces a critical challenge — to ensure uninterrupted operations under unstable power supplies. By choosing equipment from Aivixtech, you invest in ultra-high energy efficiency. Our solutions consume minimal power, enabling them to run significantly longer on backup systems (EcoFlow, inverters, generators), guaranteeing the survival of your infrastructure under any circumstances.' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- MINISFORUM Partnership Block -->
        <div class="row">
          <div class="col-12">
            <div class="partnership-card bg-white p-5 rounded shadow-sm border">
              <div class="row align-items-center">
                <div class="col-md-9 mb-4 mb-md-0">
                  <span class="badge badge-warning-theme mb-3">MINISFORUM PARTNER</span>
                  <h3 class="font-weight-bold color-dark mb-3">
                    {{ locale === 'uk' ? 'Офіційне партнерство з лідерами індустрії' : 'Official Partnership with Industry Leaders' }}
                  </h3>
                  <p class="text-muted mb-0" style="font-size: 16px; line-height: 1.7;">
                    {{ locale === 'uk'
                      ? 'Ми прагнемо надавати нашим клієнтам лише найкращі світові технології. Компанія Aivixtech є офіційним партнером MINISFORUM — світового лідера у виробництві передових, інноваційних, компактних та потужних міні-ПК. Завдяки цій співпраці ми постачаємо обладнання, яке поєднує в собі колосальну продуктивність, мінімальні габарити та рекордно низьке енергоспоживання, що є ідеальним вибором для сучасного українського ринку.'
                      : 'We strive to provide our clients with only the best global technologies. Aivixtech is an official partner of MINISFORUM — a global leader in advanced, innovative, compact, and powerful mini-PCs. Through this partnership, we supply equipment that combines high performance, minimal dimensions, and record-low energy consumption, making it the perfect choice for the modern Ukrainian market.' }}
                  </p>
                </div>
                <div class="col-md-3 text-center">
                  <div class="partnership-logo-wrap p-3 rounded bg-light border d-inline-flex flex-column align-items-center">
                    <span class="logo-text font-weight-bold" style="letter-spacing: 2px; font-size: 18px; color: #111;">MINISFORUM</span>
                    <span class="badge badge-dark mt-2" style="font-size: 10px; color: gray">OFFICIAL PARTNER</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Motto -->
        <div class="row mt-5">
          <div class="col-12 text-center">
            <h4 class="font-weight-bold italic-theme" style="color: #17a2b8;">
              {{ locale === 'uk'
                ? 'Aivixtech — модернізуємо майбутнє, забезпечуємо стійкість сьогодні.'
                : 'Aivixtech — modernizing the future, ensuring resilience today.' }}
            </h4>
          </div>
        </div>

      </div>
    </div>
    <!-- about us content wrapper end -->
  </div>
</template>

<script setup lang="ts">
import { useLocale } from '~/composables/useLocale';

const { locale, t } = useLocale();

// Page metadata
useHead({
  title: locale.value === 'uk' ? 'Про нас - Aivixtech' : 'About Us - Aivixtech',
  meta: [
    {
      name: 'description',
      content: locale.value === 'uk'
        ? 'Aivixtech — ваш технологічний партнер у сфері системної інтеграції, енергоефективних рішень та постачання обладнання MINISFORUM.'
        : 'Aivixtech is your technology partner in system integration, energy-efficient solutions, and supply of MINISFORUM equipment.'
    }
  ]
});
</script>

<style scoped>
.about-us-wrapper {
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

.badge-warning-theme {
  background-color: #fff8e1;
  color: #ff8f00;
  font-size: 12px;
  padding: 6px 14px;
  border-radius: 50px;
  letter-spacing: 1px;
  font-weight: 700;
}

.color-dark {
  color: #2b2b2b;
}

.main-intro-card {
  border: none;
  transition: transform 0.3s ease;
}

.border-top-theme {
  border-top: 4px solid #17a2b8;
}

.focus-card {
  border: none;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  flex-direction: column;
}

.focus-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
  border-top-color: #117a8b;
}

.focus-icon-wrap {
  width: 60px;
  height: 60px;
  background-color: #eaf6f8;
  color: #17a2b8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  transition: all 0.3s ease;
}

.focus-card:hover .focus-icon-wrap {
  background-color: #17a2b8;
  color: #fff;
  transform: rotate(15deg);
}

.energy-highlight-card {
  background: linear-gradient(135deg, #102a43 0%, #17a2b8 100%);
  border: none;
  position: relative;
  overflow: hidden;
}

.energy-icon-big {
  font-size: 70px;
  color: #ffc107;
  text-shadow: 0 0 20px rgba(255, 193, 7, 0.5);
  animation: pulse 2s infinite ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.08);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.9;
  }
}

.partnership-card {
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.partnership-logo-wrap {
  min-width: 180px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.partnership-logo-wrap:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
}

.italic-theme {
  font-style: italic;
  letter-spacing: 0.5px;
}
</style>
