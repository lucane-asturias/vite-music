<template>
  <div class="text-white text-center font-bold p-5 mb-4" v-if="login_show_alert" :class="login_alert_color">
    {{ login_alert_msg }}        
  </div>
  <vee-form :validation-schema="loginSchema" @submit="onLogin">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('login.email') }}</label>
      <vee-field type="email" name="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email" />
       <ErrorMessage class="text-red-600" name="email" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('login.password') }}</label>
      <vee-field type="password" name="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password" />
        <ErrorMessage class="text-red-600" name="password" />
    </div>
    <button type="submit" :disabled="login_in_submission"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
        hover:bg-purple-700">
      {{ $t('login.submit') }}
    </button>
  </vee-form>
</template>

<script setup>
  import { ref, reactive } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { auth } from '@/includes/firebase'
  import { useAuthStore } from '@/stores/authStore'

  const authStore = useAuthStore()
  const { locale } = useI18n({ useScope: 'global' })

  const loginSchema = reactive({
    email: 'required|email',
    password: 'required|min:3|max:32',
  })

  const login_in_submission = ref(false) // keep track if login form is in submisson (prevent excessive request)
  const login_show_alert = ref(false) // toggle visiblity of alert box
  let login_alert_color = 'bg-blue-500' // indicate the form submission is in progress
  let login_alert_msg = 'Please wait! We are logging you in.' // message of alert box

  const onLogin = async (values) => {
    login_show_alert.value = true // active alert visibility
    login_in_submission.value = true // disable form button
    login_alert_color = 'bg-blue-500'

    if (locale.value === 'pt') {
      login_alert_msg = 'Espere, por favor. Estamos lhe conectando.'
    } else if (locale.value === 'zh') {
      login_alert_msg = '请稍候! 我们正在为您登录。'
    } else if (locale.value === 'ja') {
      login_alert_msg = 'お待ちください。 ログインしています。'
    } else {
      login_alert_msg = 'Please wait! We are logging you in.'
    }

    try {
      await authStore.loginUser(values)
    } catch (error) {
      login_in_submission.value = false // disable form button
      login_alert_color = 'bg-red-500'

      if (locale.value === 'pt') {
        login_alert_msg = 'Dados de login inválidos.'
      } else if (locale.value === 'zh') {
        login_alert_msg = '无效的登录信息。'
      } else if (locale.value === 'ja') {
        login_alert_msg = 'ログイン情報が無効です。'
      } else {
        login_alert_msg = 'Invalid login details.'
      }

      return // prevent to run further
    }

    login_alert_color = 'bg-green-500'

    if (locale.value === 'pt') {
      login_alert_msg = 'Sucesso! Você está logado agora.'
    } else if (locale.value === 'zh') {
      login_alert_msg = '成功！ 你现在已经登录了。'
    } else if (locale.value === 'ja') {
      login_alert_msg = '成功！ あなたはログインしています。'
    } else {
      login_alert_msg = 'Success! You are now logged in.'
    }
    
    // window.location.reload()
    authStore.toggleAuthModal()
  }
</script>
