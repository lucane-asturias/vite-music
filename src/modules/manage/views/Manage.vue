<template>
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <app-upload ref="upload" :addSong="addSong" />
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title text-xl">{{ $t('manage.my_songs') }}</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-3">
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
  import { useI18n } from 'vue-i18n'
  import { onBeforeRouteLeave } from 'vue-router'
  import { songsCollection, auth } from '@/includes/firebase'
  
  import AppUpload from '../components/Upload.vue'
  import CompositionItem from '../components/CompositionItem.vue'

  const { locale } = useI18n({ useScope: 'global' })

  const songs = ref([])
  const unsavedFlag = ref(false)
  const alert_message = ref('You have unsaved changes. Are you sure you want to leave?')

  onMounted(async () => {
    /* query if the user id in the collection matches the id of the user logged in
    ** the name of the property it should check in the document + comparation + value
    ** initiating the query by the get function which will return the document it finds */
    const snapshot = await songsCollection.where('uid', '==', auth.currentUser.uid).get()
    // for each snapshot run this function (argument is passed automatically)
    snapshot.forEach(addSong)
  })
    
  const updateSong = (i, values) => {
    songs.value[i].modified_name = values.modified_name
    songs.value[i].genre = values.genre
  }

  const removeSong = (i) => songs.value.splice(i, 1)

  const addSong = (document) => {
    const song = {
      ...document.data(), // the data inside the document (id not included)
      docID: document.id
    }

    songs.value.push(song)
  }

  const updateUnsavedFlag = (booleanFlag) => unsavedFlag.value = booleanFlag

  onBeforeRouteLeave((to, from, next) => {
    // if user does not have unsaved changes
    if (!unsavedFlag.value) { 
      next()
    } else {
        switch (locale.value) {
          case 'pt':
            alert_message.value = 'Você tem alterações não salvas. Você tem certeza de mudar de página?'
            break
          case 'zh':
            alert_message.value = '你有未得救的变化。你确定你要离开吗？'
            break
          case 'ja':
            alert_message.value = '保存されていない変更があります。そのままでいいんですか？'
          default:
            alert_message.value = 'You have unsaved changes. Are you sure you want to leave?'

        // will produce an prompt/alert which return a boolean value
        const leave = confirm(alert_message.value)
        next(leave)
      }
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