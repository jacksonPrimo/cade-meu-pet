enum Situation {
  Lost, Found, Adoption
}

export interface Post {
  id: String
  userId: String
  image: String
  name: String
  description: String
  reward: Number
  gender: String
  race: String
  situation: Situation
  created: Date
  addressLabel: String
  addressLat: number,
  addressLong: number,
}