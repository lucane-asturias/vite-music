<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
      <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click.prevent="deleteSong">
        <i class="fa fa-times"></i>
      </button>
      <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showForm = !showForm">
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="showForm">
      <div class="text-white text-center font-bold p-4 mb-4" v-if="show_alert"
        :class="alert-color">
        {{ alert_message }}
      </div>
      <vee-form :validation-schema="schema" :initial-values="song" @submit="onEdit">
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field type="text" name="modified_name"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
              transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title" @input="updateUnsavedFlag(true)" />
          <!-- Retrieve the error by its name for the specific field -->
          <ErrorMessage class="text-red-600" name="modified_name" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field type="text" name="genre"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
              transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre" @input="updateUnsavedFlag(true)" />
          <ErrorMessage class="text-red-600" name="genre" />
        </div>
        <button type="submit" class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="in_submission">
          Submit
        </button>
        <button type="button" class="py-1.5 px-3 rounded text-white bg-gray-600"
          :disabled="in_submission" @click.prevent="showForm = false">
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script setup>
  import { songsCollection, storage } from '@/includes/firebase'
  import { ref, reactive } from 'vue'

  const showForm = ref(false)
  const schema = ref({
    modified_name: 'required',
    genre: 'alpha_spaces',
  })
  const inSubmission = ref(false)
  const show_alert = ref(false)
  const alert_color = 'bg-blue-500',
  const alert_message = 'Please wait! Updating song info.',
    
  const props = defineProps({
    song: {
      type: Object,
      required: true,
    },
    updateSong: {
      type: Function,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    removeSong: {
      type: Function,
      required: true,
    },
    updateUnsavedFlag: {
      type: Function,
    }
  })

  const onEdit = async (values) => { // vee-validate will pass the field values as an argument
    inSubmission.value = true
    show_alert.value = true
    alert_color = 'bg-blue-500'
    alert_message = 'Please wait! Updating song info.'

    try {
      // doc function allows to select a document by its id
      await songsCollection.doc(props.song.docID).update(values)
    } catch(error) {
      inSubmission.value = false // re-enable the form submission 
      alert_color = 'bg-red-500'
      alert_message = 'Something went wrong. Try again later.'
      return
    }

    // update song array in manage component
    props.updateSong(props.index, values)
    // passing false to indicate the user does not have any unsaved changes
    props.updateUnsavedFlag(false)

    inSubmission.value = false
    alert_color = 'bg-blue-500'
    alert_message = 'Success!'
  }
  
  const deleteSong = async () => {
    //delete song either in storage and database document
    const storageRef = storage.ref()
    // a relative child path to delete the file
    const songRef = storageRef.child(`songs/${props.song.original_name}`)

    await songRef.delete()

    // delete data from the collection
    await songsCollection.doc(props.song.docID).delete()

    props.removeSong(props.index)
  }
</script>
