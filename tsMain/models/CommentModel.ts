import {Publication} from "./Publication";
import {User} from "./users/User";

export type CommentModel = Publication & {
    id: number
    author: User
    content: string
    date: Date
    parent: number
    post: number
    likedBy: number[]
    sharedBy: number[]
}