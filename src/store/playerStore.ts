import { defineStore } from 'pinia'
import { Howl } from 'howler' // use to create a new audio object
import helper from '@/includes/helper'

export const usePlayerStore = defineStore('playerStore', {
  state: () => ({
    currentSong: {},
    song: {},
    seek: '00:00', // = current position
    duration: '00:00',
    playerProgress: '0%',
  }),
  actions: {
    async newSong(songPayload) {
      // Pause the current song, delete the instance and circuvent memory leaking issues
      if (this.song instanceof Howl) this.song.unload()

      this.currentSong = songPayload
      this.song = new Howl({
        src: [songPayload.url], // src of audio files to play
        html5: true,
      })

      this.song.play()

      // event emitted when audio is playing
      this.song.on('play', () => {
        requestAnimationFrame(this.progress)
      })
    },
    progress() {
      this.updatePosition()

      if (this.song.playing()) {
        // recursive until the audio gets paused or ends
        requestAnimationFrame(this.progress)
      }
    },
    updatePosition() {
      // the current position of the audio being played
      this.seek = helper.formatTime(this.song.seek())
      // full duration of the audio
      this.duration = helper.formatTime(this.song.duration())
      this.playerProgress = `${
        (this.song.seek() / this.song.duration()) * 100
      }%`
    },
    updateSeek(event) {
      if (!this.song.playing) return
      console.log('clientX > ', event.clientX)

      // --Document = 2000, -Timeline = 1000, --clientX = 1000, -Distance = 500
      const { x, width } = event.currentTarget.getBoundingClientRect() // information about the current element
      console.log(x, '< x, ', width, '< width')
      // relative to the docment - relative to the element
      const clickX = event.clientX - x // calculation to get the actual coordinate clicked

      const percentage = clickX / width // coordinate / width of the player
      const seconds = this.song.duration() * percentage

      this.song.seek(seconds) // update current position of the audio

      this.song.on('seek', () => this.progress) // update player (timeline)
    },
    toggleAudio() {
       // if the function not exists on the object
      if (!this.song.playing) return

      // if it is playing, pause the audio
      if (this.song.playing()) { 
        this.song.pause()
      } else {
        this.song.play()
      }
    },
  },
  getters: {
    isPlaying: (state) => {
      if (state.song.playing) return state.song.playing()

      return false
    }    
  }
})