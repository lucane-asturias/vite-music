import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../store/authStore'

export const useLogin = () => {
  const authStore = useAuthStore()
  const { locale } = useI18n({ useScope: 'global' })

  const login_in_submission = ref(false) // keep track if login form is in submisson (prevent excessive request)
  const login_show_alert = ref(false) // toggle visiblity of alert box
  const login_alert_color = ref<string>('bg-blue-500') // indicate the form submission is in progress
  const login_alert_msg = ref<string>('Please wait! We are logging you in.') // message of alert box

  const onLogin = async (values) => {
    login_show_alert.value = true // active alert visibility
    login_in_submission.value = true // disable form button
    login_alert_color.value = 'bg-blue-500'

    if (locale.value === 'pt') {
      login_alert_msg.value = 'Espere, por favor. Estamos lhe conectando.'
    } else if (locale.value === 'zh') {
      login_alert_msg.value = '请稍候! 我们正在为您登录。'
    } else if (locale.value === 'ja') {
      login_alert_msg.value = 'お待ちください。 ログインしています。'
    } else {
      login_alert_msg.value = 'Please wait! We are logging you in.'
    }

    try {
      await authStore.loginUser(values)
    } catch (error) {
      login_in_submission.value = true // disable form button
      login_alert_color.value = 'bg-red-500'

      if (locale.value === 'pt') {
        login_alert_msg.value = 'Dados de login inválidos.'
      } else if (locale.value === 'zh') {
        login_alert_msg.value = '无效的登录信息。'
      } else if (locale.value === 'ja') {
        login_alert_msg.value = 'ログイン情報が無効です。'
      } else {
        login_alert_msg.value = 'Invalid login details.'
      }

      return // prevent to run further
    }

    login_alert_color.value = 'bg-green-500'

    if (locale.value === 'pt') {
      login_alert_msg.value = 'Sucesso! Você está logado agora.'
    } else if (locale.value === 'zh') {
      login_alert_msg.value = '成功！ 你现在已经登录了。'
    } else if (locale.value === 'ja') {
      login_alert_msg.value = '成功！ あなたはログインしています。'
    } else {
      login_alert_msg.value = 'Success! You are now logged in.'
    }
    
    // window.location.reload()
    authStore.toggleAuthModal()
  }

  return {
    login_in_submission,
    login_show_alert,
    login_alert_color,
    login_alert_msg,

    onLogin
  }
}