import { Post } from '~/interfaces/post'

export default {
  async setPostToCreate(context: any, post: Partial<Post>){
    context.commit('setPostToCreate', post)
  },
}