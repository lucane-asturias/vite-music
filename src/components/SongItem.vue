<template>
  <li class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50">
    <div>
      <!-- /song/jW3N2QiCpFi4sply21oC -->
      <router-link :to="{ name: 'song', params: { id: song.docID } }" 
        class="font-bold block text-gray-600">
        {{ $t('song.title') }} {{ song.modified_name }}
      </router-link>
      <span class="text-gray-500 text-sm">{{ $t('song.artist') }} {{ song.display_name }}</span>
    </div>

    <div class="text-gray-600 text-lg">
      <router-link custom 
        :to="{ name: 'song', params: { id: song.docID }, hash: '#comments' }"
        v-slot="{ navigate }">
        <!-- clickable span -->
        <span class="comments" @click="navigate"> 
          <i class="fa fa-comments text-gray-600"></i>
          {{ song.comment_count }}
        </span>
      </router-link>
    </div>
  </li>
  <div class="space"></div>
</template>

<script setup>
  defineProps(['song'])
</script>

<style lang="css" scoped>
.space:last-of-type {
  margin-bottom: 100px;
}
</style>