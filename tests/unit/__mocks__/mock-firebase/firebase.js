export const firebaseMock = () => ({
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
})