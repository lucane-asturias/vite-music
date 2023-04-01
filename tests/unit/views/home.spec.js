import { shallowMount } from '@vue/test-utils'

import Home from '@/views/Home.vue'
import Icon from '@/directives/icon'

import { useGetSongs } from '@/composables/useGetSongs'
import { songMockData } from '../__mocks__/mock-data/test-song-data'


describe('Home.vue', () => {
  const wrapper = shallowMount(Home, {
    setup() {
      return { 
        songsRef: songMockData 
      }
    },
    global: {
      mocks: { $t: (translation) => translation },
      directives: {
        icon: Icon,
        t: {}
      },
    },
  })

  test('must match snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('should render three list of songs', () => {
    expect( wrapper.find('song-item').exists() ).toBeTruthy()
    expect( wrapper.findAll('song-item').length ).toBe(3)
    expect( wrapper.findAll('song-item').length ).toBe(songMockData.length)
  })

})
