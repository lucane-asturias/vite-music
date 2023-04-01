import SongItem from '@/components/SongItem.vue'
import { shallowMount, RouterLinkStub } from '@vue/test-utils'

describe('Tests on the SongItem.vue component', () => {
  const song = { 
    display_name: 'test',
    docID: 'INDI9IiçJm!xRNIOQRO'
  }

  const wrapper = shallowMount(SongItem, {
    props: { song },
    global: {
      components: { 'router-link': RouterLinkStub },
      mocks: { $t: (translation) => translation },
    },
  })

  test('must match snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('renders song.display_name', () => {
    const compositionAuthor = wrapper.find('.text-gray-500')

    expect(compositionAuthor.text()).toBe(`song.artist ${song.display_name}`)
  })

  test('renders song.docID in id attribute', () => {
    // expect(wrapper.findComponent(RouterLinkStub).componentVM.to.params.id).toBe(song.docID)

    expect(wrapper.findComponent(RouterLinkStub).props().to).toEqual({ 
      name: 'song', 
      params: { id: song.docID }, 
    })
  })

})