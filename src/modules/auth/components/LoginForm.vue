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
  import { reactive } from 'vue'
  import { useLogin } from '../composables/useLogin'

  const loginSchema = reactive({
    email: 'required|email',
    password: 'required|min:3|max:32',
  })

  const { 
    login_in_submission, 
    login_show_alert, 
    login_alert_color, 
    login_alert_msg,
    
    onLogin 
  } = useLogin()

</script>
