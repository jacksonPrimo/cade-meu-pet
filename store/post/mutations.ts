import { Post } from "~/interfaces/post";

export default {
  setPostToCreate(state: any, post: Partial<Post>) {
    state.postToCreate = { ...state.postToCreate, ...post }
  },
}