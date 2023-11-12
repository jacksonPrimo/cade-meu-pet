export default {
  signIn(state: any, uid: any) {
    state.uid = uid
    localStorage.setItem('uid', uid);
  },
  signOut(state: any) {
    state.uid = null
    localStorage.removeItem('uid');
  },
}