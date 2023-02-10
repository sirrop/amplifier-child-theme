import {User} from "../users/User";
import {EventData} from "./EventData";
import {Publication} from "../Publication";

export type PostModel = Publication & {
    readonly type: 'post'
    readonly id: number
    readonly date: Date
    readonly slug: string
    readonly content: string
    readonly comments: number[]
    readonly author: User
    readonly likedBy: number[]
    readonly sharedBy: number[]
    readonly photos: string[]
    readonly eventData?: EventData
}