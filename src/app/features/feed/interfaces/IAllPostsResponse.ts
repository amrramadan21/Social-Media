export interface AllPostsResponse {
  success: boolean
  message: string
  data: Data
  meta: Meta
}

export interface Data {
  posts: Post[]
}

export interface Post {
  _id: string
  body?: string
  privacy: string
  user: User
  likes: string[]
  createdAt: string
  commentsCount: number
  sharesCount: number
  likesCount: number
  isShare: boolean
  id: string
  bookmarked: boolean
  image?: string
}

export interface User {
  _id: string
  name: string
  username: string
  photo: string
}



export interface Meta {
  pagination: Pagination
}

export interface Pagination {
  currentPage: number
  numberOfPages: number
  limit: number
  nextPage: number
  total: number
}
