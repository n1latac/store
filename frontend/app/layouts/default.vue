<template>
  <div class="oregon-store-layout">
    <Header />
    <slot />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from '~/components/Header.vue';
import Footer from '~/components/Footer.vue';

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Oregon Store` : 'Oregon - Multipurpose Store';
  },
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: 'Магазин компьютерной техники и электроники Oregon' },
    { charset: 'utf-8' }
  ],
  link: [
    { rel: 'shortcut icon', href: '/assets/img/favicon.ico', type: 'image/x-icon' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Rubik:300,300i,400,400i,500,500i,700,900' },
    { rel: 'stylesheet', href: '/assets/css/vendor.css' },
    { rel: 'stylesheet', href: '/assets/css/style.css' }
  ],
  bodyAttrs: {
    class: 'body-bg'
  }
});
</script>

<style>
/* Reset some Nuxt/Tailwind overrides to ensure Bootstrap classes format correctly */
.oregon-store-layout a {
  text-decoration: none !important;
}
.oregon-store-layout ul {
  padding-left: 0;
  margin-bottom: 0;
}
.oregon-store-layout .btn:focus,
.oregon-store-layout button:focus {
  box-shadow: none !important;
  outline: none !important;
}
</style>
