import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../store/authStore'

export const useRegister = () => {
  const authStore = useAuthStore()
  const { locale } = useI18n({ useScope: 'global' })

  const reg_in_submission = ref(false) // keep track if registration form is in submisson
  const reg_show_alert = ref(false) // toggle visiblity of alert box
  const reg_alert_color = ref<string>('bg-blue-500') // indicate the form submission is in progress
  const reg_alert_msg = ref<string>('Please wait! Your account is being created.') // message of alert box

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

  return {
    reg_in_submission,
    reg_show_alert,
    reg_alert_color,
    reg_alert_msg,

    onRegister
  }
}