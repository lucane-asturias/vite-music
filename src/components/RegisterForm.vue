<template>
  <div class="text-white text-center font-bold p-5 mb-4" v-if="reg_show_alert" :class="reg_alert_color">
    {{ reg_alert_msg }}              
  </div>
  <vee-form :validation-schema="registerSchema" 
    @submit="onRegister" :initial-values="defaultUserData">
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('register.name') }}</label>
      <vee-field type="text" name="name"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Name" />
        <!-- will generate span tag if there is error -->
        <ErrorMessage class="text-red-600" name="name" />
    </div>
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('register.email') }}</label>
      <vee-field type="email" name="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email" />
        <ErrorMessage class="text-red-600" name="email" />
    </div>
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('register.age') }}</label>
      <vee-field type="number" name="age"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded" placeholder="Enter your age" />
        <ErrorMessage class="text-red-600" name="age" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('register.password') }}</label>
      <vee-field name="password" :bails="false" v-slot="{ field, errors }">
        <input type="password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password" v-bind="field" />
        <div class="text-red-600" v-for="error in errors" :key="error">
            {{ error }}
        </div>   
      </vee-field>
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('register.confirm_password') }}</label>
      <vee-field type="password" name="confirm_password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Confirm Password" />
        <ErrorMessage class="text-red-600" name="confirm_password" />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t('register.country') }}</label>
      <vee-field as="select" name="country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded">
        <option value="USA">USA</option>
        <option value="Portugues">Português</option>
        <option value="Espanol">Espanol</option>
        <option value="日本語">日本語</option>
        <option value="中文">中文</option>
        <option value="Antarctica">Antarctica</option>
      </vee-field>
      <ErrorMessage class="text-red-600" name="country" />
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <vee-field type="checkbox" name="tos" value="1" :validateOnInput="true"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded" />
      <i18n-t class="inline-block" keypath="register.accept" tag="label" scope="global">
        <a href="#">{{ $t('register.TOS') }}</a>
      </i18n-t>
      <ErrorMessage class="text-red-600 block" name="tos" />
    </div>
    <button type="submit" :disabled="reg_in_submission"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
        hover:bg-purple-700">
      {{ $t('register.submit') }}
    </button>
  </vee-form>
</template>

<script setup>
  import { ref, reactive } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useAuthStore } from '@/stores/authStore'

  const authStore = useAuthStore()

  const { locale } = useI18n({ useScope: 'global' })

  const defaultUserData = reactive({ country: 'USA'  })
  const registerSchema = reactive({
    name: 'required|min:3|max:100|alpha_spaces',
    email: 'required|min:3|max:100|email',
    age: 'required|min_value:18|max_value:100',
    password: 'required|min:3|max:100',
    confirm_password: 'passwords_mismatch:@password',
    country: 'required|country_excluded:Antarctica', //excluded: list of values the input must not match
    tos: 'tos'
  })

  const reg_in_submission = ref(false) // keep track if registration form is in submisson
  const reg_show_alert = ref(false) // toggle visiblity of alert box
  let reg_alert_color = ref('bg-blue-500') // indicate the form submission is in progress
  let reg_alert_msg = ref('Please wait! Your account is being created.') // message of alert box

  const onRegister = async (values) => {
    reg_show_alert.value = true // turn alert visibility on
    reg_in_submission.value = true // disable form button
    reg_alert_color.value = 'bg-blue-500'

    if (locale.value === 'pt') {
      reg_alert_msg.value = 'Aguarde! Sua conta está sendo criada.'
    } else if (locale.value === 'zh') {
      reg_alert_msg.value = '请等待! 您的账户正在创建中。'
    } else if (locale.value === 'ja') {
      reg_alert_msg.value = 'しばらくお待ちください お客様のアカウントを作成中です。'
    } else {
      reg_alert_msg.value = 'Please wait! Your account is being created.'
    }

    try {
      await authStore.registerUser(values)
    } catch (error) {
      reg_in_submission.value = true
      reg_alert_color.value = 'bg-red-500'

      if (locale.value === 'pt') {
        reg_alert_msg.value = 'Foi gerado um erro inesperado. Tente novamente.'
      } else if (locale.value === 'zh') {
        reg_alert_msg.value = '一个意料之外的问题发生了。 请稍后再试。'
      } else if (locale.value === 'ja') {
        reg_alert_msg.value = '予期せぬエラーが発生しました。後でもう一度お試しください。'
      } else {
        reg_alert_msg.value = 'An unexpected error ocurred. Please try again later.'
      }

      return // stop the function from executing further
    }

    reg_alert_color.value = 'bg-green-500'

    if (locale.value === 'pt') {
      reg_alert_msg.value = 'Sucesso! Sua conta foi criada.'
    } else if (locale.value === 'zh') {
      reg_alert_msg.value = '成功！ 您的帐号已经建立。'
    } else if (locale.value === 'ja') {
      reg_alert_msg.value = '成功! お客様のアカウントが作成されました。'
    } else {
      reg_alert_msg.value = 'Success! Your account has been created.'
    }

    // window.location.reload()
    authStore.toggleAuthModal()
  }
</script>
