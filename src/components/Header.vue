<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link class="text-white font-bold uppercase text-xl lg:text-2xl mr-3 mt-1" 
        :to="{ name: 'home' }" exact-active-class="no-active">
        {{ $t('header.music') }}
      </router-link>

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li v-if="!isUserLoggedIn">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal">
              {{ $t('header.login_register') }}
            </a>
          </li>
          <template v-else>
            <li>
              <router-link class="px-2 text-white" :to="{ name: 'manage' }">
                {{ $t('header.manage') }}
              </router-link>
            </li>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent='signOutUser'>
                {{ $t('header.logout') }}
              </a>
            </li>
          </template>
          <li>
            <router-link class="px-2 text-white sm:invisible lg:visible" :to="{ name: 'about' }">
              {{ $t('header.about') }}
            </router-link>
          </li>
        </ul>
        <ul class="flex flex-row mt-1 ml-auto">
          <select @click.prevent="changeLocale"
            class="appearance-none text-sm lg:text-base ml-auto w-12 sm:w-full lg:h-full bg-gray-200 border border-gray-200 text-gray-700 
              py-3 px-4 pr-4 lg:pr-1 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500
              text-base font-normal lg:font-semibold tracking-normal lg:tracking-widest" 
          >
            <option value="en">English</option>
            <option value="pt">Portuguese</option>
            <option value="ja">Japanese</option>
            <option value="zh">Chinese</option>
        </select>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup>
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useAuthStore } from '@/modules/auth/store/authStore'
  import { setLocale } from '@vee-validate/i18n'
  
  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()
  const { locale } = useI18n({ useScope: 'global' })

  const isUserLoggedIn = computed(() => authStore.userLoggedIn)
    
  const toggleAuthModal = () => authStore.toggleAuthModal()

  const signOutUser = () => {
    authStore.signOut()
    if (route.meta.requiresAuth) {
      // redirect by pushing the next path when user signs out on manage page
      router.push({ name: 'home' })
    }
  }
  
  const changeLocale = (event) => {
    if (event.target.value === 'pt') {
      locale.value = 'pt'
      setLocale('pt_BR')
    } else if (event.target.value === 'ja') {
      locale.value = 'ja'
      setLocale('ja')
    } else if (event.target.value === 'zh') {
      locale.value = 'zh'
      setLocale('zh')
    } else {
      locale.value = 'en'
      setLocale('en')
    }
  }
    
</script>