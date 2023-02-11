<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed
          border-gray-400 text-gray-400 transition duration-500 hover:text-white
          hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid' : isDragover }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="isDragover = false"
        @dragover.prevent.stop="isDragover = true"
        @dragenter.prevent.stop="isDragover = true"
        @dragleave.prevent.stop="isDragover = false"
        @drop.prevent.stop="onUpload($event)">
        <h5>{{ $t('upload.drop_files') }}</h5>
      </div>
      <input type="file" multiple @change="onUpload($event)">
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <!-- File Name -->
        <div class="font-bold text-sm" :class="upload.text_class">
          <i :class="upload.icon"></i> {{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div class="transition-all progress-bar"
            :class="upload.color"
            :style="{ width: upload.current_progress + '%' }">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { storage, auth, songsCollection } from '@/includes/firebase'
  import { ref, onBeforeUnmount } from 'vue'

  const isDragover = ref(false)
  const uploads = []

  const props = defineProps(['addSong'])

  const onUpload = (event) => {
    isDragover.value = false
    console.log(event)
    // convert both objects spreading to an array
    const files = event.dataTransfer 
    ? [...event.dataTransfer.files] // if event drag and drop
    : [...event.target.files] // else, event input file

    files.forEach((file) => {
      if (file.type !== 'audio/mpeg') return // end the current iteration

      if (!navigator.onLine) { // if user is not online, they can't upload files
        this.uploads.push({
          task: {},
          current_progress: 100,
          name: file.name,
          color: 'bg-red-400',
          icon: 'fas fa-times',
          text_class: 'text-red-400',
        })
        return
      }

      // creating reference which represents the path to storage (aka the bucketURL)
      // to let firebase know where to upload the file
      const storageRef = storage.ref()
      // music-c14fa.appspot.com/songs/example.mp3
      const songsRef = storageRef.child(`songs/${file.name}`)
      // result of uploading file to firebase storage
      const task = songsRef.put(file)
      // get last item in the array subtracting by one
      const uploadIndex = uploads.value.push({
        task,
        current_progress: 0,
        name: file.name,
        color: 'bg-blue-400',
        icon: 'fas fa-spinner fa-spin',
        text_class: '',
      }) - 1

      // The snapshot object contains information about the current upload
      // On is a listener to the state changed event, which will get emitted whenever the upload has progressed
      task.on('state_changed', (snapshot) => {
        // calculation to get the ~percentage~ of how much has been uploaded so far
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        // use the calculation above to update the current progress property corresponding to the object that represents the current upload.
        uploads.value[uploadIndex].current_progress = progress
      }, (error) => { // on error
        console.log(error)
        uploads.value[uploadIndex].color = 'bg-red-400'
        uploads.value[uploadIndex].icon = 'fas fa-times'
        uploads.value[uploadIndex].text_class = 'text-red-400'
      }, async () => { // on success
        // get id from currentUser object who's logged into the applicattion
        const song = {
          uid: auth.currentUser.uid,
          display_name: auth.currentUser.displayName,
          original_name: task.snapshot.ref.name,
          modified_name: task.snapshot.ref.name,
          genre: '',
          comment_count: 0,
        }
        // new property: url to the file where its stored publicly
        song.url = await task.snapshot.ref.getDownloadURL()
        // add song object to songs collection as document (add generate random id)
        const songRef = await songsCollection.add(song)
        const songSnapShot = await songRef.get() // returns a snapshot

        props.addSong(songSnapShot)

        uploads.value[uploadIndex].color = 'bg-green-400'
        uploads.value[uploadIndex].icon = 'fas fa-check'
        uploads.value[uploadIndex].text_class = 'text-green-400'
      })
    })
    console.log(files)
  }
  // cancelUploads() { // not using ref
  //   this.uploads.forEach((upload) => {
  //     upload.task.cancel()
  //   })
  // }
  onBeforeUnmount(() => {
    uploads.value.forEach((upload) => {
      upload.task.cancel()
    })
  })
</script>