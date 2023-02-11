<template>
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <app-upload ref="upload" :addSong="addSong" />
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">{{ $t('manage.my_songs') }}</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <!-- Composition Items (display songs) -->
            <composition-item v-for="(song, i) in songs" :key="song.docID" 
              :song="song" :updateSong="updateSong" :index="i" :removeSong="removeSong" 
              :updateUnsavedFlag="updateUnsavedFlag"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  // import store from '@/store' -- to access store in a guard
  import { ref, onMounted } from 'vue'
  import { onBeforeRouteLeave } from 'vue-router'
  import AppUpload from '@/components/Upload.vue'
  import CompositionItem from '@/components/CompositionItem.vue'
  import { songsCollection, auth } from '@/includes/firebase'

  const songs = ref([])
  const unsavedFlag = ref(false)

  onMounted(async () => {
    // query if the user id in the collection matches the id of the user logged in
    // the name of the property it should check in the document + comparation + value
    // initiating the query by the get function which will return the document it finds
    const snapshot = await songsCollection.where('uid', '==', auth.currentUser.uid).get()
    // for each snapshot run this function (argument is passed automatically)
    snapshot.forEach(addSong)
  })
    
  const updateSong = (i, values) => {
    this.songs[i].modified_name = values.modified_name
    this.songs[i].genre = values.genre
  }

  const removeSong = (i) => songs.value.splice(i, 1)

  const addSong = (document) => {
    const song = {
      ...document.data(), // the data inside the document (id not included)
      docID: document.id
    }

    songs.value.push(song)
  }

  const updateUnsavedFlag = (value) => unsavedFlag.value

  beforeRouteLeave((to, from, next) => {
    // if user does not have unsaved changes
    if (!unsavedFlag.value) { 
      next()
    } else {
      // will produce an prompt/alert which return a boolean value
      const leave = confirm(`You have unsaved changes. Are you sure you want to leave?`)
      next(leave)
    }
  })
  // beforeRouteLeave(to, from, next) {
  //   this.$refs.upload.cancelUploads()
  //   next()
  // },
  // the router will run it before rendering the component
  // beforeRouteEnter(to, from, next) {
  //   if (store.state.userLoggedIn) {
  //     next()
  //   } else {
  //     // redirect user to home page
  //     next({ name: 'home' })
  //   }
  // },

</script>