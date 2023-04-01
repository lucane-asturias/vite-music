<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!show_form">
      <h4 class="inline-block text-base lg:text-2xl font-semibold ">{{ song.modified_name }}</h4>
      <button class="ml-1 py-1 px-2 text-sm lg:text-xl rounded text-white bg-red-600 float-right"
        @click.prevent="onDelete">
        <i class="fa fa-times"></i>
      </button>
      <button class="ml-1 py-1 px-2 text-sm lg:text-xl rounded text-white bg-blue-600 float-right"
        @click.prevent="show_form = !show_form">
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="show_form">
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
          :disabled="in_submission" @click.prevent="show_form = false">
          {{ $t('composition_item.go_back') }}
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue'
  import { useI18n } from 'vue-i18n'

  import { useCompositionItem } from '../composables/useCompositionItem'

  const schema = reactive({ modified_name: 'required', genre: 'alpha_spaces' })

  interface Props {
    song: object
    index: Number
    removeSong: Function
    updateSong: Function
    updateUnsavedFlag?: Function
  }
    
  const props = defineProps<Props>()

  const { 
    show_form,
    show_alert,
    in_submission,
    alert_color,
    alert_message,
    confirm_message,

    onEdit,
    onDelete
  } = useCompositionItem(props)
  
</script>
