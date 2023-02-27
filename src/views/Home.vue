<template>
  <main>
    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
      <div class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(assets/img/header.png)"></div>
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <!-- <h1 class="font-bold text-5xl mb-5">Listen to Great Music!</h1> -->
          <h1 class="font-bold text-5xl mb-5">
            {{ $t('home.listen') }}
          </h1>
          <p class="w-full md:w-8/12 mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Phasellus et dolor mollis, congue augue non, venenatis elit.
            Nunc justo eros, suscipit ac aliquet imperdiet, venenatis et
            sapien. Duis sed magna pulvinar, fringilla lorem eget,
            ullamcorper urna.
          </p>
        </div>
      </div>

      <img class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
        src="assets/img/introduction-music.png" />
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200" 
          v-icon.right.yellow="'headphones-alt'">
          <span class="card-title" v-t="{ path: 'home.songs' }"></span>
          <!-- Icon -->
        </div>
        <!-- Playlist -->
        <ol id="playlist">
          <!-- <song-item v-for="song in songs" :key="song.docID" :song="song" /> -->
        </ol>
        <!-- .. end Playlist -->
      </div>
    </section>
  </main>
</template>

<script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import { songsCollection } from '@/includes/firebase'
  import SongItem from '@/components/SongItem.vue'

  const maxPerPage = 3
  const songs = ref([])
  const pendingRequest = ref(false)
  
  const handleScroll = () => {
    // check the current scroll position of the page
    const { scrollTop, offsetHeight } = document.documentElement
    const { innerHeight } = window
    // check if the sum of scrollTop and innerHeight properties are equal to the offsetHeight
    // const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight
    // alternative optional solution (less strict):
    const bottomOfWindow = Math.round(scrollTop) + innerHeight > offsetHeight - 100

    // detect if its at the bottom of the page to get more songs
    if (bottomOfWindow) this.getSongs()
  }

  const getSongs = async () => {
    // stop further requests from running
    if (pendingRequest.value) return

    pendingRequest.value = true
    let snapshots

    if (songs.value.length) { // if there's data
      // query last doc in the songsCollection by passing the id of the last object in the songs array
      const lastDoc = await songsCollection.doc(songs.value[songs.value.length - 1].docID).get()
      // retrieve the documents in the songs collection (limited by the first three results)
      snapshots = await songsCollection
        .orderBy('modified_name')
        .startAfter(lastDoc) // start the query after the last set of documents
        .limit(maxPerPage)
        .get()
    } else {
      // initial request: get the first 3 songs
      snapshots = await songsCollection
        .orderBy('modified_name')
        .limit(maxPerPage)
        .get()
    }

    snapshots.forEach((document) => {
      songs.value.push({
        docID: document.id,
        ...document.data(),
      })
    })

    pendingRequest.value = false
  }

  onMounted(() => {
    getSongs()

    window.addEventListener('scroll', handleScroll())
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll())
  })

</script>