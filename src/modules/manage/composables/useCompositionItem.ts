import { ref } from 'vue'
import { songsCollection, storage } from '@/includes/firebase'

interface PropsType {
  song: object
  index: Number
  removeSong: Function
  updateSong: Function
  updateUnsavedFlag?: Function
}

const { locale } = useI18n({ useScope: 'global' })

export const useCompositionItem = (props: PropsType) => {
  const show_form = ref<boolean>(false)
  const show_alert = ref<boolean>(false)
  const in_submission = ref(false)
  const alert_color = ref<string>('bg-blue-500')
  const alert_message = ref<string>('Please wait! Updating song info.')
  const confirm_message = ref<string>('Are you sure you want to delete this music?')

  // vee-validate will pass the field values as an argument
  const onEdit = async (values) => { 
    in_submission.value = true
    show_alert.value = true
    alert_color.value = 'bg-blue-500'
    
    if (locale.value === 'pt') {
      alert_message.value = 'Por favor, espere! Atualizando informações sobre a música.'
    } else if (locale.value === 'zh') {
      alert_message.value = '请稍候! 更新歌曲信息。'
    } else if (locale.value === 'ja') {
      alert_message.value = 'お待ちください！ 音楽情報を更新しています。'
    } else {
      alert_message.value = 'Please wait! Updating song info.'
    }


    try {
      // doc function allows to select a document by its id
      await songsCollection.doc(props.song.docID).update(values)
    } catch(error) {
      in_submission.value = false // re-enable the form submission 
      alert_color.value = 'bg-red-500'

      if (locale.value === 'pt') {
        alert_message.value = 'Algo deu errado. Tente novamente mais tarde.'
      } else if (locale.value === 'zh') {
        alert_message.value = '出了点差错。稍后再试。'
      } else if (locale.value === 'ja') {
        alert_message.value = 'エラーが発生しました。後でもう一度試してみてください。'
      } else {
        alert_message.value = 'Something went wrong. Try again later.'
      }

      return
    }

    // update song array in manage component to reflect changes
    props.updateSong(props.index, values)
    // passing false to indicate the user does not have any unsaved changes
    props.updateUnsavedFlag(false)

    in_submission.value = false
    alert_color.value = 'bg-blue-500'

    if (locale.value === 'pt') {
      alert_message.value = 'Sucesso!'
    } else if (locale.value === 'ja' || locale.value === 'zh') {
      alert_message.value = '成功！'
    } else {
      alert_message.value = 'Success!'
    }
  }
  
  const onDelete = async () => {
    if (locale.value === 'pt') {
      confirm_message.value = 'Você tem certeza de apagar esta música?'
    } else if (locale.value === 'zh') {
      confirm_message.value = '你确定你要删除这首歌吗？'
    } else if (locale.value === 'ja') {
      confirm_message.value = 'この曲を本当に削除してよろしいですか？'
    } else {
      confirm_message.value = 'Are you sure you want to delete this music?'
    }

    const sure: boolean = confirm(confirm_message.value)

    if (!sure) return

    //delete song either in storage and database document
    const storageRef = storage.ref()
    // a relative child path to delete the file
    const songRef = storageRef.child(`songs/${props.song.original_name}`)

    await songRef.delete()

    // delete data from the collection
    await songsCollection.doc(props.song.docID).delete()
    // update song array in manage component to reflect changes
    props.removeSong(props.index)
  }

  return {
    show_form,
    show_alert,
    in_submission,
    alert_color,
    alert_message,
    confirm_message,

    onEdit,
    onDelete
  }
}