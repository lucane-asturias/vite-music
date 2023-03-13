<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-base lg:text-2xl font-semibold ">{{ song.modified_name }}</h4>
      <button class="ml-1 py-1 px-2 text-sm lg:text-xl rounded text-white bg-red-600 float-right"
        @click.prevent="deleteSong">
        <i class="fa fa-times"></i>
      </button>
      <button class="ml-1 py-1 px-2 text-sm lg:text-xl rounded text-white bg-blue-600 float-right"
        @click.prevent="showForm = !showForm">
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="showForm">
      <div class="text-white text-center font-semibold p-4 mb-4" v-if="show_alert"
        :class="alert_color">
        {{ alert_message }}
      </div>
      <vee-form :validation-schema="schema" :initial-values="song" @submit="onEdit">
        <div class="mb-3">
          <label class="inline-block mb-2">{{ $t('composition_item.song_title') }}</label>
          <vee-field type="text" name="modified_name"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
              transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title" @input="updateUnsavedFlag(true)" />
          <!-- Retrieve the error by its name for the specific field -->
          <ErrorMessage class="text-red-600" name="modified_name" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">{{ $t('composition_item.genre') }}</label>
          <vee-field type="text" name="genre"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
              transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre" @input="updateUnsavedFlag(true)" />
          <ErrorMessage class="text-red-600" name="genre" />
        </div>
        <button type="submit" class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="in_submission">
          {{ $t('composition_item.submit') }}
        </button>
        <button type="button" class="py-1.5 px-3 rounded text-white bg-gray-600"
          :disabled="in_submission" @click.prevent="showForm = false">
          {{ $t('composition_item.go_back') }}
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue'
  import { useI18n } from 'vue-i18n'

  import { songsCollection, storage } from '@/includes/firebase'

  const { locale } = useI18n({ useScope: 'global' })

  const schema = reactive({ modified_name: 'required', genre: 'alpha_spaces' })
  const showForm = ref(false)
  const in_submission = ref(false)
  const show_alert = ref(false)
  const alert_color = ref('bg-blue-500')
  const alert_message = ref('Please wait! Updating song info.')
  const confirm_message = ref('Are you sure you want to delete this music?')

  interface Props {
    song: object
    index: Number
    removeSong: Function
    updateSong: Function
    updateUnsavedFlag?: Function
  }
    
  const props = defineProps<Props>()

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
  
  const deleteSong = async () => {
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
</script>
