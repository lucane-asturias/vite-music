<template>

  <app-header />

  <!-- will be replaced and loaded with the correct component based on route records -->
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <!-- will render whatever component is provided by the router view -->
      <component :is="Component"></component>
    </transition>
  </router-view>

  <app-player />

  <auth-modal />

</template>

<script setup>
  import { onMounted } from 'vue'
  import { useAuthStore } from '@/components/auth/store/authStore'
  
  import AppHeader from '@/components/Header.vue'
  import AuthModal from '@/modules/auth/views/Auth.vue'
  import AppPlayer from '@/views/Player.vue'

  const authStore = useAuthStore()

  onMounted(() => authStore.initLogin())
  
</script>

<style>
  /*  gets added when the element is entering the page */
  .fade-enter-from {
    opacity: 0;
  }
  /* gets added for the entirety of the animation. */
  .fade-enter-active {
    transition: all 0.2s linear;
  }
  /* gets added when leaving the document */
  .fade-leave-to {
    transition: all 0.2s linear;
    opacity: 0;
  }

</style>