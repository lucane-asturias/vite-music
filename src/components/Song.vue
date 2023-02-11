<template>
	<main>
    <div>
      <!-- The params object will hold the dynamic segments in the route -->
      {{ $route.params.id }}
    </div>
		<!-- Music Header -->
	  <section class="w-full mb-8 py-14 text-center text-white relative">
	    <div class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
	      style="background-image: url(/assets/img/song-header.png)">
	    </div>
	    <div class="container mx-auto flex items-center">
	      <!-- Play/Pause Button -->
	      <button type="button" class="z-10 h-24 w-24 text-3xl bg-white text-black rounded-full
	        focus:outline-none" @click.prevent="newSong(song)">
	        <i class="fas" :class="{ 'fa-play': !playing, 'fa-pause': playing }"></i>
	      </button>
	      <div class="z-10 text-left ml-8">
	        <!-- Song Info -->
	        <div class="text-3xl font-bold">Song Title: {{ song.modified_name }}</div>
	        <div>{{ song.genre }} - いいわけは地獄できく</div>
	        <div class="song-price">{{ $n(1, 'currency', 'zh') }}</div>
	      </div>
	    </div>
	  </section>
	  <!-- Form -->
	  <section class="container mx-auto mt-6" id="comments">
	    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
	      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
	        <!-- Comment Count -->
	        <!-- <span class="card-title">Comments ({{ song.comment_count }})</span> -->
	        <span class="card-title">{{ $tc('song.comment_count', song.comment_count, { count: song.comment_count }) }}</span>
	        <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
	      </div>
	      <div class="p-6">
	      	<div class="text-white text-center font-bold p-4 mb-4" v-if="comment_show_alert"
	      		:class="comment_alert_color">
	      		{{ comment_alert_message }}
	      	</div>
	        <vee-form :validation-schema="schema" @submit="addComment" v-if="isUserLoggedIn">
	          <vee-field as="textarea" name="comment"
	            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
	              duration-500 focus:outline-none focus:border-black rounded mb-4"
	            placeholder="Your comment here..."></vee-field>
	          <ErrorMessage class="text-red-600" name="comment" />
	          <button type="submit" class="py-1.5 px-3 rounded text-white bg-green-600 block"
	          	:disabled="comment_in_submission">
	            Submit
	          </button>
	        </vee-form>
	        <!-- Sort Comments -->
	        <select v-model="sort"
	          class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition
	          duration-500 focus:outline-none focus:border-black rounded">
	          <option value="1" v-t="{ path: 'song.latest' }"></option>
	          <option value="2" v-t="{ path: 'song.oldest' }"></option>
	        </select>
	      </div>
	    </div>
	  </section>
	  <!-- Comments -->
	  <ul class="container mx-auto">
	    <li class="p-6 bg-gray-50 border border-gray-200" v-for="comment in sortedComments" 
	    	:key="comment.docID">
	      <!-- Comment Author -->
	      	<div class="mb-5">
	        <div class="font-bold">{{ comment.name }}</div>
	        <time>{{ comment.datePosted }}</time>
	      </div>

	      <p>{{ comment.content }}</p>
	    </li>
	  </ul>
	</main>
</template>

<script>
  import { ref, reactive, computed, onMounted, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { auth, songsCollection, commentsCollection } from '@/includes/firebase'
  import { useAuthStore } from '@/stores/authStore'

  export default {
    setup() {
      const route = useRoute()
      const router = useRouter()

      const authStore = useAuthStore()
      const schema = reactive({ comment: 'required|min:3' })

      const song = ref({})
      const comments = ref([])
      const comment_in_submission = ref(false)
      const comment_show_alert = ref(false)
      let comment_alert_color = 'bg-blue-500'
      let comment_alert_message = 'Please wait! Your comment is being submitted!'

      let sort = '1' // indicate that the order should be - by default - latest to oldest

      const isUserLoggedIn = computed(() => authStore.userLoggedIn)

      const sortedComments = () => {
    		// creating a copy of the original array and sorting it
    		return comments.value.slice().sort((a, b) => {
    			// if '1' sort in descending order (latest to oldest)
    			if (sort === '1') {
    				return new Date(b.datePosted) - new Date(a.datePosted)
    			}
    			// ascending order (oldest to latest)
    			return new Date(a.datePosted) - new Date(b.datePosted)
    		})
      }

    	// destructuring reset from context (optinal argument which contains methods related to the form)
    	const addComment = async (values, { resetForm }) => {
    		comment_in_submission.value = true
    		comment_show_alert.value = true
    		comment_alert_color = 'bg-blue-500'
    		comment_alert_message = 'Please wait! Your comment is being submitted!'

    		const commentObj = {
    			content: values.comment,
    			datePosted: new Date().toString(),
    			songID: route.params.id,
    			name: auth.currentUser.displayName,
    			uid: auth.currentUser.uid,
    		}

    		await commentsCollection.add(commentObj)

    		song.comment_count.value += 1 // como é?
    		await songsCollection.doc(route.params.id).update({
    			comment_count: song.comment_count.value,
    		})

    		this.getComments() // update comment list with newly added comment

    		comment_in_submission.value = false
    		comment_alert_color = 'bg-green-500'
    		comment_alert_message = 'Comment added!'

    		resetForm() // reset the values in the form to their original values (empty)
    	}

    	const getComments = async () => {
    		// retrieve id of the song based on the segment param
    		const snapshots = await commentsCollection.where('songID', '==', route.params.id).get()

    		comments.value = []

    		snapshots.forEach((document) => {
    			comments.value.push({
    				docID: document.id,
    				...document.data(),
    			})
    		})
    	}

      // prevent the watcher from updating the route to avoid visiting/pushing to the same url
      watch(sort, (newVal) => {
        if (newVal === route.query.sort) return
        // add query parameters to the current URL
        router.push({
          query: {
            sort: newVal
          }
        })
      })

      return {
        schema, song, comments, comment_in_submission, comment_show_alert, comment_alert_message, sort,
        isUserLoggedIn, sortedComments, addComment, getComments
      }
    },
    // use beforeRouterEnter to make perceived performance faster
    async beforeRouteEnter(to, from, next) {
      // get the specific doc from songs collection based on the route parameter id
      const docSnapshot = await songsCollection.doc(to.params.id).get()

      next((vm) => {
        /* * Accessing the components data via the VM parameter, 
         * * which it's a context to the component data, like the this keyword */
        if (!docSnapshot.exists) { // if the document is not in the collection
          vm.$router.push({ name: 'home' })
          return // prevent this if block to running further
        }

        const { sort } = route.query
        // checking if the value is valid
        vm.sort = sort === '1' || sort === '2' ? sort : '1'

        vm.song = docSnapshot.data()
        vm.getComments()
      })
    }
  }

</script>