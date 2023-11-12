import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth'

export default {
  initialState(context: any) {
    const storedUid = window.localStorage.getItem('uid');
    context.commit('signIn', storedUid);
  },

  async signInWithGoogle(context: any){
    try {
      const provider = new GoogleAuthProvider();
      const auth = await signInWithPopup(getAuth(), provider)
      context.commit('signIn', auth.user.uid)
    } catch(e) {
      return { error: e }
    }
  },
  async signInWithEmailAndPassword(context: any, credentials: { email: string, password: string }){
    try {
      const auth = await signInWithEmailAndPassword(getAuth(), credentials.email, credentials.password)
      const user = auth.user
      context.commit('signIn', user.uid)
    } catch(e) {
      return { error: e }
    }
  },
  signOut(context: any){
    signOut(getAuth())
    context.commit('signOut')
  }
}