import {PostModel} from "../models/post/PostModel";
import {User} from "../models/users/User";
import {EventData} from "../models/post/EventData";
import {OrderType} from "./types";
import {Requests, RequestType} from "./Requests";

export const REQTYPE_LIST_POSTS = new RequestType<ListPostsRequest>('List Posts')

export type ListPostsRequest = {
    page?: number
    per_page?: number
    search?: string
    after?: Date
    author?: number[]
    author_exclude?: number[]
    before?: Date
    exclude?: number[]
    include?: number[]
    offset?: number
    order?: OrderType
    orderby?: 'author'|'date'|'id'|'include'|'modified'|'parent'|'relevance'|'slug'|'include_slugs'|'title'
    slug?: string

}

export type PostResponse = {
    id: number
    date: string
    slug: string
    content: {
        rendered: string
        protected: boolean
    }
    comments?: number[],
    author_data: any,
    liked_by: number[],
    shared_by: number[],
    photos: string[],
    event_data: EventDataJson
}

export type EventDataJson = {
    date: string
    startTime: string
    endTime: string
    limit: number
    participants: string[]
    deadline: string
}

export function toPost(json: PostResponse): PostModel {
    const {
        id,
        date,
        slug,
        content,
        comments = [],
        author_data,
        liked_by,
        shared_by,
        photos,
        event_data
    } = json

    return {
        id: id,
        date: new Date(date),
        slug: slug,
        content: content.rendered,
        comments: comments,
        author: User.of(author_data),
        likedBy: liked_by,
        sharedBy: shared_by,
        photos: photos,
        eventData: jsonToEventData(event_data)
    } as PostModel
}


function jsonToEventData(json?: EventDataJson): EventData {
    if (!json) return null
    const {
        date,
        startTime,
        endTime,
        limit,
        participants,
        deadline
    } = json
    return {
        date: date,
        startTime: startTime,
        endTime: endTime,
        limit: limit,
        participants: participants,
        deadline: new Date(deadline)
    }
}

Requests.register(REQTYPE_LIST_POSTS, req => {
    const record: Record<string, string|null> = Object.fromEntries(
        Object.entries(req)
            .map(([key, value]) => {
                const valueType = typeof value
                const val: string
                    = valueType === 'string' ? value as string
                    : valueType === 'number' ? value.toString()
                    : value instanceof Array<number> ? value.join(',')
                    : value instanceof Date ? value.toISOString()
                    : undefined
                if (val === undefined) throw new Error()
                return [key, val]
            })
    )
    return new URLSearchParams(record)
})