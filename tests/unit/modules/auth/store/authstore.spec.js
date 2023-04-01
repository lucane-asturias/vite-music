import { createPinia, setActivePinia, storeToRefs } from 'pinia'
import { shallowMount } from '@vue/test-utils'
import { useAuthStore } from '@/modules/auth/store/authStore'

vi.mock('@/includes/firebase', () => ({
  auth: {
    createUserWithEmailAndPassword: vi.fn(() => { 
      return {
        user: {
          uid: 1,
          updateProfile: () => Promise.resolve()
        }
      }
    }),
    currentUser: 'test purposes',
    signInWithEmailAndPassword: () => Promise.resolve(),
    signOut: () => Promise.resolve()
  },
  usersCollection: {
    doc: vi.fn(() => {
      return {
        set: vi.fn(() => Promise.resolve())
      }
    })
  }
}))

describe('Pinia - Tests in the Auth Module Store', () => {
  let authStore
  // SETUP - run prior to each unit test
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia())

    // create an instance of the auth store
    authStore = useAuthStore()
  })

  // Basics ==================
  
  test('this is the initial and default state, should\'ve this state', () => {      
    expect(authStore.authModalShow).toBeFalsy()
    expect(authStore.userLoggedIn).toBeFalsy()
  })

  // Actions ==================

  test('action: registerUser', async () => {
    await authStore.registerUser({})
    expect(authStore.userLoggedIn).toBeTruthy()
  })

  test('action: loginUser', async () => {
    await authStore.loginUser({})
    expect(authStore.userLoggedIn).toBeTruthy()
  })

  test('action: initLogin and signOut', async () => {
    await authStore.initLogin()
    expect(authStore.toggleAuth).toBeTruthy()

    await authStore.signOut()
    expect(authStore.userLoggedIn).toBeFalsy()
  })
    
})