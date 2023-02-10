import {User} from "./users/User";

export const PublicationType = {
    POST: 'post',
    COMMENT: 'comment'
} as const

export type PublicationType = typeof PublicationType[keyof typeof PublicationType]

export type Publication = {
    type: PublicationType
    id: number
    author: User
    date: Date
    content: string
    likedBy: number[]
    sharedBy: number[]
    photos: string[]
}